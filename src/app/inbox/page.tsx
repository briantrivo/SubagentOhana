'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Send, 
  Sparkles, 
  Bot, 
  FileText, 
  User, 
  ChevronDown, 
  AlertCircle, 
  Plus, 
  Clock, 
  X, 
  CheckCircle2, 
  Phone, 
  Mail, 
  RefreshCw, 
  Wrench, 
  Calendar, 
  Hand, 
  Briefcase, 
  Compass, 
  Zap 
} from 'lucide-react';
import { Conversation, Customer, Message, SubagentId } from '@/types/crm';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string>('conv-1');
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'needs_human' | 'ai_active'>('all');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [newTagInput, setNewTagInput] = useState<string>('');
  const [newMemoryInput, setNewMemoryInput] = useState<string>('');
  const [isAiSuggesting, setIsAiSuggesting] = useState<boolean>(false);
  const [isAiReplying, setIsAiReplying] = useState<boolean>(false);
  const [simulateCustomerOpen, setSimulateCustomerOpen] = useState<boolean>(false);
  const [simulateInput, setSimulateInput] = useState<string>('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const res = await fetch(`/api/conversations?channel=${selectedChannel}&filter=${activeTab}&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success) {
        setConversations(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch single conversation & customer
  const fetchCurrentConv = async (id: string) => {
    try {
      const res = await fetch(`/api/conversations/${id}`);
      const data = await res.json();
      if (data.success) {
        setCurrentCustomer(data.data.customer);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [selectedChannel, activeTab, searchQuery]);

  useEffect(() => {
    if (selectedConvId) {
      fetchCurrentConv(selectedConvId);
    }
  }, [selectedConvId]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [conversations, selectedConvId]);

  const activeConv = conversations.find(c => c.id === selectedConvId) || conversations[0];

  // Send human message
  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeConv) return;
    const textToSend = inputText;
    setInputText('');

    try {
      const res = await fetch(`/api/conversations/${activeConv.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSend, sender: 'human' })
      });
      const data = await res.json();
      if (data.success) {
        fetchConversations();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // AI Suggestion button
  const handleAiSuggest = async () => {
    if (!activeConv) return;
    setIsAiSuggesting(true);
    try {
      const res = await fetch(`/api/conversations/${activeConv.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isSuggest: true })
      });
      const data = await res.json();
      if (data.success && data.suggestion) {
        setInputText(data.suggestion);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiSuggesting(false);
    }
  };

  // Trigger AI Auto-reply on demand
  const handleTriggerAiReply = async () => {
    if (!activeConv) return;
    setIsAiReplying(true);
    try {
      const res = await fetch(`/api/conversations/${activeConv.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceAiReply: true })
      });
      const data = await res.json();
      if (data.success) {
        fetchConversations();
        fetchCurrentConv(activeConv.id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiReplying(false);
    }
  };

  // Simulate customer message incoming
  const handleSimulateCustomerMessage = async (text: string) => {
    if (!activeConv) return;
    try {
      const res = await fetch(`/api/conversations/${activeConv.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, sender: 'customer' })
      });
      const data = await res.json();
      if (data.success) {
        fetchConversations();
        fetchCurrentConv(activeConv.id);
        setSimulateInput('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle AI Auto Reply for conversation
  const handleToggleAiAutoReply = async () => {
    if (!activeConv) return;
    const newStatus = !activeConv.aiAutoReply;
    try {
      await fetch(`/api/conversations/${activeConv.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aiAutoReply: newStatus })
      });
      fetchConversations();
    } catch (e) {
      console.error(e);
    }
  };

  // Change Subagent manually
  const handleChangeSubagent = async (subagentId: SubagentId) => {
    if (!activeConv) return;
    const nameMap: Record<SubagentId, string> = {
      orchestrator: 'Điều phối',
      receptionist: 'Lễ tân',
      sales: 'Tư vấn bán hàng',
      support: 'CSKH & Hậu mãi',
      booking: 'Đặt lịch & Nhắc hẹn',
      followup: 'Chăm sóc lại'
    };
    try {
      await fetch(`/api/conversations/${activeConv.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeSubagentId: subagentId,
          activeSubagentName: nameMap[subagentId]
        })
      });
      fetchConversations();
    } catch (e) {
      console.error(e);
    }
  };

  // Update customer fields
  const handleUpdateCustomer = async (field: keyof Customer, value: any) => {
    if (!currentCustomer) return;
    const updated = { ...currentCustomer, [field]: value };
    setCurrentCustomer(updated);
    try {
      await fetch(`/api/customers/${currentCustomer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Add tag
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTagInput.trim() && currentCustomer) {
      const updatedTags = [...currentCustomer.tags, newTagInput.trim()];
      handleUpdateCustomer('tags', updatedTags);
      setNewTagInput('');
    }
  };

  // Add memory
  const handleAddMemory = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newMemoryInput.trim() && currentCustomer) {
      const updatedMemories = [...currentCustomer.aiMemories, newMemoryInput.trim()];
      handleUpdateCustomer('aiMemories', updatedMemories);
      setNewMemoryInput('');
    }
  };

  const getSubagentIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Wrench': return <Wrench className="w-4 h-4 inline mr-1 text-[#2bb9f9]" />;
      case 'Briefcase': return <Briefcase className="w-4 h-4 inline mr-1 text-[#fc3cff]" />;
      case 'Hand': return <Hand className="w-4 h-4 inline mr-1 text-[#3076fe]" />;
      case 'Calendar': return <Calendar className="w-4 h-4 inline mr-1 text-[#c044ff]" />;
      default: return <Bot className="w-4 h-4 inline mr-1 text-[#2bb9f9]" />;
    }
  };

  return (
    <div className="flex h-full w-full bg-transparent overflow-hidden">
      {/* -------------------- COLUMN 1: CONVERSATIONS LIST -------------------- */}
      <div className="w-[340px] crm-col-1 backdrop-blur-2xl border-r flex flex-col flex-shrink-0 h-full shadow-lg transition-colors duration-300">
        {/* Search Header */}
        <div className="p-4 border-b border-[var(--crm-border)]">
          <div className="relative">
            <Search className="w-4.5 h-4.5 crm-text-muted absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Tìm tên, SĐT, nội dung..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 crm-input text-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#c044ff]/50 transition-all font-medium"
            />
          </div>

          {/* Channel Filter Chips */}
          <div className="flex items-center gap-1.5 mt-3.5 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setSelectedChannel('all')}
              className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap font-bold transition-all ${
                selectedChannel === 'all'
                  ? 'bg-gradient-to-r from-[#c044ff] to-[#3076fe] text-white shadow-md'
                  : 'crm-input hover:opacity-80'
              }`}
            >
              Tất cả 7
            </button>
            <button
              onClick={() => setSelectedChannel('facebook')}
              className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap flex items-center gap-1.5 font-bold transition-all ${
                selectedChannel === 'facebook' 
                  ? 'bg-[#3076fe] text-white shadow-md' 
                  : 'crm-input hover:opacity-80'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#2bb9f9]"></span> Facebook 1
            </button>
            <button
              onClick={() => setSelectedChannel('zalo_personal')}
              className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap flex items-center gap-1.5 font-bold transition-all ${
                selectedChannel === 'zalo_personal' 
                  ? 'bg-[#2bb9f9] text-[#02062a] shadow-md' 
                  : 'crm-input hover:opacity-80'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#0068ff]"></span> Zalo cá nhân 1
            </button>
            <button
              onClick={() => setSelectedChannel('webchat')}
              className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap flex items-center gap-1.5 font-bold transition-all ${
                selectedChannel === 'webchat' 
                  ? 'bg-[#c044ff] text-white shadow-md' 
                  : 'crm-input hover:opacity-80'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#fc3cff]"></span> Chat web 1
            </button>
          </div>

          {/* Sub-tabs */}
          <div className="flex border-b border-[var(--crm-border)] mt-3 text-xs crm-text-secondary">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-2 px-3.5 font-bold border-b-2 transition-all ${
                activeTab === 'all' 
                  ? 'border-[#c044ff] text-[#c044ff]' 
                  : 'border-transparent crm-text-muted hover:crm-text-primary'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`py-2 px-3.5 font-bold border-b-2 transition-all ${
                activeTab === 'unread' 
                  ? 'border-[#2bb9f9] text-[#2bb9f9]' 
                  : 'border-transparent crm-text-muted hover:crm-text-primary'
              }`}
            >
              Chưa đọc
            </button>
            <button
              onClick={() => setActiveTab('needs_human')}
              className={`py-2 px-3.5 font-bold border-b-2 transition-all ${
                activeTab === 'needs_human' 
                  ? 'border-[#fc3cff] text-[#fc3cff]' 
                  : 'border-transparent crm-text-muted hover:crm-text-primary'
              }`}
            >
              Cần bạn
            </button>
            <button
              onClick={() => setActiveTab('ai_active')}
              className={`py-2 px-3.5 font-bold border-b-2 transition-all ${
                activeTab === 'ai_active' 
                  ? 'border-[#3076fe] text-[#3076fe]' 
                  : 'border-transparent crm-text-muted hover:crm-text-primary'
              }`}
            >
              AI trực
            </button>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => {
            const isSelected = conv.id === activeConv?.id;
            return (
              <div
                key={conv.id}
                onClick={() => setSelectedConvId(conv.id)}
                className={`flex items-start p-4 gap-3.5 cursor-pointer relative crm-conv-item ${
                  isSelected ? 'crm-conv-item-selected' : ''
                }`}
              >
                {/* Avatar with Cosmic gradient border */}
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#c044ff] via-[#3076fe] to-[#2bb9f9] p-[1.5px] flex-shrink-0 shadow-xs">
                  <div className="w-full h-full crm-input rounded-[14px] flex items-center justify-center font-extrabold text-sm crm-text-primary">
                    {conv.customerName.charAt(0)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-extrabold crm-text-primary truncate">
                      {conv.customerName}
                    </h4>
                    <span className="text-xs crm-text-muted whitespace-nowrap ml-1 font-semibold">
                      {conv.lastMessageTime}
                    </span>
                  </div>

                  <p className="text-xs crm-text-secondary truncate mt-1 leading-normal font-normal">
                    {conv.lastMessageSnippet}
                  </p>

                  <div className="flex items-center justify-between mt-2.5">
                    <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full crm-pill-toggle">
                      {conv.channel === 'facebook' ? 'Facebook' : conv.channel === 'zalo_personal' ? 'Zalo cá nhân' : 'Chat web'}
                    </span>
                    {conv.needsHuman && (
                      <span className="text-[11px] bg-rose-500/20 border border-rose-500/40 text-rose-500 dark:text-rose-300 font-extrabold px-2 py-0.5 rounded-md">
                        Cần can thiệp
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* -------------------- COLUMN 2: ACTIVE CHAT SCREEN -------------------- */}
      <div className="flex-1 flex flex-col h-full crm-col-2 relative min-w-0">
        {/* Chat Top Header */}
        <div className="h-16 px-4 sm:px-6 crm-header border-b flex items-center justify-between gap-3 flex-shrink-0 shadow-sm min-w-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#c044ff] to-[#2bb9f9] p-[1.5px] shadow-[0_0_12px_rgba(192,68,255,0.4)] flex-shrink-0">
              <div className="w-full h-full crm-col-1 rounded-[14px] flex items-center justify-center font-black text-sm crm-text-primary">
                {activeConv?.customerName.charAt(0) || 'Đ'}
              </div>
            </div>
            <div className="min-w-0 flex items-center gap-2">
              <span className="font-extrabold crm-text-primary text-base truncate whitespace-nowrap max-w-[120px] sm:max-w-[180px] lg:max-w-[240px]">
                {activeConv?.customerName}
              </span>
              {activeConv?.channel === 'facebook' && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-500 border border-blue-500/30 flex-shrink-0 whitespace-nowrap">
                  Facebook
                </span>
              )}
              {activeConv?.channel === 'zalo_personal' && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-500 border border-sky-500/30 flex-shrink-0 whitespace-nowrap">
                  Zalo cá nhân
                </span>
              )}
              {activeConv?.channel === 'zalo_oa' && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-500 border border-cyan-500/30 flex-shrink-0 whitespace-nowrap">
                  Zalo OA
                </span>
              )}
              {activeConv?.channel === 'telegram' && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-500 border border-indigo-500/30 flex-shrink-0 whitespace-nowrap">
                  Telegram
                </span>
              )}
              {activeConv?.channel === 'webchat' && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-500 border border-purple-500/30 flex-shrink-0 whitespace-nowrap">
                  Webchat
                </span>
              )}
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            {/* AI Auto Reply Switch */}
            <div className="flex items-center gap-2 text-xs font-semibold crm-pill-toggle px-2.5 sm:px-3 py-1.5 rounded-xl shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-[#2bb9f9] flex-shrink-0" />
              <span className="hidden md:inline whitespace-nowrap font-bold">AI tự trả lời</span>
              <button
                type="button"
                onClick={handleToggleAiAutoReply}
                title="Bật/Tắt AI tự động trả lời"
                className={`w-8 h-4 rounded-full transition-colors relative flex items-center p-0.5 shadow-sm flex-shrink-0 ${
                  activeConv?.aiAutoReply 
                    ? 'bg-gradient-to-r from-[#c044ff] to-[#2bb9f9]' 
                    : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full bg-white transition-transform ${
                    activeConv?.aiAutoReply ? 'translate-x-4 shadow-sm' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Subagent Selector */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 text-xs font-bold crm-subagent-btn px-2.5 sm:px-3 py-1.5 rounded-xl transition-all shadow-sm">
                <Wrench className="w-3.5 h-3.5 text-[#2bb9f9] flex-shrink-0" />
                <span className="truncate max-w-[90px] sm:max-w-[130px]">{activeConv?.activeSubagentName || 'CSKH & Hậu mãi'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#c044ff] flex-shrink-0" />
              </button>

              <div className="absolute right-0 top-full mt-1.5 w-56 crm-col-1 border border-[#ad30fb]/40 rounded-2xl shadow-2xl py-2 hidden group-hover:block z-50 backdrop-blur-2xl">
                <div className="px-4 py-1.5 text-[11px] font-black crm-text-muted uppercase tracking-wider">
                  Chuyển Subagent
                </div>
                <button
                  onClick={() => handleChangeSubagent('receptionist')}
                  className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-white/[0.08] flex items-center gap-2.5 crm-text-primary"
                >
                  <Hand className="w-4 h-4 text-[#2bb9f9]" /> Lễ tân
                </button>
                <button
                  onClick={() => handleChangeSubagent('sales')}
                  className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-white/[0.08] flex items-center gap-2.5 crm-text-primary"
                >
                  <Briefcase className="w-4 h-4 text-[#fc3cff]" /> Tư vấn bán hàng
                </button>
                <button
                  onClick={() => handleChangeSubagent('support')}
                  className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-white/[0.08] flex items-center gap-2.5 crm-text-primary"
                >
                  <Wrench className="w-4 h-4 text-[#c044ff]" /> CSKH & Hậu mãi
                </button>
                <button
                  onClick={() => handleChangeSubagent('booking')}
                  className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-white/[0.08] flex items-center gap-2.5 crm-text-primary"
                >
                  <Calendar className="w-4 h-4 text-[#3076fe]" /> Đặt lịch & Nhắc hẹn
                </button>
              </div>
            </div>

            {/* Test Simulation Button */}
            <button 
              onClick={() => setSimulateCustomerOpen(!simulateCustomerOpen)}
              title="Mô phỏng tin nhắn từ khách"
              className="px-2.5 sm:px-3 py-1.5 crm-simulate-btn hover:border-[#2bb9f9] rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm font-bold flex-shrink-0"
            >
              <Zap className="w-3.5 h-3.5 text-[#fc3cff] flex-shrink-0" />
              <span className="whitespace-nowrap">Mô phỏng<span className="hidden sm:inline"> Khách</span></span>
            </button>
          </div>
        </div>

        {/* Live Status Banner (Astronixa Universe) */}
        <div className="crm-banner border-b px-6 py-2.5 text-xs font-medium flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2bb9f9] shadow-[0_0_8px_#2bb9f9] animate-pulse flex-shrink-0"></span>
            <span>
              <strong className="text-[#2bb9f9] font-extrabold">Google Gemini API (gemini-3.8-flash)</strong> đã kết nối trực tiếp vào hệ thống ASTRONIXA • OHANA CRM.
            </span>
          </div>
          <button 
            onClick={() => handleSimulateCustomerMessage('Không trả lời là mình báo cáo page đó')}
            className="text-xs bg-[#0b1038] border border-[#c044ff] text-[#fc3cff] hover:bg-[#c044ff] hover:text-white px-3 py-1 rounded-xl font-bold shadow-[0_0_12px_rgba(192,68,255,0.4)] transition-all whitespace-nowrap ml-2 flex-shrink-0"
          >
            ⚡ Test khách giận & Handoff
          </button>
        </div>

        {/* Simulation Bar */}
        {simulateCustomerOpen && (
          <div className="crm-col-1 border-b border-[#ad30fb]/30 p-3.5 flex items-center gap-3 shadow-md">
            <span className="text-xs font-extrabold text-[#2bb9f9] whitespace-nowrap flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#fc3cff]" /> Giả lập khách chat:
            </span>
            <input
              type="text"
              placeholder="Nhập câu khách nói (VD: Gói này giá sao bạn? / Đã chuyển khoản 499k...)"
              value={simulateInput}
              onChange={(e) => setSimulateInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && simulateInput.trim()) {
                  handleSimulateCustomerMessage(simulateInput.trim());
                }
              }}
              className="flex-1 px-4 py-2 text-sm crm-input rounded-2xl focus:outline-none"
            />
            <button
              onClick={() => {
                if (simulateInput.trim()) handleSimulateCustomerMessage(simulateInput.trim());
              }}
              className="astronixa-btn-primary px-4 py-2 rounded-2xl text-xs font-bold"
            >
              Gửi tin khách
            </button>
          </div>
        )}

        {/* Messages Scroll Area */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="text-center">
            <span className="text-xs font-bold crm-text-muted uppercase tracking-widest crm-pill-toggle px-4 py-1.5 rounded-full shadow-xs">
              Thứ Năm, 15/10
            </span>
          </div>

          {activeConv?.messages.map((msg) => {
            if (msg.sender === 'system') {
              // Centered system/handoff alert
              return (
                <div key={msg.id} className="flex justify-center my-3.5">
                  <div className="bg-rose-500/10 border border-rose-500/40 text-rose-500 dark:text-rose-200 text-xs md:text-sm px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-sm max-w-xl text-center font-bold">
                    <span>{msg.text}</span>
                  </div>
                </div>
              );
            }

            if (msg.sender === 'customer') {
              return (
                <div key={msg.id} className="flex flex-col items-start max-w-[72%]">
                  <div className="crm-bubble-customer text-sm md:text-[15px] px-5 py-3.5 rounded-3xl rounded-tl-sm shadow-md leading-relaxed font-normal">
                    {msg.text}
                  </div>
                  <span className="text-xs crm-text-muted mt-1.5 ml-2 font-semibold">{msg.timestamp}</span>
                </div>
              );
            }

            // Subagent or Staff reply (Right side)
            return (
              <div key={msg.id} className="flex flex-col items-end max-w-[72%] ml-auto">
                {msg.subagentName && (
                  <div className="flex items-center text-xs font-bold text-[#2bb9f9] mb-1.5 mr-2">
                    {getSubagentIcon(msg.subagentIcon)}
                    <span>{msg.subagentName}</span>
                  </div>
                )}
                <div className="crm-bubble-ai text-sm md:text-[15px] px-5 py-3.5 rounded-3xl rounded-tr-sm leading-relaxed font-medium shadow-md">
                  {msg.text}
                </div>
                <span className="text-xs crm-text-muted mt-1.5 mr-2 font-semibold">{msg.timestamp}</span>
              </div>
            );
          })}
        </div>

        {/* Input Box Footer (Astronixa Cosmic Frame) */}
        <div className="p-4.5 crm-header border-t">
          <div className="crm-chat-box rounded-3xl p-3 focus-within:ring-2 focus-within:ring-[#c044ff]/50 transition-all shadow-md">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Nhập tin nhắn phản hồi khách... (Enter để gửi, Shift+Enter xuống dòng)"
              rows={2}
              className="w-full text-sm md:text-[15px] crm-text-primary placeholder:crm-text-muted bg-transparent resize-none focus:outline-none leading-relaxed"
            />

            {/* Quick Actions Row */}
            <div className="flex items-center justify-between pt-3 border-t border-[#ad30fb]/20 mt-1.5">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleAiSuggest}
                  disabled={isAiSuggesting}
                  className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-2xl crm-btn-ai-suggest font-bold transition-all shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isAiSuggesting ? 'Đang phân tích...' : 'AI gợi ý'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleTriggerAiReply}
                  disabled={isAiReplying}
                  className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-2xl crm-btn-ai-auto font-bold transition-all shadow-sm"
                >
                  <Bot className="w-4 h-4" />
                  <span>{isAiReplying ? 'AI đang soạn...' : 'Để AI trả lời'}</span>
                </button>

                <button
                  type="button"
                  className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/[0.08] crm-text-secondary font-semibold transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Ghi chú</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleSendMessage}
                className="astronixa-btn-primary px-6 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg"
              >
                <span>Gửi tin</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------- COLUMN 3: CUSTOMER PROFILE DRAWER -------------------- */}
      <div className="w-[325px] crm-col-3 border-l flex flex-col flex-shrink-0 h-full overflow-y-auto p-5 text-sm shadow-md">
        {/* Customer Header */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-[#ad30fb]/20">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#c044ff] via-[#3076fe] to-[#2bb9f9] p-[1.5px] shadow-[0_0_15px_rgba(192,68,255,0.4)] flex-shrink-0">
            <div className="w-full h-full crm-col-1 rounded-[14px] flex items-center justify-center font-black text-base crm-text-primary">
              {currentCustomer?.name.charAt(0) || 'Đ'}
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="font-extrabold crm-text-primary text-base leading-tight truncate">{currentCustomer?.name}</h3>
            <span className="crm-text-muted text-xs font-semibold mt-0.5 block">
              Khách từ {currentCustomer?.createdAt || '15/10/2026'}
            </span>
          </div>
        </div>

        {/* Hồ sơ */}
        <div className="mt-4.5 space-y-3.5">
          <h4 className="font-extrabold text-[#7c3aed] dark:text-[#adc6ff] text-xs uppercase tracking-wider">Hồ sơ khách hàng</h4>

          <div>
            <label className="crm-text-secondary text-xs block mb-1 font-semibold">Tên</label>
            <input
              type="text"
              value={currentCustomer?.name || ''}
              onChange={(e) => handleUpdateCustomer('name', e.target.value)}
              className="w-full px-3.5 py-2 crm-input rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#c044ff]/40"
            />
          </div>

          <div>
            <label className="crm-text-secondary text-xs block mb-1 font-semibold">Số điện thoại</label>
            <input
              type="text"
              value={currentCustomer?.phone || ''}
              onChange={(e) => handleUpdateCustomer('phone', e.target.value)}
              className="w-full px-3.5 py-2 crm-input rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#c044ff]/40 font-mono"
            />
          </div>

          <div>
            <label className="crm-text-secondary text-xs block mb-1 font-semibold">Email</label>
            <input
              type="text"
              value={currentCustomer?.email || ''}
              onChange={(e) => handleUpdateCustomer('email', e.target.value)}
              placeholder="Nhập email..."
              className="w-full px-3.5 py-2 crm-input rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#c044ff]/40"
            />
          </div>

          <div>
            <label className="crm-text-secondary text-xs block mb-1 font-semibold">Giai đoạn Pipeline</label>
            <select
              value={currentCustomer?.stage || 'Chốt đơn'}
              onChange={(e) => handleUpdateCustomer('stage', e.target.value)}
              className="w-full px-3.5 py-2 crm-input rounded-2xl text-xs font-bold text-[#ad30fb] focus:outline-none focus:ring-2 focus:ring-[#c044ff]/40"
            >
              <option value="Mới" className="crm-col-1 crm-text-primary">Mới</option>
              <option value="Tiếp cận" className="crm-col-1 crm-text-primary">Tiếp cận</option>
              <option value="Tư vấn" className="crm-col-1 crm-text-primary">Tư vấn</option>
              <option value="Chốt đơn" className="crm-col-1 text-[#fc3cff]">Chốt đơn</option>
              <option value="Thành công" className="crm-col-1 text-[#2bb9f9]">Thành công</option>
              <option value="Thất bại" className="crm-col-1 text-rose-500">Thất bại</option>
            </select>
          </div>

          <div>
            <label className="crm-text-secondary text-xs block mb-1 font-semibold">Thẻ phân loại</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {currentCustomer?.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-purple-100 dark:bg-[#1b0833] text-purple-700 dark:text-[#fc3cff] border border-purple-300 dark:border-[#ad30fb]/60 px-3 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-xs"
                >
                  {tag}
                  <button 
                    onClick={() => {
                      const newTags = currentCustomer.tags.filter((_, i) => i !== idx);
                      handleUpdateCustomer('tags', newTags);
                    }}
                    className="hover:text-rose-500 font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Thêm thẻ rồi Enter"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full px-3.5 py-2 crm-input rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-[#c044ff]/40"
            />
          </div>

          <div>
            <label className="crm-text-secondary text-xs block mb-1 font-semibold">Ghi chú</label>
            <textarea
              value={currentCustomer?.notes || ''}
              onChange={(e) => handleUpdateCustomer('notes', e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2 crm-input rounded-2xl text-xs resize-none focus:outline-none focus:ring-2 focus:ring-[#c044ff]/40 leading-normal"
            />
          </div>
        </div>

        {/* AI ghi nhớ về khách */}
        <div className="mt-5 pt-4 border-t border-[#ad30fb]/20">
          <h4 className="font-extrabold text-[#7c3aed] dark:text-[#adc6ff] text-xs mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#2bb9f9]" />
            <span>AI ghi nhớ về khách ({currentCustomer?.aiMemories.length || 0})</span>
          </h4>
          {(!currentCustomer?.aiMemories || currentCustomer.aiMemories.length === 0) ? (
            <p className="text-xs crm-text-muted italic mb-2.5">
              Chưa có. Subagent sẽ tự động ghi nhớ khi tương tác.
            </p>
          ) : (
            <ul className="space-y-2 mb-3">
              {currentCustomer.aiMemories.map((mem, i) => (
                <li key={i} className="text-xs crm-text-primary crm-col-1 p-2.5 rounded-2xl border border-[#3076fe]/30 flex items-start gap-2 shadow-sm">
                  <span className="text-[#2bb9f9] font-extrabold text-base leading-none">•</span>
                  <span>{mem}</span>
                </li>
              ))}
            </ul>
          )}
          <input
            type="text"
            placeholder="Thêm điều cần nhớ rồi Enter"
            value={newMemoryInput}
            onChange={(e) => setNewMemoryInput(e.target.value)}
            onKeyDown={handleAddMemory}
            className="w-full px-3.5 py-2 crm-input rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-[#c044ff]/40"
          />
        </div>

        {/* Nhắc việc */}
        <div className="mt-5 pt-4 border-t border-[#ad30fb]/20">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-extrabold text-[#7c3aed] dark:text-[#adc6ff] text-xs flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#2bb9f9]" />
              <span>Nhắc việc</span>
            </h4>
            <button className="text-xs text-[#c044ff] font-bold hover:underline flex items-center gap-0.5">
              + Hẹn nhắc
            </button>
          </div>
          <p className="text-xs crm-text-muted italic">Không có lịch nhắc đang chờ.</p>
        </div>

        {/* Kênh đã liên hệ */}
        <div className="mt-5 pt-4 border-t border-[#ad30fb]/20 pb-6">
          <h4 className="font-extrabold text-[#7c3aed] dark:text-[#adc6ff] text-xs mb-2">Kênh đã liên hệ</h4>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2bb9f9] shadow-[0_0_8px_#2bb9f9]"></span>
            <span className="text-xs font-bold crm-text-primary">Facebook Messenger</span>
          </div>
        </div>
      </div>
    </div>
  );
}
