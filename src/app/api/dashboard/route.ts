import { NextResponse } from 'next/server';
import { crmStore } from '@/lib/store';

export async function GET() {
  const activeChannels = crmStore.channels.filter(c => c.isActive);
  const totalChannels = crmStore.channels.length;
  
  return NextResponse.json({
    success: true,
    data: {
      stats: {
        runningChannels: activeChannels.length,
        totalChannels: 8,
        disconnections: 0,
        messagesToday: 14,
        newCustomersToday: 6,
        aiRepliesToday: 6,
        waitingCustomers: 0
      },
      health: {
        healthyChannels: activeChannels.length,
        totalChannels: 8,
        okCount: activeChannels.length,
        errorCount: 0,
        disabledCount: 8 - activeChannels.length
      },
      tokens: crmStore.tokenStats,
      connectedChannels: crmStore.channels.filter(c => c.isActive),
      availablePlatforms: crmStore.channels
    }
  });
}
