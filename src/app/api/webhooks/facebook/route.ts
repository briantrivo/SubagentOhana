import { NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';
import { AIEngine } from '@/lib/ai-engine';

// GET for Meta Webhook Verification
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const VERIFY_TOKEN = 'ohana_verify_token_2026';

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return new Response('Forbidden', { status: 403 });
}

// POST for incoming Facebook Messenger events
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.object === 'page') {
      for (const entry of body.entry) {
        const webhookEvent = entry.messaging?.[0];
        if (webhookEvent && webhookEvent.message && webhookEvent.message.text) {
          const senderPsid = webhookEvent.sender.id;
          const text = webhookEvent.message.text;

          // Process conversation
          const conv = crmStore.conversations.find(c => c.channel === 'facebook') || crmStore.conversations[0];
          crmStore.addMessage(conv.id, {
            conversationId: conv.id,
            sender: 'customer',
            text,
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          });

          if (conv.aiAutoReply) {
            await AIEngine.executeSubagent(conv.id, text);
          }
        }
      }
      return NextResponse.json({ status: 'EVENT_RECEIVED' });
    }

    return NextResponse.json({ status: 'NOT_A_PAGE' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
