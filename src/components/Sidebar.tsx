'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  MessageSquare, 
  Users, 
  BarChart3, 
  Bot, 
  BookOpen, 
  Clock, 
  Share2, 
  Settings,
  Zap,
  ListTodo
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const NAV_ITEMS: SidebarItem[] = [
  { name: 'Tổng quan', href: '/dashboard', icon: Home },
  { name: 'Hộp thư', href: '/inbox', icon: MessageSquare, badge: 2 },
  { name: 'Khách', href: '/customers', icon: Users },
  { name: 'Pipeline', href: '/pipeline', icon: BarChart3 },
  { name: 'Subagent', href: '/subagents', icon: Bot },
  { name: 'Skill', href: '/skills', icon: Zap },
  { name: 'Nhiệm vụ', href: '/tasks', icon: ListTodo },
  { name: 'Kiến thức', href: '/knowledge', icon: BookOpen },
  { name: 'Nhắc việc', href: '/reminders', icon: Clock },
  { name: 'Kênh', href: '/channels', icon: Share2 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[96px] h-full max-h-screen crm-sidebar backdrop-blur-2xl flex flex-col items-center py-4 select-none flex-shrink-0 z-30 border-r shadow-lg transition-colors duration-300 overflow-hidden">
      {/* Brand Logo with Astronixa official image */}
      <div className="mb-4 flex flex-col items-center px-1 flex-shrink-0">
        <Link href="/dashboard" className="group flex flex-col items-center">
          <div className="relative w-12 h-12 rounded-2xl p-[1.5px] bg-gradient-to-tr from-[#c044ff] via-[#3076fe] to-[#2bb9f9] shadow-[0_0_20px_rgba(192,68,255,0.45)] transition-transform duration-200 group-hover:scale-105">
            <div className="w-full h-full crm-input rounded-[14px] overflow-hidden flex items-center justify-center p-1">
              <img
                src="/ohana-logo.jpg"
                alt="Astronixa Ohana"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
          <span className="text-[10px] font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#2bb9f9] to-[#fc3cff] mt-1.5 uppercase font-display">
            ASTRONIXA
          </span>
        </Link>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 w-full space-y-1.5 px-2 overflow-y-auto no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === '/inbox' && pathname === '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-gradient-to-b from-[#7e22ce]/20 to-[#3b82f6]/20 font-bold shadow-sm border border-[#b647ff]/60' 
                  : 'hover:bg-black/5 dark:hover:bg-white/[0.06] crm-text-secondary hover:crm-text-primary'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1.5 bg-gradient-to-b from-[#c044ff] to-[#2bb9f9] rounded-r-full shadow-[0_0_12px_#c044ff]" />
              )}
              
              <div className="relative">
                <Icon className={`w-5.5 h-5.5 mb-1 transition-colors ${
                  isActive 
                    ? 'text-[#2bb9f9] drop-shadow-[0_0_8px_rgba(43,185,249,0.7)]' 
                    : 'crm-text-secondary group-hover:text-[#c044ff]'
                }`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 bg-gradient-to-r from-[#c044ff] to-[#fc3cff] text-white text-[11px] font-black px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-[0_0_10px_rgba(252,60,255,0.6)]">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[12px] leading-tight text-center ${isActive ? 'crm-text-primary font-bold' : 'crm-text-secondary group-hover:crm-text-primary'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle & Settings at Bottom */}
      <div className="w-full px-2 pt-2 border-t border-[var(--crm-border)] space-y-1">
        <ThemeToggle variant="sidebar" />
        <Link
          href="/settings"
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 ${
            pathname === '/settings'
              ? 'bg-gradient-to-b from-[#7e22ce]/20 to-[#3b82f6]/20 font-bold border border-[#b647ff]/60 shadow-sm'
              : 'hover:bg-black/5 dark:hover:bg-white/[0.06] crm-text-secondary hover:crm-text-primary'
          }`}
        >
          <Settings className="w-5 h-5 mb-0.5 crm-text-secondary hover:text-[#2bb9f9] transition-colors" />
          <span className="text-[11px] font-medium">Cài đặt</span>
        </Link>
      </div>
    </aside>
  );
}
