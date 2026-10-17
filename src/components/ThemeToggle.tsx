'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle({ className = '', variant = 'sidebar' }: { className?: string; variant?: 'sidebar' | 'pill' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'pill') {
    return (
      <button
        onClick={toggleTheme}
        aria-label="Chuyển đổi giao diện Sáng / Tối"
        title={isDark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer select-none ${
          isDark 
            ? 'bg-[#070b34]/90 border border-[#ad30fb]/50 text-[#f0f1f6] hover:border-[#2bb9f9] shadow-[0_0_15px_rgba(173,48,251,0.3)]'
            : 'bg-white border border-slate-300 text-slate-800 hover:border-amber-500 shadow-md'
        } ${className}`}
      >
        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
          isDark 
            ? 'bg-gradient-to-tr from-[#c044ff] to-[#3076fe] text-white shadow-[0_0_8px_#c044ff]'
            : 'bg-gradient-to-tr from-amber-400 to-orange-500 text-white shadow-[0_0_8px_#f59e0b]'
        }`}>
          {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
        </div>
        <span className="text-xs font-bold font-sans">
          {isDark ? 'Giao diện Tối' : 'Giao diện Sáng'}
        </span>
      </button>
    );
  }

  // Sidebar variant: fits the 96px sidebar cleanly
  return (
    <button
      onClick={toggleTheme}
      aria-label="Chuyển đổi giao diện Sáng / Tối"
      title={isDark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
      className={`w-full flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-300 cursor-pointer group ${
        isDark
          ? 'hover:bg-white/[0.08] text-[#cfc2d9] hover:text-white'
          : 'hover:bg-slate-200/80 text-slate-700 hover:text-slate-900'
      } ${className}`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 mb-1 ${
        isDark
          ? 'bg-[#150a2e] border border-[#ad30fb]/50 text-[#2bb9f9] group-hover:scale-105 shadow-[0_0_10px_rgba(43,185,249,0.3)]'
          : 'bg-amber-100 border border-amber-300 text-amber-700 group-hover:scale-105 shadow-sm'
      }`}>
        {isDark ? (
          <Moon className="w-4 h-4 text-[#2bb9f9] drop-shadow-[0_0_6px_#2bb9f9]" />
        ) : (
          <Sun className="w-4 h-4 text-amber-600 drop-shadow-[0_0_6px_#f59e0b]" />
        )}
      </div>
      <span className="text-[11px] font-bold leading-tight text-center">
        {isDark ? 'Tối' : 'Sáng'}
      </span>
    </button>
  );
}
