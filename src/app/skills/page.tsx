'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Zap, 
  Plus, 
  Search, 
  Sparkles, 
  MessageSquare, 
  Workflow, 
  GitBranch, 
  Globe, 
  Edit3, 
  CheckSquare, 
  MessageCircle, 
  FileSpreadsheet, 
  Users, 
  CreditCard, 
  Clock, 
  ShieldAlert, 
  BookOpen, 
  BarChart2, 
  Brain, 
  Share2, 
  Send,
  X,
  CheckCircle2,
  Sliders,
  ChevronLeft,
  Copy,
  Check,
  Terminal,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { AgentSkill, SkillCategory } from '@/types/crm';
import { INITIAL_SKILLS } from '@/lib/initial-data';
import { getSkillGuide, SkillGuide } from '@/lib/skills-guide';

export default function SkillsPage() {
  const router = useRouter();
  const [skills, setSkills] = useState<AgentSkill[]>(INITIAL_SKILLS);
  const [activeTab, setActiveTab] = useState<'all' | 'Tự tạo' | 'Bán hàng' | 'Hệ thống'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected skill to display in 9BizClaw style detail drawer
  const [selectedSkill, setSelectedSkill] = useState<AgentSkill | null>(null);
  const [copiedAskIndex, setCopiedAskIndex] = useState<number | null>(null);

  // New Skill form state
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<SkillCategory>('Tự tạo');
  const [newPrompt, setNewPrompt] = useState('');

  // Fetch from API
  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills');
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setSkills(json.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle skill switch
  const handleToggle = async (id: string, isLocked?: boolean) => {
    if (isLocked) {
      showToast('Skill này được bảo vệ ở mức hệ thống để bảo vệ khách hàng.');
      return;
    }

    // Optimistic UI update
    setSkills(prev => prev.map(s => s.id === id ? { ...s, isEnabled: !s.isEnabled } : s));

    if (selectedSkill && selectedSkill.id === id) {
      setSelectedSkill(prev => prev ? { ...prev, isEnabled: !prev.isEnabled } : null);
    }

    try {
      const res = await fetch('/api/skills', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Đã ${data.data.isEnabled ? 'bật' : 'tắt'} skill "${data.data.name}"`);
      }
    } catch {
      showToast('Đã cập nhật trạng thái skill');
    }
  };

  // Create new skill
  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      alert('Vui lòng nhập tên skill!');
      return;
    }

    const payload = {
      name: newName.trim(),
      description: newDesc.trim() || 'Skill tuỳ biến do bạn tạo.',
      category: newCategory,
      instructionPrompt: newPrompt.trim()
    };

    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setSkills([data.data, ...skills]);
      } else {
        const localItem: AgentSkill = {
          id: 'skill-' + Date.now(),
          ...payload,
          scenariosCount: 0,
          referencesCount: 0,
          isEnabled: true,
          icon: 'Sliders'
        };
        setSkills([localItem, ...skills]);
      }
    } catch {
      const localItem: AgentSkill = {
        id: 'skill-' + Date.now(),
        ...payload,
        scenariosCount: 0,
        referencesCount: 0,
        isEnabled: true,
        icon: 'Sliders'
      };
      setSkills([localItem, ...skills]);
    }

    showToast(`Đã tạo thành công skill "${newName}"`);
    setNewName('');
    setNewDesc('');
    setNewPrompt('');
    setIsCreating(false);
  };

  // Copy sample prompt to clipboard & direct to Chat
  const handleCopyAsk = (askText: string, index: number) => {
    navigator.clipboard.writeText(askText);
    setCopiedAskIndex(index);
    showToast(`Đã sao chép câu mẫu: "${askText}"`);
    setTimeout(() => setCopiedAskIndex(null), 2500);
  };

  const handleAskInChat = (askText?: string) => {
    if (askText) {
      navigator.clipboard.writeText(askText);
    }
    router.push('/inbox');
  };

  // Get icon component dynamically
  const renderSkillIcon = (iconName?: string, className = "w-5 h-5 text-[#2bb9f9]") => {
    switch (iconName) {
      case 'MessageSquare': return <MessageSquare className={className} />;
      case 'Workflow': return <Workflow className={className} />;
      case 'GitBranch': return <GitBranch className={className} />;
      case 'Globe': return <Globe className={className} />;
      case 'Edit3': return <Edit3 className={className} />;
      case 'CheckSquare': return <CheckSquare className={className} />;
      case 'MessageCircle': return <MessageCircle className={className} />;
      case 'FileSpreadsheet': return <FileSpreadsheet className={className} />;
      case 'Users': return <Users className={className} />;
      case 'CreditCard': return <CreditCard className={className} />;
      case 'Clock': return <Clock className={className} />;
      case 'ShieldAlert': return <ShieldAlert className={className.replace('text-[#2bb9f9]', 'text-rose-400')} />;
      case 'BookOpen': return <BookOpen className={className} />;
      case 'BarChart2': return <BarChart2 className={className} />;
      case 'Brain': return <Brain className={className} />;
      case 'Share2': return <Share2 className={className} />;
      case 'Send': return <Send className={className} />;
      default: return <Sliders className={className} />;
    }
  };

  // Counts
  const countAll = skills.length;
  const countCustom = skills.filter(s => s.category === 'Tự tạo').length;
  const countSales = skills.filter(s => s.category === 'Bán hàng').length;
  const countSystem = skills.filter(s => s.category === 'Hệ thống').length;

  // Filtered skills
  const filteredSkills = skills.filter(skill => {
    const matchesTab = activeTab === 'all' || skill.category === activeTab;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      skill.name.toLowerCase().includes(q) || 
      skill.description.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const currentGuide: SkillGuide | null = selectedSkill ? getSkillGuide(selectedSkill) : null;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-5 right-8 z-50 bg-[#1c0836] border border-[#ad30fb] text-[#2bb9f9] px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-[#2bb9f9]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-6xl mx-auto w-full space-y-5">
        
        {/* Top Header: Title + Search + Create Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full astronixa-badge text-xs font-bold mb-2 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-[#2bb9f9]" />
              <span>KHO KỸ NĂNG TÁC TỬ • AGENT SKILLS</span>
            </div>
            <h1 className="text-3xl font-black crm-text-primary tracking-tight font-display">
              Skill
            </h1>
            <p className="text-xs md:text-sm crm-text-secondary mt-1">
              Mỗi skill là cách làm một việc, trợ lý tự chọn khi bạn nhờ trong Chat.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative w-64 md:w-72">
              <Search className="w-4 h-4 crm-text-muted absolute left-3.5 top-2.5" />
              <input
                type="text"
                placeholder="Tìm skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs crm-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#c044ff]/40 font-medium"
              />
            </div>

            {/* Red / Gradient Create Skill Button (Matching user screenshot) */}
            <button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-[#e11d48] to-[#be123c] hover:from-[#be123c] hover:to-[#9f1239] text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo skill</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs + Quick Suggestion */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-b border-[var(--crm-border)] pb-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-slate-800 text-white dark:bg-white/20 shadow-sm'
                  : 'crm-input crm-text-secondary hover:crm-text-primary'
              }`}
            >
              Tất cả {countAll}
            </button>
            <button
              onClick={() => setActiveTab('Tự tạo')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'Tự tạo'
                  ? 'bg-slate-800 text-white dark:bg-white/20 shadow-sm'
                  : 'crm-input crm-text-secondary hover:crm-text-primary'
              }`}
            >
              Tự tạo {countCustom}
            </button>
            <button
              onClick={() => setActiveTab('Bán hàng')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'Bán hàng'
                  ? 'bg-slate-800 text-white dark:bg-white/20 shadow-sm'
                  : 'crm-input crm-text-secondary hover:crm-text-primary'
              }`}
            >
              Bán hàng {countSales}
            </button>
            <button
              onClick={() => setActiveTab('Hệ thống')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'Hệ thống'
                  ? 'bg-slate-800 text-white dark:bg-white/20 shadow-sm'
                  : 'crm-input crm-text-secondary hover:crm-text-primary'
              }`}
            >
              Hệ thống {countSystem}
            </button>
          </div>

          <button 
            onClick={() => showToast('Trợ lý AI đang sẵn sàng đề xuất thêm kỹ năng phù hợp với ngành hàng của bạn.')}
            className="text-xs crm-text-secondary hover:text-[#2bb9f9] flex items-center gap-1 font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2bb9f9]" />
            <span>Đề xuất từ trợ lý</span>
          </button>
        </div>

        {/* Skills Table List (Matching 9BizClaw clickable rows) */}
        <div className="crm-card rounded-2xl border overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-12 px-6 py-3 border-b border-[var(--crm-border)] text-[11px] font-bold crm-text-muted uppercase tracking-wider">
            <div className="col-span-12 sm:col-span-6">Skill (Nhấn vào để xem chi tiết)</div>
            <div className="hidden sm:block sm:col-span-2 text-center">Phân loại</div>
            <div className="hidden sm:block sm:col-span-1 text-center">Kịch bản</div>
            <div className="hidden sm:block sm:col-span-1 text-center">Tham khảo</div>
            <div className="hidden sm:block sm:col-span-2 text-right">Bật</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-[var(--crm-border)]">
            {filteredSkills.length === 0 ? (
              <div className="p-10 text-center crm-text-muted text-xs">
                Không tìm thấy skill nào phù hợp với bộ lọc hiện tại.
              </div>
            ) : (
              filteredSkills.map((skill) => {
                const isSelected = selectedSkill?.id === skill.id;
                return (
                  <div 
                    key={skill.id}
                    onClick={() => setSelectedSkill(skill)}
                    className={`grid grid-cols-12 px-6 py-4 items-center cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-[#c044ff]/10 border-l-4 border-l-[#c044ff]' 
                        : 'hover:bg-black/5 dark:hover:bg-white/[0.04]'
                    }`}
                  >
                    {/* Skill Col: Icon + Name + Badge + Description */}
                    <div className="col-span-12 sm:col-span-6 flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-2xl crm-input border flex items-center justify-center flex-shrink-0 shadow-xs">
                        {renderSkillIcon(skill.icon)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold crm-text-primary text-sm hover:text-[#2bb9f9] transition-colors">
                            {skill.name}
                          </span>
                          {skill.tag && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 crm-text-secondary">
                              {skill.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-xs crm-text-muted mt-0.5 leading-relaxed">
                          {skill.description}
                        </p>
                      </div>
                    </div>

                    {/* Phân loại Col */}
                    <div className="hidden sm:flex sm:col-span-2 justify-center">
                      <span className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/5 crm-text-secondary border border-transparent dark:border-white/10">
                        {skill.category}
                      </span>
                    </div>

                    {/* Kịch bản Col */}
                    <div className="hidden sm:block sm:col-span-1 text-center font-mono text-xs crm-text-secondary">
                      {skill.scenariosCount}
                    </div>

                    {/* Tham khảo Col */}
                    <div className="hidden sm:block sm:col-span-1 text-center font-mono text-xs crm-text-secondary">
                      {skill.referencesCount}
                    </div>

                    {/* Bật / Tắt Toggle Col */}
                    <div className="col-span-12 sm:col-span-2 flex items-center justify-end mt-2 sm:mt-0">
                      {skill.isLocked ? (
                        <span className="text-xs crm-text-muted italic select-none">
                          {skill.lockedNote || 'Luôn bật để bảo vệ khách'}
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggle(skill.id, skill.isLocked);
                          }}
                          className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                            skill.isEnabled 
                              ? 'bg-emerald-500 shadow-sm' 
                              : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                          title={skill.isEnabled ? 'Nhấn để tắt skill' : 'Nhấn để bật skill'}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                              skill.isEnabled ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          9BIZCLAW SLIDE-OVER DETAIL PANEL (ASIDE DRAWER)
          ========================================================================= */}
      {selectedSkill && currentGuide && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setSelectedSkill(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
          />

          {/* Slide-out aside panel */}
          <aside className="relative z-10 w-full sm:w-[500px] md:w-[560px] h-full crm-col-1 border-l border-[var(--crm-border)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
            
            {/* Top Navigation Bar (Quay lại • Breadcrumb • Đóng) */}
            <div className="h-14 px-5 border-b border-[var(--crm-border)] flex items-center justify-between flex-shrink-0 bg-black/10 dark:bg-white/[0.02]">
              <button 
                onClick={() => setSelectedSkill(null)}
                className="flex items-center gap-1 text-xs font-bold crm-text-secondary hover:crm-text-primary transition-colors px-2 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Quay lại</span>
              </button>

              <div className="text-xs font-semibold crm-text-muted truncate max-w-[240px]">
                Skill › <span className="crm-text-primary font-bold">{selectedSkill.name}</span>
              </div>

              <button 
                onClick={() => setSelectedSkill(null)}
                className="p-1.5 rounded-lg crm-text-muted hover:crm-text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Đóng chi tiết"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Header Identity: Icon + Name + Pills */}
            <div className="p-6 border-b border-[var(--crm-border)] space-y-3 flex-shrink-0">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#c044ff] to-[#2bb9f9] p-[1.5px] shadow-[0_0_15px_rgba(192,68,255,0.4)] flex-shrink-0">
                  <div className="w-full h-full crm-col-1 rounded-[14px] flex items-center justify-center">
                    {renderSkillIcon(selectedSkill.icon, "w-6 h-6 text-[#2bb9f9]")}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-extrabold crm-text-primary tracking-tight">
                    {selectedSkill.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {/* Category pill */}
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 crm-text-secondary">
                      {selectedSkill.category}
                    </span>

                    {/* Status pill (9BizClaw style) */}
                    {selectedSkill.isLocked ? (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        {selectedSkill.lockedNote || 'Luôn bật để bảo vệ khách'}
                      </span>
                    ) : selectedSkill.isEnabled ? (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Đang bật
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-500/15 text-slate-400 border border-slate-500/30 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        Đang tắt
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Panel Body: Scrollable guide content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Blurb / Short Description */}
              {currentGuide.blurb && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#2bb9f9]/10 to-[#c044ff]/10 border border-[#2bb9f9]/20 text-xs md:text-sm crm-text-primary font-medium leading-relaxed">
                  {currentGuide.blurb}
                </div>
              )}

              {/* SECTION 1: Trợ lý làm được gì */}
              {currentGuide.can && currentGuide.can.length > 0 && (
                <div className="space-y-2.5">
                  <h3 className="text-xs font-black uppercase tracking-wider crm-text-primary flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2bb9f9]" />
                    <span>Trợ lý làm được gì</span>
                  </h3>
                  <ul className="space-y-2">
                    {currentGuide.can.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs crm-text-secondary leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2bb9f9] mt-1.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* SECTION 2: Cách nhờ trợ lý trong Chat (Clickable quote cards) */}
              {currentGuide.ask && currentGuide.ask.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider crm-text-primary flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#fc3cff]" />
                      <span>Cách nhờ trợ lý trong Chat</span>
                    </h3>
                    <span className="text-[10px] crm-text-muted">Nhấn để sao chép</span>
                  </div>
                  <div className="space-y-2">
                    {currentGuide.ask.map((askText, idx) => {
                      const isCopied = copiedAskIndex === idx;
                      return (
                        <div 
                          key={idx}
                          onClick={() => handleCopyAsk(askText, idx)}
                          className="group relative p-3 rounded-2xl crm-input border border-[var(--crm-border)] hover:border-[#c044ff] transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs"
                          title="Nhấn để sao chép câu này và đưa vào Chat"
                        >
                          <span className="text-xs crm-text-primary font-semibold italic leading-relaxed">
                            “{askText}”
                          </span>
                          <button
                            type="button"
                            className="p-1.5 rounded-xl bg-black/5 dark:bg-white/5 group-hover:bg-[#c044ff] group-hover:text-white crm-text-secondary transition-all flex-shrink-0"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECTION 3: Trợ lý sẽ hỏi lại hoặc không làm */}
              {currentGuide.limits && currentGuide.limits.length > 0 && (
                <div className="space-y-2.5">
                  <h3 className="text-xs font-black uppercase tracking-wider crm-text-primary flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Trợ lý sẽ hỏi lại hoặc không làm</span>
                  </h3>
                  <ul className="space-y-2">
                    {currentGuide.limits.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs crm-text-secondary leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 mt-1.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* SECTION 4: Dành cho người dùng nâng cao */}
              {currentGuide.command && (
                <details className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/[0.03] border border-[var(--crm-border)] text-xs group">
                  <summary className="font-bold crm-text-secondary cursor-pointer flex items-center gap-1.5 select-none hover:crm-text-primary">
                    <Terminal className="w-3.5 h-3.5 text-[#2bb9f9]" />
                    <span>Dành cho người dùng nâng cao</span>
                  </summary>
                  <p className="mt-2.5 crm-text-muted leading-relaxed">
                    Gõ <code className="px-2 py-0.5 rounded-md bg-black/20 dark:bg-black/50 text-[#2bb9f9] font-mono font-bold">/{currentGuide.command}</code> trong Chat để gọi thẳng skill này.
                  </p>
                </details>
              )}
            </div>

            {/* Footer Actions: Switch + "Nhờ trợ lý trong Chat" */}
            <footer className="p-4 px-6 border-t border-[var(--crm-border)] flex items-center justify-between gap-3 bg-black/10 dark:bg-white/[0.02] flex-shrink-0">
              <div className="flex items-center gap-2.5">
                {!selectedSkill.isLocked && (
                  <button
                    onClick={() => handleToggle(selectedSkill.id, selectedSkill.isLocked)}
                    className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                      selectedSkill.isEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                    title={selectedSkill.isEnabled ? 'Tắt skill' : 'Bật skill'}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                        selectedSkill.isEnabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                )}
                <span className="text-xs font-semibold crm-text-secondary">
                  {selectedSkill.isLocked ? selectedSkill.lockedNote : selectedSkill.isEnabled ? 'Đang bật' : 'Đang tắt'}
                </span>
              </div>

              <button
                onClick={() => handleAskInChat(currentGuide.ask?.[0])}
                className="astronixa-btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Nhờ trợ lý trong Chat</span>
              </button>
            </footer>
          </aside>
        </div>
      )}

      {/* Modal: Tạo Skill Mới */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form 
            onSubmit={handleCreateSkill}
            className="astronixa-card w-full max-w-xl p-6 rounded-3xl border border-[#ad30fb]/60 shadow-2xl animate-in zoom-in-95 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--crm-border)]">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#2bb9f9]" />
                <h3 className="text-lg font-black crm-text-primary">Tạo Skill mới cho Trợ lý</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsCreating(false)}
                className="crm-text-muted hover:crm-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold crm-text-secondary block mb-1">
                Tên Skill
              </label>
              <input
                type="text"
                placeholder="VD: Kiểm tra tồn kho nhanh, Bắn voucher tri ân..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs crm-input rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c044ff]/40"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold crm-text-secondary block mb-1">
                  Phân loại
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as SkillCategory)}
                  className="w-full px-3.5 py-2.5 text-xs crm-input font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c044ff]/40"
                >
                  <option value="Tự tạo">Tự tạo</option>
                  <option value="Bán hàng">Bán hàng</option>
                  <option value="Hệ thống">Hệ thống</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold crm-text-secondary block mb-1">
                  Mô tả ngắn gọn
                </label>
                <input
                  type="text"
                  placeholder="Cách trợ lý thực hiện công việc..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs crm-input rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c044ff]/40"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold crm-text-secondary block mb-1">
                Chỉ dẫn thực thi (Prompt / Quy trình chi tiết cho AI)
              </label>
              <textarea
                rows={4}
                placeholder="Mô tả cụ thể các bước AI cần làm khi kích hoạt skill này..."
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                className="w-full p-3.5 text-xs crm-input rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c044ff]/40 font-mono leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-[var(--crm-border)]">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-xs crm-text-secondary hover:crm-text-primary rounded-xl font-bold crm-input"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="astronixa-btn-primary px-5 py-2 text-xs font-bold rounded-xl shadow-lg"
              >
                Lưu Skill
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
