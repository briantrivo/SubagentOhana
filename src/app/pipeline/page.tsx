'use client';

import React, { useState, useEffect } from 'react';
import { PipelineStage, Customer } from '@/types/crm';
import { User, Phone, Tag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const STAGES: PipelineStage[] = ['Mới', 'Tiếp cận', 'Tư vấn', 'Chốt đơn', 'Thành công', 'Thất bại'];

export default function PipelinePage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetch('/api/conversations')
      .then(r => r.json())
      .then(d => {
        // fetch customers from store
      });
    // mock from initial
    import('@/lib/initial-data').then(m => {
      setCustomers(m.INITIAL_CUSTOMERS);
    });
  }, []);

  return (
    <div className="flex-1 overflow-x-auto p-6 space-y-6 text-[#f0f1f6]">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full astronixa-badge text-xs font-bold mb-2 uppercase tracking-wider">
          <Tag className="w-3.5 h-3.5 text-[#2bb9f9]" />
          <span>PHỄU CHUYỂN ĐỔI • PIPELINE</span>
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight font-display">
          Pipeline Bán Hàng & <span className="astronixa-title-gradient">Chốt Đơn Tự Động</span>
        </h2>
        <p className="text-sm text-[#cfc2d9] mt-1">
          Các Subagent tự động di chuyển khách hàng qua từng giai đoạn khi khách hỏi giá hoặc đồng ý mua.
        </p>
      </div>

      <div className="flex gap-4 min-w-[1200px] pb-4">
        {STAGES.map((stage) => {
          const list = customers.filter(c => c.stage === stage);
          return (
            <div key={stage} className="flex-1 astronixa-card p-4 flex flex-col min-h-[550px] border border-[#ad30fb]/35">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <span className="font-extrabold text-xs text-white uppercase tracking-wider">{stage}</span>
                <span className="text-[11px] font-bold astronixa-badge px-2.5 py-0.5">
                  {list.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {list.map((cust) => (
                  <div key={cust.id} className="p-3.5 bg-[#070b34]/90 border border-[#ad30fb]/30 rounded-xl hover:border-[#2bb9f9] transition-all shadow-md group">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs md:text-sm text-white group-hover:text-[#2bb9f9] transition-colors">{cust.name}</span>
                      <span className="text-[10px] text-slate-400">{cust.createdAt}</span>
                    </div>
                    {cust.phone && (
                      <p className="text-[11px] text-cyan-300 mt-1 flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-[#2bb9f9]" /> {cust.phone}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {cust.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] astronixa-badge px-2 py-0.5 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                    <Link
                      href="/inbox"
                      className="mt-3 text-[11px] font-bold text-[#c044ff] group-hover:text-[#2bb9f9] flex items-center gap-1 transition-colors"
                    >
                      Mở hội thoại <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
