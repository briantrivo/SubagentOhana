'use client';

import React, { useState, useEffect } from 'react';
import { Key, Bot, Shield, Check, Save, Sparkles, ExternalLink, Cpu } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function SettingsPage() {
  const [claudeKey, setClaudeKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [defaultModel, setDefaultModel] = useState('claude-sonnet-5');
  const [isSaved, setIsSaved] = useState(false);
  const [hasClaudeKey, setHasClaudeKey] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setHasClaudeKey(data.data.hasClaudeKey);
          setHasGeminiKey(data.data.hasGeminiKey);
          setDefaultModel(data.data.defaultModel || 'claude-sonnet-5');
        }
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claudeApiKey: claudeKey,
          geminiApiKey: geminiKey,
          openaiApiKey: openaiKey,
          defaultModel
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsSaved(true);
        setHasClaudeKey(data.hasClaudeKey);
        setHasGeminiKey(data.hasGeminiKey);
        setTimeout(() => setIsSaved(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto space-y-6 text-[#f0f1f6]">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full astronixa-badge text-xs font-bold mb-2 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#2bb9f9]" />
            <span>CẤU HÌNH BỘ NÃO AI • ASTRONIXA ENGINE</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight font-display">
            Cài đặt Hệ thống & <span className="astronixa-title-gradient">Khóa API AI</span>
          </h2>
          <p className="text-sm text-[#cfc2d9] mt-1 leading-relaxed">
            Kết nối Anthropic Claude API, Google Gemini API và OpenAI để cấp quyền cho các Subagent tự động tư vấn và CSKH.
          </p>
        </div>
        <ThemeToggle variant="pill" />
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* API Keys Card */}
        <div className="astronixa-card p-6 space-y-5 border border-[#ad30fb]/35">
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
            <Key className="w-5 h-5 text-[#2bb9f9]" />
            <h3 className="font-extrabold text-white text-base">Khóa API Nhà Cung Cấp (API Keys)</h3>
          </div>

          {/* Claude Key */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#cfc2d9] flex items-center gap-2">
                <span>Claude API Key (Anthropic)</span>
                {hasClaudeKey && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/40">
                    Đã kết nối
                  </span>
                )}
              </label>
              <a
                href="https://console.anthropic.com/"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#c044ff] hover:text-[#2bb9f9] font-semibold hover:underline flex items-center gap-1"
              >
                Lấy key tại Anthropic Console <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              placeholder={hasClaudeKey ? '••••••••••••••••••••••••' : 'sk-ant-api03-...'}
              value={claudeKey}
              onChange={(e) => setClaudeKey(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-[#070b34]/90 border border-[#ad30fb]/30 text-white rounded-xl focus:outline-none focus:border-[#2bb9f9] font-mono"
            />
          </div>

          {/* Gemini Key */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#cfc2d9] flex items-center gap-2">
                <span>Google Gemini API Key</span>
                {hasGeminiKey && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/40">
                    Đã kết nối trực tiếp
                  </span>
                )}
              </label>
              <a
                href="https://aistudio.google.com/"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#2bb9f9] hover:text-[#fc3cff] font-semibold hover:underline flex items-center gap-1"
              >
                Lấy key tại Google AI Studio <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              placeholder={hasGeminiKey ? '••••••••••••••••••••••••' : 'AIzaSy...'}
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-[#070b34]/90 border border-[#ad30fb]/30 text-white rounded-xl focus:outline-none focus:border-[#2bb9f9] font-mono"
            />
          </div>

          {/* OpenAI Key */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#cfc2d9]">OpenAI API Key (Tùy chọn)</label>
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#cfc2d9] hover:text-white font-semibold hover:underline flex items-center gap-1"
              >
                Lấy key tại OpenAI <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              placeholder="sk-proj-..."
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-[#070b34]/90 border border-[#ad30fb]/30 text-white rounded-xl focus:outline-none focus:border-[#2bb9f9] font-mono"
            />
          </div>
        </div>

        {/* Default Model Selector */}
        <div className="astronixa-card p-6 space-y-4 border border-[#ad30fb]/35">
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
            <Cpu className="w-5 h-5 text-[#fc3cff]" />
            <h3 className="font-extrabold text-white text-base">Mô hình AI mặc định (Default Model)</h3>
          </div>

          <div>
            <label className="text-xs text-[#cfc2d9] block mb-2 font-medium">
              Mô hình dùng chung cho toàn bộ Subagent khi không cấu hình model riêng:
            </label>
            <select
              value={defaultModel}
              onChange={(e) => setDefaultModel(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs md:text-sm bg-[#070b34] border border-[#ad30fb]/40 rounded-xl focus:outline-none focus:border-[#2bb9f9] font-bold text-white cursor-pointer"
            >
              <option value="gemini-3.8-flash" className="bg-[#02062a] text-white">Google Gemini 3.8 Flash (Tối ưu tốc độ & Khuyên dùng)</option>
              <option value="claude-sonnet-5" className="bg-[#02062a] text-white">Claude 3.5 Sonnet / Claude Sonnet 5</option>
              <option value="claude-haiku-3.5" className="bg-[#02062a] text-white">Claude 3.5 Haiku (Siêu tốc độ)</option>
              <option value="gemini-2.5-pro" className="bg-[#02062a] text-white">Google Gemini 2.5 Pro (Suy luận sâu)</option>
              <option value="gpt-4o" className="bg-[#02062a] text-white">OpenAI GPT-4o</option>
              <option value="gpt-4o-mini" className="bg-[#02062a] text-white">OpenAI GPT-4o Mini</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3">
          {isSaved && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 mr-auto">
              <Check className="w-4 h-4" /> Đã lưu cài đặt thành công!
            </span>
          )}
          <button
            type="submit"
            className="astronixa-btn-primary px-7 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xl"
          >
            <Save className="w-4 h-4" />
            <span>Lưu tất cả thay đổi</span>
          </button>
        </div>
      </form>
    </div>
  );
}
