'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Compass, 
  Hand, 
  Briefcase, 
  Wrench, 
  Calendar, 
  RefreshCw, 
  Save, 
  Trash2, 
  Check, 
  Sparkles,
  Bot
} from 'lucide-react';
import { Subagent, SubagentId } from '@/types/crm';
import ThemeToggle from '@/components/ThemeToggle';

export default function SubagentsPage() {
  const [subagents, setSubagents] = useState<Subagent[]>([]);
  const [globalAiActive, setGlobalAiActive] = useState<boolean>(true);
  const [savedId, setSavedId] = useState<string | null>(null);

  const fetchSubagents = async () => {
    try {
      const res = await fetch('/api/subagents');
      const data = await res.json();
      if (data.success) {
        setSubagents(data.data);
        setGlobalAiActive(data.globalAiActive);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSubagents();
  }, []);

  const handleToggleGlobalAi = async () => {
    const newStatus = !globalAiActive;
    setGlobalAiActive(newStatus);
    try {
      await fetch('/api/subagents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ globalAiActive: newStatus })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleAgent = async (id: SubagentId) => {
    const agent = subagents.find(a => a.id === id);
    if (!agent) return;
    const newActive = !agent.isActive;
    
    setSubagents(prev => prev.map(a => a.id === id ? { ...a, isActive: newActive } : a));
    try {
      await fetch('/api/subagents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates: { isActive: newActive } })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleFieldChange = (id: SubagentId, field: keyof Subagent, value: any) => {
    setSubagents(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const handleSaveAgent = async (agent: Subagent) => {
    try {
      await fetch('/api/subagents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: agent.id,
          updates: {
            whenToUse: agent.whenToUse,
            systemPrompt: agent.systemPrompt,
            customModel: agent.customModel,
            enabledTools: agent.enabledTools,
            isActive: agent.isActive
          }
        })
      });
      setSavedId(agent.id);
      setTimeout(() => setSavedId(null), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass': return <Compass className="w-5 h-5 text-purple-600" />;
      case 'Hand': return <Hand className="w-5 h-5 text-cyan-600" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-indigo-600" />;
      case 'Wrench': return <Wrench className="w-5 h-5 text-purple-600" />;
      case 'Calendar': return <Calendar className="w-5 h-5 text-pink-600" />;
      case 'RefreshCw': return <RefreshCw className="w-5 h-5 text-blue-600" />;
      default: return <Bot className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 text-[#f0f1f6]">
      {/* Top Bar with Astronixa Styling */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full astronixa-badge text-xs font-bold mb-2 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#2bb9f9]" />
            <span>ĐỘI NGŨ SUBAGENTS • MULTI-AGENT SWARM</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight font-display">
            Quản Lý <span className="astronixa-title-gradient">Subagent & Tác Tử Tự Động</span>
          </h2>
          <p className="text-sm text-[#cfc2d9] mt-1 max-w-2xl leading-relaxed">
            Thiết lập vai trò, công cụ và lời nhắc (System Prompt) cho từng Subagent trong hệ thống AGENT OHANA x Astronixa.
          </p>
        </div>

        <div className="flex items-center gap-3.5">
          <ThemeToggle variant="pill" />

          {/* Global CRM AI Switch */}
          <div className="astronixa-card px-4 py-2 border border-[#ad30fb]/40 flex items-center gap-3 shadow-lg">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2bb9f9]" />
              AI tự trả lời toàn bộ CRM
            </span>
            <button
              onClick={handleToggleGlobalAi}
              className={`w-11 h-6 rounded-full transition-all relative flex items-center p-0.5 shadow-sm ${
                globalAiActive 
                  ? 'bg-gradient-to-r from-[#c044ff] to-[#2bb9f9]' 
                  : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  globalAiActive ? 'translate-x-5 shadow-sm' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <button className="astronixa-btn-primary px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-xl transition-all">
            <Plus className="w-4 h-4" />
            <span>Thêm subagent</span>
          </button>
        </div>
      </div>

      {/* Subagents Grid (3 columns on wide screens) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subagents.map((agent) => {
          const isSaved = savedId === agent.id;
          const isOrchestrator = agent.id === 'orchestrator';

          return (
            <div
              key={agent.id}
              className="astronixa-card p-6 flex flex-col justify-between transition-all relative overflow-hidden group hover:scale-[1.01]"
            >
              {/* Subtle top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2bb9f9] via-[#c044ff] to-[#fc3cff]" />

              <div>
                {/* Header: Icon, Name, Role, Toggle */}
                <div className="flex items-center justify-between mb-4 mt-1">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-white/10 border border-[#ad30fb]/30 flex items-center justify-center shadow-lg">
                      {renderIcon(agent.icon)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-base leading-tight">
                        {agent.name}
                      </h3>
                      <p className="text-xs text-[#2bb9f9] font-bold mt-0.5">{agent.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#cfc2d9] font-bold">Bật</span>
                    <button
                      onClick={() => handleToggleAgent(agent.id)}
                      className={`w-10 h-5.5 rounded-full transition-all relative flex items-center p-0.5 shadow-sm ${
                        agent.isActive 
                          ? 'bg-gradient-to-r from-[#c044ff] to-[#2bb9f9]' 
                          : 'bg-white/20'
                      }`}
                    >
                      <div
                        className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                          agent.isActive ? 'translate-x-4.5 shadow-sm' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Section: Khi nào dùng */}
                {!isOrchestrator && (
                  <div className="mb-4">
                    <label className="text-xs font-bold text-[#cfc2d9] block mb-1">
                      Khi nào dùng (để Điều phối chọn)
                    </label>
                    <textarea
                      value={agent.whenToUse}
                      onChange={(e) => handleFieldChange(agent.id, 'whenToUse', e.target.value)}
                      rows={2}
                      className="w-full text-xs md:text-sm text-white p-3 bg-[#070b34]/90 border border-[#ad30fb]/30 rounded-xl focus:outline-none focus:border-[#2bb9f9] resize-none font-medium leading-relaxed"
                    />
                  </div>
                )}

                {/* Section: Chỉ dẫn (System prompt) */}
                <div className="mb-4">
                  <label className="text-xs font-bold text-[#cfc2d9] block mb-1">
                    Chỉ dẫn (system prompt)
                  </label>
                  <textarea
                    value={agent.systemPrompt}
                    onChange={(e) => handleFieldChange(agent.id, 'systemPrompt', e.target.value)}
                    rows={isOrchestrator ? 7 : 5}
                    className="w-full text-xs md:text-sm text-cyan-200 p-3 bg-[#070b34]/90 border border-[#ad30fb]/30 rounded-xl focus:outline-none focus:border-[#2bb9f9] resize-none font-mono leading-relaxed"
                  />
                </div>

                {/* Section: Công cụ được dùng */}
                {!isOrchestrator && agent.enabledTools && (
                  <div className="mb-4">
                    <label className="text-xs font-bold text-[#cfc2d9] block mb-1.5">
                      Công cụ được dùng (Tools)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {agent.enabledTools.map((tool, i) => (
                        <span
                          key={i}
                          className="astronixa-badge text-xs px-3 py-1 font-semibold"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Model riêng */}
                <div className="mb-4">
                  <label className="text-xs font-bold text-[#cfc2d9] block mb-1">
                    Model riêng (để trống = dùng mặc định trong Cài đặt)
                  </label>
                  <input
                    type="text"
                    value={agent.customModel || ''}
                    onChange={(e) => handleFieldChange(agent.id, 'customModel', e.target.value)}
                    placeholder="vd: gemini-3.8-flash hoặc claude-sonnet-5"
                    className="w-full px-3.5 py-2 text-xs md:text-sm text-white bg-[#070b34]/90 border border-[#ad30fb]/30 rounded-xl focus:outline-none focus:border-[#2bb9f9] placeholder-slate-500 font-mono"
                  />
                </div>
              </div>

              {/* Action Buttons: Lưu / Xoá */}
              <div className="flex items-center gap-2.5 pt-3.5 border-t border-white/10">
                <button
                  onClick={() => handleSaveAgent(agent)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                    isSaved
                      ? 'bg-emerald-600 text-white'
                      : 'astronixa-btn-primary'
                  }`}
                >
                  {isSaved ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Đã lưu!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Lưu thay đổi</span>
                    </>
                  )}
                </button>

                {!isOrchestrator && (
                  <button className="px-4 py-2.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl font-bold transition-colors">
                    Xoá
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
