import { NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      claudeApiKey: crmStore.settings.claudeApiKey ? '••••••••' + crmStore.settings.claudeApiKey.slice(-4) : '',
      geminiApiKey: crmStore.settings.geminiApiKey ? '••••••••' + crmStore.settings.geminiApiKey.slice(-4) : '',
      openaiApiKey: crmStore.settings.openaiApiKey ? '••••••••' + crmStore.settings.openaiApiKey.slice(-4) : '',
      defaultModel: crmStore.settings.defaultModel,
      globalAiActive: crmStore.settings.globalAiActive,
      hasClaudeKey: !!crmStore.settings.claudeApiKey,
      hasGeminiKey: !!crmStore.settings.geminiApiKey
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { claudeApiKey, geminiApiKey, openaiApiKey, defaultModel } = body;

    if (claudeApiKey !== undefined && !claudeApiKey.startsWith('••••')) {
      crmStore.settings.claudeApiKey = claudeApiKey;
    }
    if (geminiApiKey !== undefined && !geminiApiKey.startsWith('••••')) {
      crmStore.settings.geminiApiKey = geminiApiKey;
    }
    if (openaiApiKey !== undefined && !openaiApiKey.startsWith('••••')) {
      crmStore.settings.openaiApiKey = openaiApiKey;
    }
    if (defaultModel) {
      crmStore.settings.defaultModel = defaultModel;
    }

    return NextResponse.json({
      success: true,
      message: 'Cài đặt đã được lưu thành công!',
      hasClaudeKey: !!crmStore.settings.claudeApiKey,
      hasGeminiKey: !!crmStore.settings.geminiApiKey
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
