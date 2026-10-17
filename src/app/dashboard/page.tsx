'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Globe, 
  Smartphone, 
  MessageSquare, 
  Facebook, 
  Instagram, 
  Send, 
  Music, 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  Activity, 
  Layers 
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      if (data.success) {
        setDashboardData(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = dashboardData?.stats || {
    runningChannels: 1,
    totalChannels: 8,
    disconnections: 0,
    messagesToday: 14,
    newCustomersToday: 6,
    aiRepliesToday: 6,
    waitingCustomers: 0
  };

  const tokens = dashboardData?.tokens || {
    monthToken: 0,
    monthCalls: 0,
    todayToken: 0,
    todayCalls: 0,
    thirtyDaysToken: 0,
    thirtyDaysCalls: 0
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-6 text-[#f0f1f6]">
      {/* Top Banner with Astronixa Universe Style */}
      <div className="astronixa-card p-8 relative overflow-hidden group">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full astronixa-badge text-xs font-bold mb-3 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#2bb9f9]" />
              <span>ASTRONIXA UNIVERSE • OHANA AI MULTI-SUBAGENT</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white font-display">
              The Unified Universe <br />
              <span className="astronixa-title-gradient">of Autonomous Intelligence</span>
            </h1>
            <p className="text-sm text-[#cfc2d9] mt-2 max-w-2xl leading-relaxed">
              Hệ thống đa tác tử tự động hóa tiếp nhận khách hàng, phân loại ý định qua Router Agent và đồng bộ 8 kênh hội thoại trên nền tảng Astronixa.
            </p>
          </div>
          <div className="flex items-center gap-3.5 flex-shrink-0">
            <ThemeToggle variant="pill" />
            <Link
              href="/inbox"
              className="astronixa-btn-primary px-7 py-3 rounded-2xl text-sm font-bold flex items-center gap-2.5 transition-all shadow-xl"
            >
              <span>Mở Hộp thư trực tiếp</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KÊNH ĐANG CHẠY */}
        <div className="astronixa-card p-6 relative overflow-hidden group">
          <p className="text-xs font-black text-[#2bb9f9] uppercase tracking-wider">
            KÊNH ĐANG CHẠY
          </p>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-4xl font-black text-white font-display">
              {stats.runningChannels}
            </span>
            <span className="text-xs text-[#cfc2d9] font-semibold">
              trên {stats.totalChannels} kênh
            </span>
          </div>
        </div>

        {/* MẤT KẾT NỐI */}
        <div className="astronixa-card p-6 relative overflow-hidden group">
          <p className="text-xs font-black text-[#38ef7d] uppercase tracking-wider">
            MẤT KẾT NỐI
          </p>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-4xl font-black text-white font-display">
              {stats.disconnections}
            </span>
            <span className="text-xs text-emerald-400 font-semibold">
              Không có lỗi
            </span>
          </div>
        </div>

        {/* TIN KHÁCH HÔM NAY */}
        <div className="astronixa-card p-6 relative overflow-hidden group">
          <p className="text-xs font-black text-[#fc3cff] uppercase tracking-wider">
            TIN KHÁCH HÔM NAY
          </p>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-4xl font-black text-white font-display">
              {stats.messagesToday}
            </span>
            <span className="text-xs text-[#cfc2d9] font-semibold">
              {stats.newCustomersToday} khách mới
            </span>
          </div>
        </div>

        {/* AI TRẢ LỜI HÔM NAY */}
        <div className="astronixa-card p-6 relative overflow-hidden group">
          <p className="text-xs font-black text-[#c044ff] uppercase tracking-wider">
            AI TRẢ LỜI HÔM NAY
          </p>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-4xl font-black text-white font-display">
              {stats.aiRepliesToday}
            </span>
            <span className="text-xs text-[#cfc2d9] font-semibold">
              Không có ai chờ bạn
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Kênh đã kết nối & Sức khoẻ tổng thể */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kênh đã kết nối */}
        <div className="lg:col-span-2 astronixa-card p-7">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-white text-base uppercase tracking-wider font-display">Kênh đã kết nối</h3>
            <Link 
              href="/channels" 
              className="text-xs font-bold text-[#2bb9f9] hover:underline flex items-center gap-1"
            >
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex items-center justify-between p-5 bg-[#070b34]/90 border border-[#ad30fb]/40 rounded-2xl shadow-inner">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0b1640] text-[#2bb9f9] border border-[#2bb9f9]/40 flex items-center justify-center shadow-[0_0_15px_rgba(43,185,249,0.3)]">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-white text-base">Chat trên website</h4>
                <p className="text-xs text-[#cfc2d9] mt-0.5">
                  1 hội thoại · 1 tin trong 30 ngày · <span className="bg-[#1b0833] border border-[#ad30fb]/40 px-2.5 py-0.5 rounded-full text-[11px] text-[#fc3cff] font-bold">webchat</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-[#2bb9f9] bg-[#0c1a40] px-3.5 py-1.5 rounded-full border border-[#2bb9f9]/50 shadow-[0_0_12px_rgba(43,185,249,0.35)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2bb9f9] animate-pulse"></span>
              <span>Đang chạy</span>
            </div>
          </div>
        </div>

        {/* Sức khoẻ tổng thể */}
        <div className="astronixa-card p-7 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-white text-base uppercase tracking-wider mb-1 font-display">Sức khoẻ tổng thể</h3>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-black text-white font-display">
                1/8
              </span>
              <span className="text-xs text-[#cfc2d9] font-bold">
                kênh hoạt động tốt
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-5">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#0b1640] text-[#2bb9f9] border border-[#2bb9f9]/50">
              OK 1
            </span>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-rose-950/80 text-rose-300 border border-rose-500/50">
              Lỗi 0
            </span>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-[#1b0833] text-[#fc3cff] border border-[#ad30fb]/50">
              Chưa bật 7
            </span>
          </div>
        </div>
      </div>

      {/* Row 3: Tiêu thụ token Claude & Gemini */}
      <div className="astronixa-card p-7">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-[#2bb9f9]" />
            <h3 className="font-extrabold text-white text-base uppercase tracking-wider font-display">
              Tiêu thụ token Claude & Gemini
            </h3>
          </div>
          <Link 
            href="/settings" 
            className="text-xs font-bold text-[#c044ff] hover:underline flex items-center gap-1"
          >
            Quản lý API Key <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <p className="text-xs text-[#cfc2d9] mb-5">
          Ghi nhận trực tiếp từ các cuộc gọi API qua Google Gemini và Anthropic Claude.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#070b34]/80 border border-[#ad30fb]/30 rounded-2xl p-5 shadow-inner">
            <p className="text-xs font-black text-[#c044ff] uppercase tracking-widest font-display">
              THÁNG 10/2026
            </p>
            <div className="mt-2 text-3xl font-black text-white font-display">
              {tokens.monthToken}
            </div>
            <p className="text-xs text-[#cfc2d9] mt-1">
              token · {tokens.monthCalls} lượt gọi
            </p>
          </div>

          <div className="bg-[#070b34]/80 border border-[#3076fe]/30 rounded-2xl p-5 shadow-inner">
            <p className="text-xs font-black text-[#3076fe] uppercase tracking-widest font-display">
              HÔM NAY
            </p>
            <div className="mt-2 text-3xl font-black text-white font-display">
              {tokens.todayToken}
            </div>
            <p className="text-xs text-[#cfc2d9] mt-1">
              token · {tokens.todayCalls} lượt gọi
            </p>
          </div>

          <div className="bg-[#070b34]/80 border border-[#2bb9f9]/30 rounded-2xl p-5 shadow-inner">
            <p className="text-xs font-black text-[#2bb9f9] uppercase tracking-widest font-display">
              30 NGÀY
            </p>
            <div className="mt-2 text-3xl font-black text-white font-display">
              {tokens.thirtyDaysToken}
            </div>
            <p className="text-xs text-[#cfc2d9] mt-1">
              token · {tokens.thirtyDaysCalls} lượt gọi
            </p>
          </div>
        </div>
      </div>

      {/* Row 4: Nền tảng khả dụng */}
      <div className="astronixa-card p-7">
        <h3 className="font-extrabold text-white text-base uppercase tracking-wider mb-5 font-display">
          Nền tảng tích hợp khả dụng
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Zalo cá nhân */}
          <div className="bg-[#070b34]/80 border border-[#ad30fb]/30 rounded-2xl p-5 flex items-start gap-4 hover:border-[#2bb9f9] transition-all">
            <div className="w-11 h-11 rounded-2xl bg-[#0b1640] text-[#2bb9f9] flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-5.5 h-5.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-sm">Zalo cá nhân</h4>
                <span className="text-xs text-[#cfc2d9]/60 font-medium">• Chưa bật</span>
              </div>
              <p className="text-xs text-[#cfc2d9] mt-1.5 leading-relaxed">
                Tài khoản Zalo cá nhân — quét QR là kết nối, nhận & gửi tin như trên điện thoại.
              </p>
            </div>
          </div>

          {/* Zalo OA */}
          <div className="bg-[#070b34]/80 border border-[#ad30fb]/30 rounded-2xl p-5 flex items-start gap-4 hover:border-[#2bb9f9] transition-all">
            <div className="w-11 h-11 rounded-2xl bg-[#0b1640] text-[#2bb9f9] flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5.5 h-5.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-sm">Zalo OA</h4>
                <span className="text-xs text-[#cfc2d9]/60 font-medium">• Chưa bật</span>
              </div>
              <p className="text-xs text-[#cfc2d9] mt-1.5 leading-relaxed">
                Zalo Official Account — nhận & trả lời tin CSKH qua API chính thức.
              </p>
            </div>
          </div>

          {/* Facebook Messenger */}
          <div className="bg-[#1b0833]/90 border border-[#c044ff]/60 rounded-2xl p-5 flex items-start gap-4 shadow-[0_0_20px_rgba(192,68,255,0.25)]">
            <div className="w-11 h-11 rounded-2xl bg-[#3076fe]/30 text-[#2bb9f9] flex items-center justify-center flex-shrink-0 border border-[#3076fe]/50">
              <Facebook className="w-5.5 h-5.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-sm">Facebook Messenger</h4>
                <span className="text-xs text-[#fc3cff] font-extrabold bg-[#1a0833] border border-[#ad30fb]/60 px-2.5 py-0.5 rounded-full">• Đang chạy</span>
              </div>
              <p className="text-xs text-[#cfc2d9] mt-1.5 leading-relaxed">
                Facebook Messenger — tin nhắn 1-1 từ Fanpage doanh nghiệp.
              </p>
            </div>
          </div>

          {/* Instagram */}
          <div className="bg-[#070b34]/80 border border-[#ad30fb]/30 rounded-2xl p-5 flex items-start gap-4 hover:border-[#fc3cff] transition-all">
            <div className="w-11 h-11 rounded-2xl bg-[#1b0833] text-[#fc3cff] flex items-center justify-center flex-shrink-0">
              <Instagram className="w-5.5 h-5.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-sm">Instagram</h4>
                <span className="text-xs text-[#cfc2d9]/60 font-medium">• Chưa bật</span>
              </div>
              <p className="text-xs text-[#cfc2d9] mt-1.5 leading-relaxed">
                Instagram Direct — tin nhắn từ tài khoản Instagram doanh nghiệp.
              </p>
            </div>
          </div>

          {/* Telegram */}
          <div className="bg-[#070b34]/80 border border-[#ad30fb]/30 rounded-2xl p-5 flex items-start gap-4 hover:border-[#2bb9f9] transition-all">
            <div className="w-11 h-11 rounded-2xl bg-[#0b1640] text-[#2bb9f9] flex items-center justify-center flex-shrink-0">
              <Send className="w-5.5 h-5.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-sm">Telegram</h4>
                <span className="text-xs text-[#cfc2d9]/60 font-medium">• Chưa bật</span>
              </div>
              <p className="text-xs text-[#cfc2d9] mt-1.5 leading-relaxed">
                Telegram Bot — dễ nhất, chạy ngay trên máy không cần địa chỉ công khai.
              </p>
            </div>
          </div>

          {/* TikTok */}
          <div className="bg-[#070b34]/80 border border-[#ad30fb]/30 rounded-2xl p-5 flex items-start gap-4 hover:border-white/40 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-white/[0.08] text-white flex items-center justify-center flex-shrink-0">
              <Music className="w-5.5 h-5.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-sm">TikTok</h4>
                <span className="text-xs text-[#cfc2d9]/60 font-medium">• Chưa bật</span>
              </div>
              <p className="text-xs text-[#cfc2d9] mt-1.5 leading-relaxed">
                TikTok — đi qua Make/n8n vì TikTok chỉ mở API cho tài khoản được duyệt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
