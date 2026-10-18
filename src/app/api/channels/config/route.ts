import { NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get('channelId');

  if (channelId && crmStore.channelConfigs[channelId]) {
    return NextResponse.json({ success: true, data: crmStore.channelConfigs[channelId] });
  }

  return NextResponse.json({ success: true, data: crmStore.channelConfigs });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { channelId, config } = body;

    if (!channelId || !config) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
    }

    crmStore.channelConfigs[channelId] = {
      ...(crmStore.channelConfigs[channelId] || {}),
      ...config
    };

    // Auto register Telegram webhook if botToken is provided and on public host
    if (channelId === 'telegram' && config.botToken) {
      const host = request.headers.get('host');
      const proto = request.headers.get('x-forwarded-proto') || 'https';
      if (host && !host.includes('localhost')) {
        const webhookUrl = `${proto}://${host}/api/webhooks/telegram`;
        try {
          await fetch(`https://api.telegram.org/bot${config.botToken.trim()}/setWebhook?url=${encodeURIComponent(webhookUrl)}`);
        } catch (e) {
          console.error('Failed to auto register telegram webhook', e);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Đã lưu cấu hình kênh ${channelId} thành công!`,
      data: crmStore.channelConfigs[channelId]
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
