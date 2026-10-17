import { NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';
import { AIEngine } from '@/lib/ai-engine';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { text, sender = 'human', forceAiReply = false, isSuggest = false } = body;
    const convId = params.id;

    const conv = crmStore.getConversation(convId);
    if (!conv) {
      return NextResponse.json({ success: false, error: 'Conversation not found' }, { status: 404 });
    }

    if (isSuggest) {
      // Gợi ý câu trả lời cho nhân viên
      const routeAgentId = AIEngine.routeSubagent(conv, conv.lastMessageSnippet);
      const subagent = crmStore.subagents.find(s => s.id === routeAgentId) || crmStore.subagents[0];
      const suggestion = `Dạ em xin thông báo bên em đã ghi nhận yêu cầu của anh. Em sẽ xử lý và phản hồi lại ngay cho anh nhé!`;
      return NextResponse.json({
        success: true,
        suggestion,
        subagentName: subagent.name
      });
    }

    // Nếu gửi tin nhắn bình thường
    if (text) {
      const newMsg = crmStore.addMessage(convId, {
        conversationId: convId,
        sender,
        text,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      });

      // Nếu người gửi là khách hàng và AI đang bật (hoặc forceAiReply)
      if (sender === 'customer' && (conv.aiAutoReply || forceAiReply)) {
        // AI Subagent xử lý
        const aiResult = await AIEngine.executeSubagent(convId, text);
        return NextResponse.json({
          success: true,
          message: newMsg,
          aiResult,
          conversation: crmStore.getConversation(convId)
        });
      }

      return NextResponse.json({
        success: true,
        message: newMsg,
        conversation: crmStore.getConversation(convId)
      });
    }

    // Trường hợp bấm nút "Để AI trả lời" khi chưa có tin mới
    if (forceAiReply) {
      const aiResult = await AIEngine.executeSubagent(convId, conv.lastMessageSnippet);
      return NextResponse.json({
        success: true,
        aiResult,
        conversation: crmStore.getConversation(convId)
      });
    }

    return NextResponse.json({ success: false, error: 'Missing text or action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
