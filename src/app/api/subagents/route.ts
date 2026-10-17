import { NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';
import { SubagentId } from '@/types/crm';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: crmStore.subagents,
    globalAiActive: crmStore.settings.globalAiActive
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, updates, globalAiActive } = body;

    if (typeof globalAiActive === 'boolean') {
      crmStore.settings.globalAiActive = globalAiActive;
    }

    if (id && updates) {
      const updated = crmStore.updateSubagent(id as SubagentId, updates);
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({
      success: true,
      data: crmStore.subagents,
      globalAiActive: crmStore.settings.globalAiActive
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
