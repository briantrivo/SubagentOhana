'use client';

import React, { useState } from 'react';
import { Clock, Plus, CheckCircle2, User, Calendar } from 'lucide-react';

export default function RemindersPage() {
  const [reminders, setReminders] = useState([
    {
      id: 'r1',
      title: 'Kiểm tra sao kê giao dịch 499k của anh Trần Minh Đức',
      dueAt: 'Hôm nay, 16:00',
      customerName: 'Trần Minh Đức',
      isDone: false
    },
    {
      id: 'r2',
      title: 'Gửi bảng giá gói Pro 1 năm cho chị Nguyễn Thị Lan',
      dueAt: 'Ngày mai, 09:30',
      customerName: 'Nguyễn Thị Lan',
      isDone: true
    }
  ]);

  const toggleDone = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, isDone: !r.isDone } : r));
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto space-y-6 text-[#f0f1f6]">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full astronixa-badge text-xs font-bold mb-2 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-[#2bb9f9]" />
            <span>NHẮC VIỆC TỰ ĐỘNG • SUBAGENT TASKS</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight font-display">
            Lịch Nhắc Việc & <span className="astronixa-title-gradient">Tiến Độ CSKH</span>
          </h2>
          <p className="text-sm text-[#cfc2d9] mt-1 leading-relaxed">
            Các Subagent (như Đặt lịch & CSKH) tự động tạo lời nhắc và theo dõi tiến độ công việc với khách hàng.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {reminders.map((r) => (
          <div
            key={r.id}
            className={`astronixa-card p-5 border flex items-center justify-between transition-all ${
              r.isDone
                ? 'border-emerald-500/30 bg-emerald-500/5 opacity-70'
                : 'border-[#ad30fb]/35 hover:border-[#2bb9f9]'
            }`}
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleDone(r.id)}
                className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                  r.isDone
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 border-emerald-400 text-white shadow-md'
                    : 'border-[#ad30fb]/50 bg-white/5 hover:border-[#2bb9f9]'
                }`}
              >
                {r.isDone && <CheckCircle2 className="w-4 h-4" />}
              </button>
              <div>
                <h4 className={`text-sm font-bold ${r.isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                  {r.title}
                </h4>
                <div className="flex items-center gap-4 text-xs mt-1.5">
                  <span className="flex items-center gap-1.5 text-cyan-300 font-medium">
                    <User className="w-3.5 h-3.5 text-[#2bb9f9]" /> {r.customerName}
                  </span>
                  <span className="flex items-center gap-1.5 text-[#fc3cff] font-medium font-mono">
                    <Clock className="w-3.5 h-3.5 text-[#fc3cff]" /> {r.dueAt}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
