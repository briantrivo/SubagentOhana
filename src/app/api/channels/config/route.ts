import { NextResponse } from 'next/server';

// In-memory channel credentials config
const channelConfigs: Record<string, any> = {
  telegram: {
    botToken: '',
    webhookUrl: 'http://localhost:3005/api/webhooks/telegram'
  },
  facebook: {
    pageAccessToken: '',
    verifyToken: 'ohana_verify_token_2026',
    webhookUrl: 'http://localhost:3005/api/webhooks/facebook'
  },
  zalo_oa: {
    oaId: '',
    appId: '',
    secretKey: '',
    webhookUrl: 'http://localhost:3005/api/webhooks/zalo'
  },
  webchat: {
    widgetScript: '<script src="http://localhost:3005/widget.js" data-crm-id="ohana-crm"></script>'
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get('channelId');

  if (channelId && channelConfigs[channelId]) {
    return NextResponse.json({ success: true, data: channelConfigs[channelId] });
  }

  return NextResponse.json({ success: true, data: channelConfigs });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { channelId, config } = body;

    if (!channelId || !config) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
    }

    channelConfigs[channelId] = {
      ...(channelConfigs[channelId] || {}),
      ...config
    };

    return NextResponse.json({
      success: true,
      message: `Đã lưu cấu hình kênh ${channelId} thành công!`,
      data: channelConfigs[channelId]
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
