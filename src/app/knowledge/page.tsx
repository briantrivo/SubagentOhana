'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  FileText, 
  Sparkles, 
  User, 
  Building2, 
  Package, 
  GitBranch, 
  ShieldCheck, 
  Upload, 
  Trash2, 
  Eye, 
  X, 
  CheckCircle2, 
  FileUp, 
  Info, 
  Clock,
  Layers,
  Check
} from 'lucide-react';
import { KnowledgeItem, KnowledgeCategory } from '@/types/crm';
import { INITIAL_KNOWLEDGE } from '@/lib/initial-data';

interface TabDef {
  id: 'all' | KnowledgeCategory;
  name: string;
  icon: React.ElementType;
  badgeColor: string;
  guide: string;
}

const KNOWLEDGE_TABS: TabDef[] = [
  {
    id: 'all',
    name: 'Tất cả tài liệu',
    icon: Layers,
    badgeColor: 'text-[#2bb9f9] border-[#2bb9f9]/40 bg-[#2bb9f9]/10',
    guide: 'Toàn bộ kho tri thức phục vụ cho tất cả Subagent AI tra cứu đa kênh.'
  },
  {
    id: 'Cá Nhân',
    name: 'Cá Nhân',
    icon: User,
    badgeColor: 'text-[#2bb9f9] border-[#2bb9f9]/40 bg-[#2bb9f9]/10',
    guide: 'Nên để: thông tin cá nhân của bạn như sở thích, lịch riêng, ghi chú riêng.'
  },
  {
    id: 'Công Ty',
    name: 'Công Ty',
    icon: Building2,
    badgeColor: 'text-[#3076fe] border-[#3076fe]/40 bg-[#3076fe]/10',
    guide: 'Nên để: giới thiệu công ty, chính sách đổi trả, thông tin liên hệ.'
  },
  {
    id: 'Sản Phẩm',
    name: 'Sản Phẩm',
    icon: Package,
    badgeColor: 'text-[#c044ff] border-[#c044ff]/40 bg-[#c044ff]/10',
    guide: 'Nên để: sản phẩm, dịch vụ, bảng giá.'
  },
  {
    id: 'Workflow',
    name: 'Workflow',
    icon: GitBranch,
    badgeColor: 'text-[#f59e0b] border-[#f59e0b]/40 bg-[#f59e0b]/10',
    guide: 'Nên để: quy trình bán hàng, giao hàng, chăm sóc sau bán.'
  },
  {
    id: 'Quy Ước',
    name: 'Quy Ước',
    icon: ShieldCheck,
    badgeColor: 'text-[#fc3cff] border-[#fc3cff]/40 bg-[#fc3cff]/10',
    guide: 'Nên để: quy ước, quy tắc trả lời khách, câu mẫu, điều trợ lý không được nói.'
  }
];

export default function KnowledgePage() {
  const [items, setItems] = useState<KnowledgeItem[]>(INITIAL_KNOWLEDGE);
  const [activeTab, setActiveTab] = useState<'all' | KnowledgeCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [viewingItem, setViewingItem] = useState<KnowledgeItem | null>(null);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<KnowledgeCategory>('Cá Nhân');
  const [attachedFileName, setAttachedFileName] = useState('');
  const [attachedFileSize, setAttachedFileSize] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const STORAGE_KEY = 'subagent_crm_knowledge_v1';

  // Persist items to state and localStorage
  const updateItemsAndPersist = (newItems: KnowledgeItem[]) => {
    setItems(newItems);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  };

  // Fetch knowledge from API & merge with localStorage
  const fetchKnowledge = async () => {
    // 1. Read from local storage first for instant load
    let localItems: KnowledgeItem[] = [];
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            localItems = parsed;
            setItems(parsed);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    // 2. Fetch from server API
    try {
      const res = await fetch('/api/knowledge');
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        // Merge: keep local user additions while having server items
        const serverMap = new Map(json.data.map((item: KnowledgeItem) => [item.id, item]));
        const merged = [...json.data];
        for (const loc of localItems) {
          if (!serverMap.has(loc.id)) {
            merged.unshift(loc);
          }
        }
        updateItemsAndPersist(merged);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Manual Addition
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert('Vui lòng nhập đầy đủ tiêu đề và nội dung tài liệu!');
      return;
    }

    const targetCategory = newCategory;

    const payload = {
      title: newTitle.trim(),
      content: newContent.trim(),
      category: targetCategory,
      fileName: attachedFileName || undefined,
      fileSize: attachedFileSize || undefined
    };

    let savedItem: KnowledgeItem | null = null;

    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.data) {
        savedItem = data.data;
      }
    } catch (err) {
      console.warn('API save error, using local fallback', err);
    }

    if (!savedItem) {
      savedItem = {
        id: 'k-' + Date.now(),
        ...payload,
        updatedAt: new Date().toLocaleDateString('vi-VN')
      };
    }

    const updated = [savedItem, ...items.filter(i => i.id !== savedItem!.id)];
    updateItemsAndPersist(updated);

    // Switch view to the category of the newly saved item so user immediately sees it
    setActiveTab(targetCategory);
    showToast(`Đã lưu tài liệu vào danh mục "${targetCategory}" và mở tab xem ngay!`);

    setNewTitle('');
    setNewContent('');
    setAttachedFileName('');
    setAttachedFileSize('');
    setIsAdding(false);
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Auto set category to current active tab if viewing a specific category
    if (activeTab !== 'all') {
      setNewCategory(activeTab);
    }

    const fileName = file.name;
    const fileSize = (file.size / 1024).toFixed(1) + ' KB';
    const cleanTitle = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

    // Read text files if possible
    if (file.type.includes('text') || fileName.endsWith('.txt') || fileName.endsWith('.md') || fileName.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setNewTitle(cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1));
        setNewContent(text || 'Nội dung trích xuất từ tệp ' + fileName);
        setAttachedFileName(fileName);
        setAttachedFileSize(fileSize);
        setIsAdding(true);
        setIsUploading(false);
      };
      reader.readAsText(file);
    } else {
      // PDF, DOCX, XLSX
      setNewTitle(cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1));
      setNewContent(`[Tài liệu đính kèm: ${fileName}]\nNội dung tài liệu đã được tải lên phục vụ hệ thống RAG Knowledge tra cứu tự động cho Subagent.`);
      setAttachedFileName(fileName);
      setAttachedFileSize(fileSize);
      setIsAdding(true);
      setIsUploading(false);
    }

    // Reset input value so re-selecting the same file will trigger onChange
    e.target.value = '';

    showToast(`Đã tải tệp ${fileName}. Đang lưu vào mục "${activeTab !== 'all' ? activeTab : newCategory}".`);
  };

  // Handle Delete
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Bạn có chắc chắn muốn xóa tài liệu này khỏi kho tri thức?')) return;

    try {
      await fetch(`/api/knowledge?id=${id}`, { method: 'DELETE' });
    } catch {}

    const updated = items.filter(item => item.id !== id);
    updateItemsAndPersist(updated);
    if (viewingItem?.id === id) setViewingItem(null);
    showToast('Đã xóa tài liệu thành công');
  };

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      item.title.toLowerCase().includes(q) || 
      item.content.toLowerCase().includes(q) ||
      (item.fileName && item.fileName.toLowerCase().includes(q));
    return matchesTab && matchesQuery;
  });

  const currentTabDef = KNOWLEDGE_TABS.find(t => t.id === activeTab) || KNOWLEDGE_TABS[0];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-5 right-8 z-50 bg-[#1c0836] border border-[#ad30fb] text-[#2bb9f9] px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-[#2bb9f9]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full astronixa-badge text-xs font-bold mb-2 uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-[#2bb9f9]" />
              <span>KHO TRI THỨC AI • RAG KNOWLEDGE</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black crm-text-primary tracking-tight font-display">
              Kho Kiến thức & <span className="astronixa-title-gradient">Tài liệu Doanh nghiệp</span>
            </h2>
            <p className="text-xs md:text-sm crm-text-secondary mt-1 leading-relaxed">
              Nơi tải lên và quản lý tài liệu để các Subagent (Lễ tân, Bán hàng, CSKH, Đặt lịch) tra cứu tự động trước khi phản hồi khách hàng.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            {/* Upload File Button */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload}
              className="hidden" 
              accept=".txt,.md,.pdf,.docx,.xlsx,.json"
            />
            <button
              onClick={() => {
                if (activeTab !== 'all') setNewCategory(activeTab);
                fileInputRef.current?.click();
              }}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 crm-input hover:border-[#2bb9f9] shadow-sm transition-all"
            >
              <FileUp className="w-4 h-4 text-[#2bb9f9]" />
              <span>Up tài liệu</span>
            </button>

            {/* Manual Add Button */}
            <button
              onClick={() => {
                if (activeTab !== 'all') setNewCategory(activeTab);
                setIsAdding(!isAdding);
              }}
              className="astronixa-btn-primary px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm bài viết</span>
            </button>
          </div>
        </div>

        {/* 5 Main Knowledge Tabs Bar */}
        <div className="crm-card p-1.5 rounded-2xl border flex items-center gap-1.5 overflow-x-auto no-scrollbar shadow-sm">
          {KNOWLEDGE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            const count = tab.id === 'all' 
              ? items.length 
              : items.filter(k => k.category === tab.id).length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'astronixa-btn-primary shadow-md'
                    : 'crm-text-secondary hover:crm-text-primary hover:bg-black/5 dark:hover:bg-white/[0.06]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#2bb9f9]'}`} />
                <span>{tab.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'crm-input text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Contextual Guide Banner */}
        <div className="crm-banner p-3.5 rounded-2xl border flex items-center justify-between text-xs font-medium shadow-sm">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#2bb9f9] flex-shrink-0" />
            <span className="leading-snug">
              <strong className="text-[#2bb9f9] font-bold">Mục tiêu {currentTabDef.name}:</strong> {currentTabDef.guide}
            </span>
          </div>
          <span className="hidden sm:inline-block text-[11px] crm-text-muted font-mono flex-shrink-0 ml-3">
            Gemini 3.8 Flash RAG Active
          </span>
        </div>

        {/* Search & Stats Bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 crm-text-muted absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder={`Tìm kiếm trong danh mục ${currentTabDef.name}... (nhập từ khóa, bảng giá, chính sách)`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs crm-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#c044ff]/40 font-medium"
            />
          </div>
          <span className="text-xs crm-text-muted font-bold whitespace-nowrap">
            {filteredItems.length} tài liệu
          </span>
        </div>

        {/* Form: Add or Upload Document */}
        {isAdding && (
          <form onSubmit={handleAdd} className="astronixa-card p-6 border border-[#ad30fb]/50 shadow-2xl space-y-4 rounded-3xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-[var(--crm-border)] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#2bb9f9]" />
                <h3 className="font-extrabold crm-text-primary text-base">Thêm tài liệu mới vào Kho kiến thức</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="crm-text-muted hover:crm-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold crm-text-secondary block mb-1">
                  Chọn Tab Danh mục
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as KnowledgeCategory)}
                  className="w-full px-3.5 py-2.5 text-xs crm-input font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c044ff]/40 text-[#ad30fb]"
                >
                  <option value="Cá Nhân">Cá Nhân (Sở thích, lịch riêng, ghi chú riêng)</option>
                  <option value="Công Ty">Công Ty (Giới thiệu, chính sách đổi trả, liên hệ)</option>
                  <option value="Sản Phẩm">Sản Phẩm (Sản phẩm, dịch vụ, bảng giá)</option>
                  <option value="Workflow">Workflow (Quy trình bán hàng, giao hàng, hậu mãi)</option>
                  <option value="Quy Ước">Quy Ước (Quy ước trả lời, câu mẫu, điều cấm nói)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold crm-text-secondary block mb-1">
                  Tiêu đề tài liệu
                </label>
                <input
                  type="text"
                  placeholder="VD: Bảng giá dịch vụ 2026 / Chính sách hoàn tiền 100%..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs crm-input rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c044ff]/40"
                />
              </div>
            </div>

            {attachedFileName && (
              <div className="flex items-center justify-between p-2.5 crm-input rounded-xl text-xs font-mono">
                <span className="flex items-center gap-1.5 text-[#2bb9f9] font-bold">
                  <FileUp className="w-4 h-4" /> Tệp đính kèm: {attachedFileName} ({attachedFileSize})
                </span>
                <button
                  type="button"
                  onClick={() => { setAttachedFileName(''); setAttachedFileSize(''); }}
                  className="text-rose-400 hover:text-rose-300 font-bold"
                >
                  Gỡ tệp
                </button>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold crm-text-secondary">
                  Nội dung chi tiết (Dữ liệu huấn luyện RAG cho Subagent)
                </label>
                <span className="text-[11px] crm-text-muted">Hỗ trợ Markdown & Bullet points</span>
              </div>
              <textarea
                rows={5}
                placeholder="Nhập nội dung rõ ràng, mạch lạc để AI tra cứu chính xác nhất..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full p-3.5 text-xs crm-input rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c044ff]/40 font-mono leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-xs crm-text-secondary hover:crm-text-primary rounded-xl font-bold transition-colors crm-input"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="astronixa-btn-primary px-5 py-2 text-xs font-bold rounded-xl shadow-lg"
              >
                Lưu vào kho tri thức
              </button>
            </div>
          </form>
        )}

        {/* Knowledge Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="astronixa-card p-12 text-center rounded-3xl border border-dashed border-[var(--crm-border)]">
            <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-60" />
            <h4 className="font-extrabold crm-text-primary text-base">Chưa có tài liệu nào trong mục này</h4>
            <p className="text-xs crm-text-muted mt-1 max-w-md mx-auto">
              Hãy bấm <strong>"Thêm bài viết"</strong> hoặc <strong>"Up tài liệu"</strong> để nạp tri thức cho Subagent tra cứu tự động.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredItems.map((item) => {
              const tabMeta = KNOWLEDGE_TABS.find(t => t.id === item.category);
              const Icon = tabMeta?.icon || FileText;

              return (
                <div 
                  key={item.id} 
                  className="astronixa-card p-5 md:p-6 border border-[#ad30fb]/30 hover:border-[#2bb9f9] transition-all rounded-3xl shadow-sm flex flex-col justify-between group"
                >
                  <div>
                    {/* Header: Category Badge + Date + Actions */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border flex items-center gap-1.5 shadow-xs ${tabMeta?.badgeColor || 'text-purple-400 border-purple-500/30'}`}>
                        <Icon className="w-3.5 h-3.5" />
                        <span>{item.category}</span>
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] crm-text-muted font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {item.updatedAt}
                        </span>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          title="Xóa tài liệu này"
                          className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-500 p-1 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="font-extrabold crm-text-primary text-base mb-2 group-hover:text-[#2bb9f9] transition-colors">
                      {item.title}
                    </h4>

                    {/* File Attachment Pill */}
                    {item.fileName && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-mono crm-input mb-3 text-[#2bb9f9]">
                        <FileUp className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[200px]">{item.fileName}</span>
                        {item.fileSize && <span className="opacity-60">({item.fileSize})</span>}
                      </div>
                    )}

                    {/* Content Snippet */}
                    <pre className="text-xs crm-text-secondary font-sans whitespace-pre-wrap crm-input p-3.5 rounded-2xl max-h-40 overflow-y-auto leading-relaxed border">
                      {item.content}
                    </pre>
                  </div>

                  {/* Card Footer: Quick Actions */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-[var(--crm-border)] text-xs">
                    <span className="text-[11px] text-[#2bb9f9] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Subagent RAG Tra cứu
                    </span>
                    <button
                      onClick={() => setViewingItem(item)}
                      className="crm-text-secondary hover:crm-text-primary font-bold flex items-center gap-1 hover:underline text-xs"
                    >
                      <Eye className="w-3.5 h-3.5" /> Xem chi tiết
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="astronixa-card w-full max-w-2xl max-h-[85vh] flex flex-col p-6 rounded-3xl border border-[#ad30fb]/60 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--crm-border)]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full border bg-purple-500/10 text-purple-400 border-purple-500/30">
                  {viewingItem.category}
                </span>
                <span className="text-xs crm-text-muted font-mono">{viewingItem.updatedAt}</span>
              </div>
              <button 
                onClick={() => setViewingItem(null)}
                className="crm-text-muted hover:crm-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              <h3 className="text-xl font-extrabold crm-text-primary">{viewingItem.title}</h3>
              {viewingItem.fileName && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono crm-input text-[#2bb9f9]">
                  <FileUp className="w-4 h-4" /> Tệp gốc: {viewingItem.fileName} ({viewingItem.fileSize})
                </div>
              )}
              <div className="crm-input p-4 rounded-2xl border leading-relaxed text-sm whitespace-pre-wrap font-sans crm-text-primary">
                {viewingItem.content}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[var(--crm-border)]">
              <button
                onClick={() => setViewingItem(null)}
                className="astronixa-btn-primary px-5 py-2 text-xs font-bold rounded-xl"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
