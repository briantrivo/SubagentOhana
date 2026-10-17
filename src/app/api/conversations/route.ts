import { NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get('channel');
  const filter = searchParams.get('filter'); // 'all', 'unread', 'needs_human', 'ai_active'
  const query = searchParams.get('q')?.toLowerCase() || '';

  let list = [...crmStore.conversations];

  if (channel && channel !== 'all') {
    list = list.filter(c => c.channel === channel);
  }

  if (filter === 'unread') {
    list = list.filter(c => c.unreadCount > 0);
  } else if (filter === 'needs_human') {
    list = list.filter(c => c.needsHuman);
  } else if (filter === 'ai_active') {
    list = list.filter(c => c.aiAutoReply);
  }

  if (query) {
    list = list.filter(c => 
      c.customerName.toLowerCase().includes(query) ||
      (c.customerPhone && c.customerPhone.includes(query)) ||
      c.lastMessageSnippet.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({
    success: true,
    data: list,
    total: list.length
  });
}
