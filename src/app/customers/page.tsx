'use client';

import React, { useState, useEffect } from 'react';
import { Customer } from '@/types/crm';
import { INITIAL_CUSTOMERS } from '@/lib/initial-data';
import { Phone, Mail, Tag, MessageSquare, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);

  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-6xl mx-auto space-y-6 text-[#f0f1f6]">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full astronixa-badge text-xs font-bold mb-2 uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5 text-[#2bb9f9]" />
            <span>HỒ SƠ KHÁCH HÀNG • CRM MEMORY</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight font-display">
            Danh sách <span className="astronixa-title-gradient">Khách hàng & Bộ nhớ AI</span>
          </h2>
          <p className="text-sm text-[#cfc2d9] mt-1 leading-relaxed">
            Tổng hợp hồ sơ khách hàng, bộ nhớ AI và lịch sử tương tác từ các kênh hội thoại.
          </p>
        </div>
      </div>

      <div className="astronixa-card overflow-hidden border border-[#ad30fb]/35 shadow-2xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#070b34] border-b border-white/10 text-[#cfc2d9] font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-4 px-5">Khách hàng</th>
              <th className="py-4 px-4">Số điện thoại</th>
              <th className="py-4 px-4">Kênh</th>
              <th className="py-4 px-4">Giai đoạn</th>
              <th className="py-4 px-4">Thẻ (Tags)</th>
              <th className="py-4 px-4">AI Ghi nhớ</th>
              <th className="py-4 px-5 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-white/5 transition-colors">
                <td className="py-4 px-5 font-semibold text-white flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#c044ff] to-[#2bb9f9] text-white flex items-center justify-center font-bold text-xs shadow-md">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{c.name}</div>
                    <div className="text-[10px] text-slate-400 font-normal">Từ {c.createdAt}</div>
                  </div>
                </td>
                <td className="py-4 px-4 text-cyan-300 font-mono text-xs">{c.phone || '—'}</td>
                <td className="py-4 px-4">
                  <span className="astronixa-badge text-[#2bb9f9] px-2.5 py-0.5 rounded-full font-medium text-[11px]">
                    {c.channel}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                    {c.stage}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-wrap gap-1">
                    {c.tags.map((t, idx) => (
                      <span key={idx} className="bg-white/10 text-[#f0f1f6] border border-white/10 px-2 py-0.5 rounded-md text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-4 text-[#cfc2d9] max-w-xs truncate text-xs">
                  {c.aiMemories.length > 0 ? c.aiMemories.join(', ') : '—'}
                </td>
                <td className="py-4 px-5 text-right">
                  <Link
                    href="/inbox"
                    className="text-[#2bb9f9] hover:text-[#fc3cff] font-bold hover:underline inline-flex items-center gap-1 transition-colors text-xs"
                  >
                    Xem chat <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
