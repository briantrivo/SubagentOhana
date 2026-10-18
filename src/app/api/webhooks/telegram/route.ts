import { NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';
import { AIEngine } from '@/lib/ai-engine';

export async function POST(request: Request) {
  try {
    const update = await request.json();

    // Check if it's a regular message
    if (update.message && update.message.text) {
      const chatId = update.message.chat.id.toString();
      const fromName = update.message.from.first_name || update.message.from.username || 'Khách Telegram';
      const text = update.message.text;

      // Find or create customer
      let customer = crmStore.customers.find(c => c.channel === 'telegram' && c.name === fromName);
      if (!customer) {
        customer = {
          id: 'cust-tg-' + chatId,
          name: fromName,
          phone: '',
          email: '',
          channel: 'telegram',
          stage: 'Mới',
          tags: ['Telegram'],
          notes: 'Khách đến từ Telegram Bot',
          aiMemories: [],
          createdAt: new Date().toLocaleDateString('vi-VN')
        };
        crmStore.customers.push(customer);
      }

      // Find or create conversation
      let conv = crmStore.conversations.find(c => c.customerId === customer?.id);
      if (!conv) {
        conv = {
          id: 'conv-tg-' + chatId,
          customerId: customer.id,
          customerName: customer.name,
          channel: 'telegram',
          status: 'open',
          aiAutoReply: true,
          activeSubagentId: 'receptionist',
          activeSubagentName: 'Lễ tân',
          lastMessageSnippet: text,
          lastMessageTime: 'Vừa xong',
          unreadCount: 1,
          needsHuman: false,
          messages: []
        };
        crmStore.conversations.unshift(conv);
      }

      // Record customer message
      crmStore.addMessage(conv.id, {
        conversationId: conv.id,
        sender: 'customer',
        text,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      });

      // AI Auto reply
      if (conv.aiAutoReply) {
        const aiResult = await AIEngine.executeSubagent(conv.id, text);
        
        // If Telegram Bot Token is configured, reply directly to Telegram chat
        const botToken = crmStore.channelConfigs?.telegram?.botToken || process.env.TELEGRAM_BOT_TOKEN;
        if (botToken && aiResult.responseMessage) {
          try {
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: aiResult.responseMessage
              })
            });
          } catch (err) {
            console.error('Failed to send Telegram message:', err);
          }
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
