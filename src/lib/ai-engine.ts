import { SubagentId, Conversation, Customer, Message } from '@/types/crm';
import { crmStore } from './store';

export interface AIResponseResult {
  selectedSubagentId: SubagentId;
  selectedSubagentName: string;
  responseMessage?: string;
  isHandoff: boolean;
  handoffReason?: string;
  toolsUsed: string[];
}

async function callGoogleGemini(
  apiKey: string,
  modelName: string,
  systemInstruction: string,
  userPrompt: string
): Promise<{ text: string; tokens: number } | null> {
  try {
    const cleanModel = modelName && modelName.startsWith('gemini') ? modelName : 'gemini-3.8-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        contents: [
          {
            parts: [{ text: userPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600
        }
      })
    });

    const data = await res.json();
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return {
        text: data.candidates[0].content.parts[0].text.trim(),
        tokens: data.usageMetadata?.totalTokenCount || 150
      };
    }
    if (data.error) {
      console.warn('Gemini API warning/error:', data.error.message);
    }
    return null;
  } catch (error) {
    console.error('Failed to call Gemini API:', error);
    return null;
  }
}

export class AIEngine {
  /**
   * 1. Bộ điều phối (Router Agent):
   * Đọc hội thoại và chọn MỘT subagent phù hợp nhất để trả lời tin nhắn mới nhất của khách.
   * Ưu tiên giữ nguyên subagent hiện tại nếu chủ đề chưa đổi.
   */
  public static routeSubagent(
    conversation: Conversation,
    newMessageText: string
  ): SubagentId {
    const textLower = newMessageText.toLowerCase();
    const current = conversation.activeSubagentId;

    // CSKH & Hậu mãi triggers:
    if (
      textLower.includes('chuyển khoản') ||
      textLower.includes('chưa thấy gửi') ||
      textLower.includes('chờ') ||
      textLower.includes('báo cáo') ||
      textLower.includes('khiếu nại') ||
      textLower.includes('lỗi') ||
      textLower.includes('hỏng') ||
      textLower.includes('hoàn tiền') ||
      textLower.includes('bực') ||
      textLower.includes('gửi rồi') ||
      textLower.includes('alo')
    ) {
      return 'support';
    }

    // Đặt lịch triggers:
    if (
      textLower.includes('đặt lịch') ||
      textLower.includes('hẹn') ||
      textLower.includes('mấy giờ') ||
      textLower.includes('giờ mở cửa') ||
      textLower.includes('huỷ lịch')
    ) {
      return 'booking';
    }

    // Tư vấn bán hàng triggers:
    if (
      textLower.includes('giá') ||
      textLower.includes('mua') ||
      textLower.includes('gói') ||
      textLower.includes('chi phí') ||
      textLower.includes('khuyến mãi') ||
      textLower.includes('giảm giá') ||
      textLower.includes('tư vấn') ||
      textLower.includes('chốt')
    ) {
      return 'sales';
    }

    // Chào hỏi, tìm hiểu ban đầu:
    if (
      textLower.includes('chào') ||
      textLower.includes('hi') ||
      textLower.includes('alo shop') ||
      textLower.includes('có ai ở đây không')
    ) {
      return 'receptionist';
    }

    // Nếu không có intent mới rõ rệt -> Giữ nguyên subagent hiện tại
    return current || 'receptionist';
  }

  /**
   * 2. Thực thi Subagent được chọn:
   * Chạy với Prompt riêng, tra cứu RAG kiến thức & kích hoạt Tool Calling
   */
  public static async executeSubagent(
    conversationId: string,
    customerMessageText: string
  ): Promise<AIResponseResult> {
    const conv = crmStore.getConversation(conversationId);
    if (!conv) {
      throw new Error('Conversation not found');
    }
    const customer = crmStore.getCustomer(conv.customerId);
    const textLower = customerMessageText.toLowerCase();

    // Bước 1: Điều phối định tuyến
    const selectedSubagentId = this.routeSubagent(conv, customerMessageText);
    const subagent = crmStore.subagents.find(s => s.id === selectedSubagentId) || crmStore.subagents[0];

    // Cập nhật subagent hiện tại cho hội thoại
    conv.activeSubagentId = selectedSubagentId;
    conv.activeSubagentName = subagent.name;

    const toolsUsed: string[] = [];

    // Kiểm tra số điện thoại trong tin nhắn để gọi Tool: Cập nhật hồ sơ khách
    const phoneMatch = customerMessageText.match(/(0[3|5|7|8|9][0-9]{8})/);
    if (phoneMatch && customer && !customer.phone) {
      customer.phone = phoneMatch[0];
      toolsUsed.push('Cập nhật hồ sơ khách (SĐT: ' + phoneMatch[0] + ')');
    }

    // Bước 2: Kiểm tra điều kiện Handoff to Human (Chuyển cho người thật)
    // Nếu khách giận dữ, dọa báo cáo page hoặc khiếu nại gay gắt
    const isAngry = 
      textLower.includes('báo cáo') ||
      textLower.includes('lừa đảo') ||
      (textLower.includes('alo') && conv.messages.some(m => m.isHandoffAlert)) ||
      textLower.includes('chờ cả buổi') ||
      textLower.includes('không trả lời');

    if (isAngry && selectedSubagentId === 'support') {
      toolsUsed.push('Chuyển cho người thật (handoff_to_human)');
      
      // Tắt AI tự trả lời & gán cờ needsHuman
      conv.aiAutoReply = false;
      conv.needsHuman = true;

      const handoffReason = 'khách bực vì chậm giao hàng, đã thanh toán 499.000đ.';

      // Tạo thông báo hệ thống chuyển giao
      crmStore.addMessage(conversationId, {
        conversationId,
        sender: 'system',
        text: `🤖 AI tắt và chuyển cho bạn: ${handoffReason}`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isHandoffAlert: true
      });

      crmStore.recordTokenUsage(145);

      return {
        selectedSubagentId,
        selectedSubagentName: subagent.name,
        isHandoff: true,
        handoffReason,
        toolsUsed
      };
    }

    // Bước 3: Tra kho kiến thức (RAG)
    let knowledgeSnippet = '';
    if (subagent.enabledTools.includes('Tra kho kiến thức')) {
      toolsUsed.push('Tra kho kiến thức');
      const foundKnowledge = crmStore.knowledge.find(k => 
        textLower.split(' ').some(w => w.length > 3 && k.content.toLowerCase().includes(w))
      );
      if (foundKnowledge) {
        knowledgeSnippet = `[Kiến thức tra cứu được]: ${foundKnowledge.title} - ${foundKnowledge.content}`;
      }
    }

    // Bước 4: Tạo câu trả lời của Subagent (Google Gemini AI thật hoặc Mô phỏng)
    let responseText = '';
    const customerName = customer?.name || 'anh/chị';
    let tokensUsed = 150;

    const apiKey = crmStore.settings.geminiApiKey;
    if (apiKey) {
      // Chuẩn bị System Instruction và Context
      const systemInstruction = `${subagent.systemPrompt}
Tên khách hàng: ${customerName}.
${knowledgeSnippet ? `Thông tin nội bộ: ${knowledgeSnippet}` : ''}
Yêu cầu: Trả lời tự nhiên, ngắn gọn, ấm áp, đúng vai trò ${subagent.name}. Không bịa đặt chính sách ngoài thông tin nội bộ.`;

      const chatHistory = conv.messages.slice(-4).map(m => `${m.sender === 'customer' ? 'Khách' : 'AI'}: ${m.text}`).join('\n');
      const prompt = `Lịch sử gần đây:\n${chatHistory}\nTin mới nhất của khách: ${customerMessageText}\nTrả lời khách:`;

      const geminiResult = await callGoogleGemini(
        apiKey,
        subagent.customModel || crmStore.settings.defaultModel || 'gemini-3.8-flash',
        systemInstruction,
        prompt
      );

      if (geminiResult && geminiResult.text) {
        responseText = geminiResult.text;
        tokensUsed = geminiResult.tokens;
        toolsUsed.push(`Google Gemini API (${subagent.customModel || 'gemini-3.8-flash'})`);
      }
    }

    // Fallback nếu chưa có response từ Gemini
    if (!responseText) {
      if (selectedSubagentId === 'support') {
        if (textLower.includes('chuyển khoản') || textLower.includes('499k') || textLower.includes('chưa thấy')) {
          responseText = `Dạ em xin lỗi ${customerName} vì đã để anh chờ ạ. Anh gửi giúp em ảnh chụp giao dịch để em kiểm tra ngay nhé.`;
          if (customer && customer.stage !== 'Chốt đơn') {
            customer.stage = 'Chốt đơn';
            toolsUsed.push('Cập nhật hồ sơ khách (Giai đoạn -> Chốt đơn)');
          }
        } else {
          responseText = `Dạ em đã nhận được thông tin từ ${customerName}. Em đang đối soát với bộ phận kỹ thuật để hỗ trợ mình trong 2 phút tới ạ.`;
        }
      } else if (selectedSubagentId === 'sales') {
        toolsUsed.push('Tra kho kiến thức (Bảng giá)');
        responseText = `Dạ hiện bên em có gói Tiêu chuẩn ưu đãi 499.000đ đang tặng kèm 2 tháng sử dụng ạ. ${customerName} muốn em gửi chi tiết quyền lợi gói này không ạ?`;
      } else if (selectedSubagentId === 'booking') {
        toolsUsed.push('Ngày giờ hiện tại');
        toolsUsed.push('Hẹn nhắc / việc lặp');
        responseText = `Dạ em đã ghi nhận lịch hẹn của ${customerName}. Hệ thống sẽ nhắc việc trước 30 phút ạ!`;
      } else {
        responseText = `Dạ chào ${customerName} ạ! Em có thể hỗ trợ thông tin gì cho mình hôm nay ạ?`;
      }
    }

    // Lưu tin nhắn của subagent vào cuộc hội thoại
    const msg = crmStore.addMessage(conversationId, {
      conversationId,
      sender: 'subagent',
      subagentName: subagent.name,
      subagentIcon: subagent.icon,
      text: responseText,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    });

    crmStore.recordTokenUsage(tokensUsed);

    return {
      selectedSubagentId,
      selectedSubagentName: subagent.name,
      responseMessage: responseText,
      isHandoff: false,
      toolsUsed
    };
  }
}
