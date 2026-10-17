'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Clock, 
  MoreVertical, 
  Calendar, 
  ChevronRight, 
  Play, 
  Trash2, 
  X, 
  CheckCircle2, 
  Sparkles,
  ListTodo,
  AlertCircle,
  Edit2,
  RotateCw,
  Check,
  ChevronLeft
} from 'lucide-react';
import { ScheduledTask } from '@/types/crm';
import { INITIAL_TASKS } from '@/lib/initial-data';

interface TaskRunLog {
  id: string;
  time: string;
  duration: string;
  status: 'ok' | 'error';
  message: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<ScheduledTask[]>(INITIAL_TASKS);
  const [isCreating, setIsCreating] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected task for 9BizClaw slide-over drawer
  const [selectedTask, setSelectedTask] = useState<ScheduledTask | null>(null);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [editingPromptText, setEditingPromptText] = useState('');
  const [isRunningDrawerTask, setIsRunningDrawerTask] = useState(false);

  // Run logs history
  const [taskHistory, setTaskHistory] = useState<Record<string, TaskRunLog[]>>({
    'task-1': [
      {
        id: 'run-1',
        time: 'Hôm qua 00:00',
        duration: '1,2 giây',
        status: 'ok',
        message: 'Đã hoàn tất tổng hợp và sắp xếp thông tin trợ lý đã học.'
      }
    ],
    'task-4': [
      {
        id: 'run-2',
        time: 'Hôm qua 22:00',
        duration: '2,4 giây',
        status: 'ok',
        message: 'Đã đối soát sao kê và chốt tổng doanh thu ngày thành công.'
      }
    ]
  });

  // Form state for creating task
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSchedule, setNewSchedule] = useState('Vào 00:00, mỗi ngày');
  const [newNextRun, setNewNextRun] = useState('Ngày mai 00:00');
  const [newCategory, setNewCategory] = useState('Bộ nhớ');

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setTasks(json.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle switch
  const handleToggle = async (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isEnabled: !t.isEnabled } : t));

    if (selectedTask && selectedTask.id === id) {
      setSelectedTask(prev => prev ? { ...prev, isEnabled: !prev.isEnabled } : null);
    }

    try {
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Đã ${data.data.isEnabled ? 'bật' : 'tắt'} nhiệm vụ "${data.data.title}"`);
      }
    } catch {
      showToast('Đã cập nhật trạng thái nhiệm vụ');
    }
  };

  // Run task immediately
  const handleRunNow = (task: ScheduledTask) => {
    setOpenMenuId(null);
    setIsRunningDrawerTask(true);
    showToast(`Đang chạy ngay nhiệm vụ "${task.title}"... Trợ lý AI đang thực thi.`);

    setTimeout(() => {
      const nowStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' hôm nay';
      setTasks(prev => prev.map(t => t.id === task.id ? { 
        ...t, 
        lastRun: nowStr
      } : t));

      if (selectedTask && selectedTask.id === task.id) {
        setSelectedTask(prev => prev ? { ...prev, lastRun: nowStr } : null);
      }

      // Add to history
      const newLog: TaskRunLog = {
        id: 'run-' + Date.now(),
        time: nowStr,
        duration: '1,4 giây',
        status: 'ok',
        message: `Đã thực thi thành công: ${task.description || task.title}`
      };

      setTaskHistory(prev => ({
        ...prev,
        [task.id]: [newLog, ...(prev[task.id] || [])]
      }));

      setIsRunningDrawerTask(false);
      showToast(`Nhiệm vụ "${task.title}" đã hoàn tất thành công!`);
    }, 1200);
  };

  // Save edited prompt in drawer
  const handleSavePrompt = () => {
    if (!selectedTask) return;
    const updated = { ...selectedTask, description: editingPromptText };
    setSelectedTask(updated);
    setTasks(prev => prev.map(t => t.id === selectedTask.id ? updated : t));
    setIsEditingPrompt(false);
    showToast('Đã cập nhật yêu cầu cho trợ lý.');
  };

  // Delete task
  const handleDelete = async (id: string) => {
    setOpenMenuId(null);
    if (!confirm('Bạn có chắc chắn muốn xóa nhiệm vụ này?')) return;

    try {
      await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
    } catch {}

    setTasks(prev => prev.filter(t => t.id !== id));
    if (selectedTask?.id === id) {
      setSelectedTask(null);
    }
    showToast('Đã xóa nhiệm vụ thành công');
  };

  // Create task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('Vui lòng nhập việc trợ lý cần làm!');
      return;
    }

    const payload = {
      title: newTitle.trim(),
      description: newDesc.trim() || 'Nhiệm vụ tự động chạy định kỳ cho trợ lý AI.',
      schedule: newSchedule,
      nextRun: newNextRun,
      category: newCategory
    };

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setTasks([data.data, ...tasks]);
      } else {
        const localTask: ScheduledTask = {
          id: 'task-' + Date.now(),
          ...payload,
          lastRun: 'Chưa chạy',
          isEnabled: true
        };
        setTasks([localTask, ...tasks]);
      }
    } catch {
      const localTask: ScheduledTask = {
        id: 'task-' + Date.now(),
        ...payload,
        lastRun: 'Chưa chạy',
        isEnabled: true
      };
      setTasks([localTask, ...tasks]);
    }

    showToast(`Đã tạo nhiệm vụ "${newTitle}"`);
    setNewTitle('');
    setNewDesc('');
    setIsCreating(false);
  };

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
      <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        
        {/* Top Header: Title + Count + Add Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black crm-text-primary tracking-tight font-display">
              Nhiệm vụ
            </h1>
            <p className="text-xs md:text-sm crm-text-muted mt-0.5">
              {tasks.length} nhiệm vụ
            </p>
          </div>

          <button
            onClick={() => setIsCreating(true)}
            className="bg-gradient-to-r from-[#e11d48] to-[#be123c] hover:from-[#be123c] hover:to-[#9f1239] text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo nhiệm vụ</span>
          </button>
        </div>

        {/* Tasks Table (Matching Image 2 layout with interactive click) */}
        <div className="crm-card rounded-2xl border overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-12 px-6 py-3.5 border-b border-[var(--crm-border)] text-[11px] font-bold crm-text-muted uppercase tracking-wider">
            <div className="col-span-3 sm:col-span-2">LẦN TỚI</div>
            <div className="col-span-6 sm:col-span-5">VIỆC TRỢ LÝ LÀM</div>
            <div className="hidden sm:block sm:col-span-2">LỊCH CHẠY</div>
            <div className="hidden sm:block sm:col-span-2">LẦN CHẠY CUỐI</div>
            <div className="col-span-3 sm:col-span-1 text-right">BẬT</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-[var(--crm-border)]">
            {tasks.length === 0 ? (
              <div className="p-12 text-center crm-text-muted text-xs">
                Chưa có nhiệm vụ nào được lên lịch. Bấm <strong>"+ Tạo nhiệm vụ"</strong> để giao việc tự động cho trợ lý.
              </div>
            ) : (
              tasks.map((task) => {
                const nextParts = task.nextRun.split(' ');
                const nextDay = nextParts[0] || 'Ngày mai';
                const nextTime = nextParts.slice(1).join(' ') || '00:00';
                const isSelected = selectedTask?.id === task.id;

                return (
                  <div 
                    key={task.id}
                    onClick={() => {
                      setSelectedTask(task);
                      setIsEditingPrompt(false);
                    }}
                    className={`grid grid-cols-12 px-6 py-4.5 items-center cursor-pointer transition-all relative ${
                      isSelected 
                        ? 'bg-[#c044ff]/10 border-l-4 border-l-[#c044ff]' 
                        : 'hover:bg-black/5 dark:hover:bg-white/[0.04]'
                    }`}
                  >
                    {/* Lần tới Col */}
                    <div className="col-span-3 sm:col-span-2 flex items-center gap-3">
                      <div>
                        <div className="text-[11px] crm-text-muted font-medium">
                          {nextDay}
                        </div>
                        <div className="text-sm font-black crm-text-primary tracking-tight font-mono">
                          {nextTime}
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center gap-1 text-purple-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>

                    {/* Việc trợ lý làm Col */}
                    <div className="col-span-6 sm:col-span-5 pr-4">
                      <h4 className="font-extrabold crm-text-primary text-sm tracking-tight hover:text-[#2bb9f9] transition-colors">
                        {task.title}
                      </h4>
                      <p className="text-xs crm-text-muted mt-0.5 line-clamp-1 italic font-normal">
                        {task.description}
                      </p>
                    </div>

                    {/* Lịch chạy Col */}
                    <div className="hidden sm:block sm:col-span-2 text-xs crm-text-secondary font-medium">
                      {task.schedule}
                    </div>

                    {/* Lần chạy cuối Col */}
                    <div className="hidden sm:block sm:col-span-2 text-xs crm-text-muted font-medium">
                      {task.lastRun}
                    </div>

                    {/* Bật Toggle & Menu Col */}
                    <div className="col-span-3 sm:col-span-1 flex items-center justify-end gap-2.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggle(task.id);
                        }}
                        className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                          task.isEnabled 
                            ? 'bg-emerald-500 shadow-sm' 
                            : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        title={task.isEnabled ? 'Nhấn để tắt nhiệm vụ' : 'Nhấn để bật nhiệm vụ'}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                            task.isEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>

                      {/* Three-dots Menu */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === task.id ? null : task.id);
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openMenuId === task.id && (
                          <div className="absolute right-0 top-full mt-1 w-44 crm-card border rounded-2xl shadow-2xl py-1.5 z-30 animate-in fade-in zoom-in-95">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRunNow(task);
                              }}
                              className="w-full text-left px-3.5 py-2 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-2 text-emerald-400"
                            >
                              <Play className="w-3.5 h-3.5" /> Chạy ngay bây giờ
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(task.id);
                              }}
                              className="w-full text-left px-3.5 py-2 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-2 text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Xóa nhiệm vụ
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          9BIZCLAW TASK DETAIL SLIDE-OVER DRAWER
          ========================================================================= */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setSelectedTask(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
          />

          {/* Slide-out drawer matching 9BizClaw screenshot */}
          <aside className="relative z-10 w-full sm:w-[480px] md:w-[540px] h-full crm-col-1 border-l border-[var(--crm-border)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
            
            {/* Header: Title + Close (X) */}
            <div className="p-6 border-b border-[var(--crm-border)] flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-black crm-text-primary tracking-tight">
                {selectedTask.title}
              </h2>
              <button 
                onClick={() => setSelectedTask(null)}
                className="p-1.5 rounded-xl crm-text-muted hover:crm-text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Đóng chi tiết"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* SECTION 1: LẦN CHẠY KẾ TIẾP */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-black uppercase tracking-wider crm-text-muted">
                  LẦN CHẠY KẾ TIẾP
                </h3>
                <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/[0.04] border border-[var(--crm-border)] space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-black crm-text-primary font-mono tracking-tight">
                      {selectedTask.nextRun.split(' ')[1] || '00:00'}
                    </span>
                    <span className="text-sm font-bold crm-text-secondary">
                      Chủ nhật, 18/10/2026
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 dark:text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Còn 2 giờ 43 phút</span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: VIỆC TRỢ LÝ SẼ LÀM */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider crm-text-muted">
                    VIỆC TRỢ LÝ SẼ LÀM
                  </h3>
                  <button
                    onClick={() => {
                      if (isEditingPrompt) {
                        handleSavePrompt();
                      } else {
                        setEditingPromptText(selectedTask.description);
                        setIsEditingPrompt(true);
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-[var(--crm-border)] crm-text-secondary hover:crm-text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                  >
                    {isEditingPrompt ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Lưu yêu cầu</span>
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Sửa yêu cầu</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Box content */}
                {isEditingPrompt ? (
                  <div className="space-y-2">
                    <textarea
                      rows={4}
                      value={editingPromptText}
                      onChange={(e) => setEditingPromptText(e.target.value)}
                      className="w-full p-4 rounded-2xl crm-input border border-[#c044ff]/50 text-xs sm:text-sm crm-text-primary focus:outline-none focus:ring-2 focus:ring-[#c044ff]/40 font-mono leading-relaxed"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsEditingPrompt(false)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold crm-input crm-text-secondary"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleSavePrompt}
                        className="astronixa-btn-primary px-4 py-1.5 rounded-xl text-xs font-bold shadow-md"
                      >
                        Lưu
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/[0.04] border border-[var(--crm-border)] text-xs sm:text-sm crm-text-primary italic font-serif leading-relaxed">
                    {selectedTask.description}
                  </div>
                )}

                {/* Chạy ngay button */}
                <button
                  onClick={() => handleRunNow(selectedTask)}
                  disabled={isRunningDrawerTask}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold crm-input border border-[var(--crm-border)] hover:border-[#2bb9f9] transition-all shadow-xs crm-text-primary"
                >
                  <Play className={`w-3.5 h-3.5 text-[#2bb9f9] fill-current ${isRunningDrawerTask ? 'animate-spin' : ''}`} />
                  <span>{isRunningDrawerTask ? 'Đang thực thi...' : 'Chạy ngay'}</span>
                </button>
              </div>

              {/* SECTION 3: Lịch sử chạy */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider crm-text-muted">
                    Lịch sử chạy
                  </h3>
                  <button
                    onClick={() => showToast('Đã làm mới lịch sử chạy.')}
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-[var(--crm-border)] crm-text-secondary hover:crm-text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Làm mới</span>
                  </button>
                </div>

                {/* History Box / Three-dots placeholder */}
                {taskHistory[selectedTask.id] && taskHistory[selectedTask.id].length > 0 ? (
                  <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/[0.04] border border-[var(--crm-border)] space-y-3">
                    {taskHistory[selectedTask.id].map((log) => (
                      <div key={log.id} className="flex items-start gap-3 text-xs pb-3 border-b border-[var(--crm-border)] last:border-0 last:pb-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold crm-text-primary">{log.time}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                              {log.duration}
                            </span>
                          </div>
                          <p className="crm-text-secondary mt-1">{log.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-black/5 dark:bg-white/[0.04] border border-[var(--crm-border)] flex items-center justify-center text-slate-400 dark:text-slate-500 font-mono text-2xl tracking-widest select-none">
                    • • •
                  </div>
                )}
              </div>
            </div>

            {/* Footer with Toggle */}
            <div className="p-4 px-6 border-t border-[var(--crm-border)] flex items-center justify-between flex-shrink-0 bg-black/10 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handleToggle(selectedTask.id)}
                  className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                    selectedTask.isEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  title={selectedTask.isEnabled ? 'Tắt nhiệm vụ' : 'Bật nhiệm vụ'}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                      selectedTask.isEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-xs font-bold crm-text-secondary">
                  {selectedTask.isEnabled ? 'Đang bật' : 'Đang tắt'}
                </span>
              </div>

              <button
                onClick={() => handleDelete(selectedTask.id)}
                className="text-xs font-bold text-rose-500 hover:text-rose-400 px-3 py-1.5 rounded-xl hover:bg-rose-500/10 transition-colors"
              >
                Xóa nhiệm vụ
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Modal: Tạo Nhiệm Vụ Mới */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form 
            onSubmit={handleCreateTask}
            className="astronixa-card w-full max-w-lg p-6 rounded-3xl border border-[#ad30fb]/60 shadow-2xl animate-in zoom-in-95 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--crm-border)]">
              <div className="flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-[#2bb9f9]" />
                <h3 className="text-lg font-black crm-text-primary">Tạo Nhiệm vụ Lặp lại</h3>
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
                Tên việc trợ lý làm
              </label>
              <input
                type="text"
                placeholder="VD: Tổng hợp báo cáo doanh thu ngày / Quét tin nhắn chưa trả lời..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs crm-input rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c044ff]/40"
              />
            </div>

            <div>
              <label className="text-xs font-bold crm-text-secondary block mb-1">
                Mô tả chi tiết công việc
              </label>
              <textarea
                rows={3}
                placeholder="Trợ lý sẽ tự động làm những gì trong nhiệm vụ này..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full p-3.5 text-xs crm-input rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c044ff]/40 leading-relaxed font-sans"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold crm-text-secondary block mb-1">
                  Lịch chạy lặp lại
                </label>
                <select
                  value={newSchedule}
                  onChange={(e) => setNewSchedule(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs crm-input font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c044ff]/40"
                >
                  <option value="Vào 00:00, mỗi ngày">Vào 00:00, mỗi ngày</option>
                  <option value="Vào 09:00, mỗi ngày">Vào 09:00, mỗi ngày</option>
                  <option value="Vào 22:00, mỗi ngày">Vào 22:00, mỗi ngày</option>
                  <option value="Mỗi 1 tuần">Mỗi 1 tuần (Thứ 2)</option>
                  <option value="Mỗi 1 tháng">Mỗi 1 tháng (Ngày 1)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold crm-text-secondary block mb-1">
                  Thời gian chạy lần tới
                </label>
                <input
                  type="text"
                  placeholder="VD: Ngày mai 00:00 / Thứ Hai 09:00..."
                  value={newNextRun}
                  onChange={(e) => setNewNextRun(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs crm-input rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c044ff]/40 font-mono"
                />
              </div>
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
                Lên lịch Nhiệm vụ
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
