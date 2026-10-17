import { NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const conv = crmStore.getConversation(params.id);
  if (!conv) {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }
  const customer = crmStore.getCustomer(conv.customerId);
  return NextResponse.json({
    success: true,
    data: {
      conversation: conv,
      customer
    }
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = crmStore.updateConversation(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
