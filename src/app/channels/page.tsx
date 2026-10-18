'use client';

import React, { useState, useEffect } from 'react';
import { INITIAL_CHANNELS } from '@/lib/initial-data';
import { ChannelStatus } from '@/types/crm';
import { 
  Globe, 
  Smartphone, 
  MessageSquare, 
  Facebook, 
  Instagram, 
  Send, 
  Music, 
  Check, 
  Copy, 
  ExternalLink, 
  Settings2, 
  X, 
  Sparkles, 
  QrCode, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

interface ChannelGuide {
  title: string;
  badge: string;
  description: string;
  docLink?: string;
  docLinkText?: string;
  steps: string[];
  fields: { key: string; label: string; placeholder: string; type?: string; defaultValue?: string }[];
  webhookUrl?: string;
}

const GUIDES: Record<string, ChannelGuide> = {
  telegram: {
    title: 'Kết nối Telegram Bot',
    badge: 'Dễ nhất • Chạy ngay 100%',
    description: 'Chạy bot Telegram trực tiếp từ máy hoặc server mà không cần mở cổng IP công khai.',
    docLink: 'https://t.me/BotFather',
    docLinkText: 'Mở @BotFather trên Telegram',
    steps: [
      '1. Mở ứng dụng Telegram, tìm tài khoản @BotFather (có tích xanh chính thức).',
      '2. Gửi lệnh /newbot và làm theo hướng dẫn để đặt Tên bot và Username.',
      '3. Copy chuỗi HTTP API Token (dạng: 123456789:ABCdefGHIjkl...) dán vào ô bên dưới.',
      '4. Bấm "Lưu & Kích hoạt Bot". Subagent sẽ tự động trả lời khi có người nhắn tin tới Bot!'
    ],
    fields: [
      { key: 'botToken', label: 'Telegram Bot Token', placeholder: 'vd: 7123456789:AAF_kL9...', type: 'password' }
    ],
    webhookUrl: '/api/webhooks/telegram'
  },
  facebook: {
    title: 'Kết nối Facebook Messenger Fanpage',
    badge: 'Meta Graph API',
    description: 'Đồng bộ toàn bộ tin nhắn từ Fanpage Facebook vào Hộp thư CRM của AGENT OHANA.',
    docLink: 'https://developers.facebook.com/apps/',
    docLinkText: 'Truy cập Meta for Developers',
    steps: [
      '1. Truy cập developers.facebook.com, tạo ứng dụng loại "Doanh nghiệp" (Business).',
      '2. Thêm sản phẩm "Messenger", liên kết Fanpage của bạn để cấp quyền quản lý tin nhắn.',
      '3. Tạo "Page Access Token" cho Fanpage của bạn và dán vào ô bên dưới.',
      '4. Vào mục Webhooks trong ứng dụng Meta, dán Webhook URL và Mã xác minh (Verify Token).'
    ],
    fields: [
      { key: 'pageAccessToken', label: 'Page Access Token', placeholder: 'EAAQ...', type: 'password' },
      { key: 'verifyToken', label: 'Mã xác minh (Verify Token)', placeholder: 'ohana_verify_token_2026', defaultValue: 'ohana_verify_token_2026' }
    ],
    webhookUrl: '/api/webhooks/facebook'
  },
  webchat: {
    title: 'Nhúng Khung Chat trên Website (Widget)',
    badge: 'HTML / JS Snippet',
    description: 'Thêm khung chat trực tiếp vào website WordPress, Haravan, Shopify, Next.js hoặc HTML bất kỳ.',
    steps: [
      '1. Sao chép đoạn mã JavaScript bên dưới.',
      '2. Dán đoạn mã này vào trước thẻ đóng </body> trong mã nguồn website của bạn.',
      '3. Khung chat OHANA sẽ xuất hiện ở góc dưới website, khách nhắn tin sẽ đổ trực tiếp vào Hộp thư CRM!'
    ],
    fields: [
      { 
        key: 'widgetCode', 
        label: 'Mã nhúng HTML/JavaScript', 
        placeholder: '', 
        defaultValue: `<script src="https://agent-ohana.vn/widget.js" data-crm="ohana" async></script>` 
      }
    ]
  },
  zalo_personal: {
    title: 'Kết nối Zalo Cá Nhân (Quét QR)',
    badge: 'Zalo Web Automation',
    description: 'Đồng bộ tài khoản Zalo cá nhân qua mã QR — gửi và nhận tin trực tiếp như trên điện thoại.',
    steps: [
      '1. Mở ứng dụng Zalo trên điện thoại di động của bạn.',
      '2. Bấm vào biểu tượng Quét mã QR ở góc trên bên phải.',
      '3. Hướng camera quét mã QR hiển thị bên dưới và xác nhận "Đăng nhập trên máy tính".',
      '4. Sau khi kết nối, hệ thống sẽ duy trì phiên đăng nhập và tự động lắng nghe tin nhắn khách gửi.'
    ],
    fields: []
  },
  zalo_oa: {
    title: 'Kết nối Zalo Official Account (Zalo OA)',
    badge: 'Zalo Developers API',
    description: 'Kết nối tài khoản Zalo Doanh nghiệp chính thức để chăm sóc khách hàng và gửi thông báo ZNS.',
    docLink: 'https://developers.zalo.me/',
    docLinkText: 'Mở Zalo Developers Portal',
    steps: [
      '1. Đăng ký tài khoản Zalo OA tại oa.zalo.me và kích hoạt trạng thái Doanh nghiệp.',
      '2. Tạo ứng dụng trên developers.zalo.me, liên kết với Zalo OA của bạn.',
      '3. Cấp quyền Official Account API (Gửi/Nhận tin nhắn) và lấy App ID, Secret Key.',
      '4. Cấu hình Webhook URL trong ứng dụng Zalo để nhận thông báo tin nhắn.'
    ],
    fields: [
      { key: 'oaId', label: 'Zalo OA ID', placeholder: 'vd: 1234567890123...' },
      { key: 'appId', label: 'Zalo App ID', placeholder: 'vd: 456789...' },
      { key: 'secretKey', label: 'Secret Key', placeholder: 'vd: abcxyz...', type: 'password' }
    ],
    webhookUrl: '/api/webhooks/zalo'
  },
  instagram: {
    title: 'Kết nối Instagram Direct',
    badge: 'Instagram Graph API',
    description: 'Tiếp nhận và phản hồi tin nhắn Direct Message từ tài khoản Instagram Doanh nghiệp.',
    steps: [
      '1. Chuyển tài khoản Instagram của bạn sang tài khoản Chuyên nghiệp (Business/Creator).',
      '2. Kết nối tài khoản Instagram với Fanpage Facebook tương ứng.',
      '3. Bật tùy chọn "Cho phép truy cập tin nhắn" trong Cài đặt > Tin nhắn trên app Instagram.',
      '4. Cấp quyền truy cập trong ứng dụng Meta for Developers đã tạo ở bước Facebook.'
    ],
    fields: [
      { key: 'igAccountId', label: 'Instagram Business Account ID', placeholder: 'vd: 178414...' }
    ]
  },
  tiktok: {
    title: 'Kết nối TikTok Direct Message',
    badge: 'Webhook Relay / Make / n8n',
    description: 'Do TikTok chỉ mở API trực tiếp cho các đối tác lớn, bạn có thể kết nối dễ dàng qua Webhook.',
    steps: [
      '1. Tạo kịch bản bắt tin nhắn TikTok trên Make.com, n8n hoặc ManyChat.',
      '2. Sử dụng hành động HTTP POST gửi dữ liệu về Webhook URL của CRM OHANA.',
      '3. Subagent sẽ nhận diện tin nhắn và gửi lại phản hồi thông qua webhook tương ứng.'
    ],
    fields: [],
    webhookUrl: '/api/webhooks/tiktok'
  }
};

export default function ChannelsPage() {
  const [channels, setChannels] = useState<ChannelStatus[]>(INITIAL_CHANNELS);
  const [selectedChannel, setSelectedChannel] = useState<ChannelStatus | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [clientOrigin, setClientOrigin] = useState('https://subagent-ohana.vercel.app');
  const [testMsg, setTestMsg] = useState('Chào bot, tư vấn giúp tôi gói dịch vụ Ohana!');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setClientOrigin(window.location.origin);
    }
  }, []);

  const handleSendTestWebhook = async () => {
    if (!testMsg.trim()) return;
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/webhooks/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            chat: { id: 888999111 },
            from: { first_name: 'Khách Test Telegram', username: 'test_telegram_user' },
            text: testMsg.trim()
          }
        })
      });
      const data = await res.json();
      if (data.ok) {
        setTestResult('Đã gửi tin thành công! Tin nhắn đã xuất hiện trong Hộp thư (Inbox) và được Subagent tiếp nhận tự động.');
      } else {
        setTestResult('Gửi test thất bại: ' + (data.error || 'Lỗi không xác định'));
      }
    } catch (e: any) {
      setTestResult('Lỗi kết nối test: ' + e.message);
    } finally {
      setIsTesting(false);
    }
  };

  const openConfigModal = (channel: ChannelStatus) => {
    setSelectedChannel(channel);
    setIsSaved(false);
    setTestResult(null);

    // Load defaults if any
    const guide = GUIDES[channel.id];
    const initial: Record<string, string> = {};
    if (guide?.fields) {
      guide.fields.forEach(f => {
        if (f.defaultValue) initial[f.key] = f.defaultValue;
      });
    }
    setFieldValues(initial);
  };

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveConfig = async () => {
    if (!selectedChannel) return;

    try {
      await fetch('/api/channels/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId: selectedChannel.id,
          config: fieldValues
        })
      });

      // Update channel status to active
      setChannels(prev => prev.map(c => {
        if (c.id === selectedChannel.id) {
          return {
            ...c,
            isActive: true,
            statusText: 'Đang chạy'
          };
        }
        return c;
      }));

      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        setSelectedChannel(null);
      }, 1500);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleChannel = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChannels(prev => prev.map(c => {
      if (c.id === id) {
        const nextActive = !c.isActive;
        return {
          ...c,
          isActive: nextActive,
          statusText: nextActive ? 'Đang chạy' : 'Chưa bật'
        };
      }
      return c;
    }));
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'webchat': return <Globe className="w-5.5 h-5.5 text-cyan-600" />;
      case 'zalo_personal': return <Smartphone className="w-5.5 h-5.5 text-blue-600" />;
      case 'zalo_oa': return <MessageSquare className="w-5.5 h-5.5 text-emerald-600" />;
      case 'facebook': return <Facebook className="w-5.5 h-5.5 text-purple-600" />;
      case 'instagram': return <Instagram className="w-5.5 h-5.5 text-rose-600" />;
      case 'telegram': return <Send className="w-5.5 h-5.5 text-sky-600" />;
      case 'tiktok': return <Music className="w-5.5 h-5.5 text-slate-800" />;
      default: return <Globe className="w-5.5 h-5.5" />;
    }
  };

  const guide = selectedChannel ? GUIDES[selectedChannel.id] : null;

  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-6xl mx-auto space-y-6 text-[#f0f1f6]">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full astronixa-badge text-xs font-bold mb-2 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#2bb9f9]" />
            <span>TRUNG TÂM TIẾP NHẬN ĐA KÊNH • OMNICHANNEL</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight font-display">
            Kết nối Kênh <span className="astronixa-title-gradient">Hội Thoại AI</span>
          </h2>
          <p className="text-sm text-[#cfc2d9] mt-1 max-w-2xl leading-relaxed">
            Nhấp vào bất kỳ kênh nào bên dưới để xem hướng dẫn chi tiết từng bước, lấy Webhook URL và dán API Token để bắt đầu nhận tin nhắn tự động.
          </p>
        </div>
        <ThemeToggle variant="pill" />
      </div>

      {/* Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {channels.map((ch) => (
          <div
            key={ch.id}
            onClick={() => openConfigModal(ch)}
            className="astronixa-card p-6 cursor-pointer flex flex-col justify-between group relative overflow-hidden transition-all hover:scale-[1.01]"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-lg">
                  {getIcon(ch.id)}
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h4 className="font-extrabold text-white text-base group-hover:text-[#2bb9f9] transition-colors">
                      {ch.name}
                    </h4>
                    <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                      ch.isActive 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                        : 'bg-white/5 text-slate-400 border border-white/10'
                    }`}>
                      {ch.statusText}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-[#cfc2d9] mt-1.5 leading-relaxed font-medium">
                    {ch.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
              <span className="text-xs font-bold text-[#c044ff] group-hover:text-[#2bb9f9] transition-colors flex items-center gap-1.5">
                <Settings2 className="w-4 h-4" />
                Cấu hình & Hướng dẫn kết nối
              </span>

              <button
                onClick={(e) => toggleChannel(ch.id, e)}
                className={`text-xs font-bold px-4 py-1.5 rounded-xl transition-all ${
                  ch.isActive
                    ? 'border border-rose-500/40 text-rose-300 hover:bg-rose-500/20 bg-rose-500/10'
                    : 'astronixa-btn-primary'
                }`}
              >
                {ch.isActive ? 'Ngắt kết nối' : 'Bật nhanh'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ----------------- MODAL HƯỚNG DẪN & CẤU HÌNH CHI TIẾT ----------------- */}
      {selectedChannel && guide && (
        <div className="fixed inset-0 bg-[#02062a]/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="astronixa-card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 relative border border-[#ad30fb]/50 text-[#f0f1f6] shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-[#ad30fb]/30 flex items-center justify-center flex-shrink-0">
                  {getIcon(selectedChannel.id)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white">
                      {guide.title}
                    </h3>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full astronixa-badge text-[#2bb9f9]">
                      {guide.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#cfc2d9] mt-1">
                    {guide.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedChannel(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Zalo cá nhân QR Demo */}
            {selectedChannel.id === 'zalo_personal' && (
              <div className="p-6 bg-[#070b34]/80 border border-[#ad30fb]/40 rounded-3xl text-center space-y-3">
                <div className="w-44 h-44 bg-white p-3 rounded-2xl mx-auto shadow-md border border-cyan-400 flex flex-col items-center justify-center">
                  <QrCode className="w-32 h-32 text-blue-900" />
                  <span className="text-[10px] font-bold text-slate-600 mt-1">Mã QR kết nối Zalo</span>
                </div>
                <p className="text-xs font-bold text-cyan-300">
                  Quét mã QR trên bằng ứng dụng Zalo trên điện thoại để đồng bộ tin nhắn
                </p>
              </div>
            )}

            {/* Các bước thực hiện */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-[#2bb9f9] uppercase tracking-wider">
                  Các bước thiết lập (Hướng dẫn từng bước)
                </h4>
                {guide.docLink && (
                  <a
                    href={guide.docLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-[#fc3cff] hover:underline flex items-center gap-1"
                  >
                    <span>{guide.docLinkText}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="bg-[#070b34]/90 p-4 rounded-2xl border border-[#ad30fb]/30 space-y-2.5 text-xs md:text-sm text-[#f0f1f6] leading-relaxed font-medium">
                {guide.steps.map((step, idx) => (
                  <p key={idx} className="flex items-start gap-2">
                    <span className="font-extrabold text-[#2bb9f9]">•</span>
                    <span>{step}</span>
                  </p>
                ))}
              </div>
            </div>

            {/* Webhook URL (nếu có) */}
            {guide.webhookUrl && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#cfc2d9] block">
                  Webhook URL (Dán vào cài đặt Webhook của nền tảng)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${clientOrigin}${guide.webhookUrl}`}
                    className="flex-1 px-3.5 py-2.5 text-xs font-mono bg-[#070b34] border border-[#ad30fb]/30 rounded-xl text-cyan-300 select-all focus:outline-none"
                  />
                  <button
                    onClick={() => handleCopy(`${clientOrigin}${guide.webhookUrl}`, 'webhook')}
                    className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 border border-white/20 transition-colors"
                  >
                    {copiedKey === 'webhook' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Đã chép!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Thử nghiệm giả lập tin nhắn Telegram / Webhook */}
            {selectedChannel.id === 'telegram' && (
              <div className="p-4 bg-sky-950/40 border border-sky-400/40 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-bold text-sky-300 uppercase tracking-wide">
                      Thử nghiệm giả lập tin nhắn Telegram ngay tại đây
                    </span>
                  </div>
                  <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-bold">
                    Test trực tiếp
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Gửi một tin nhắn mẫu để kiểm tra xem Subagent AI có tự động tiếp nhận và phản hồi không:
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={testMsg}
                    onChange={(e) => setTestMsg(e.target.value)}
                    placeholder="Nhập câu hỏi test cho Subagent..."
                    className="flex-1 px-3.5 py-2 text-xs bg-[#070b34] text-white border border-sky-400/30 rounded-xl focus:outline-none focus:border-sky-400 font-medium"
                  />
                  <button
                    type="button"
                    disabled={isTesting}
                    onClick={handleSendTestWebhook}
                    className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 flex-shrink-0"
                  >
                    {isTesting ? <span>Đang xử lý...</span> : <span>Gửi tin test</span>}
                  </button>
                </div>
                {testResult && (
                  <div className="p-3 bg-emerald-950/70 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span>{testResult}</span>
                    <a
                      href="/inbox"
                      className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 rounded-lg font-bold underline flex-shrink-0"
                    >
                      <span>Mở Hộp thư (Inbox)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Form Input Credentials */}
            {guide.fields && guide.fields.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-white/10">
                <h4 className="text-xs font-black text-[#2bb9f9] uppercase tracking-wider">
                  Thông tin xác thực & Token (Credentials)
                </h4>

                {guide.fields.map((f) => (
                  <div key={f.key}>
                    <label className="text-xs font-bold text-[#cfc2d9] block mb-1">
                      {f.label}
                    </label>
                    {f.key === 'widgetCode' ? (
                      <div className="relative">
                        <textarea
                          readOnly
                          rows={2}
                          value={fieldValues[f.key] || f.defaultValue || ''}
                          className="w-full p-3 text-xs font-mono bg-[#070b34] text-cyan-300 rounded-xl select-all border border-[#ad30fb]/40 leading-relaxed focus:outline-none"
                        />
                        <button
                          onClick={() => handleCopy(fieldValues[f.key] || f.defaultValue || '', 'widget')}
                          className="absolute right-2.5 top-2.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold flex items-center gap-1 border border-white/20"
                        >
                          {copiedKey === 'widget' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === 'widget' ? 'Đã chép' : 'Sao chép mã'}</span>
                        </button>
                      </div>
                    ) : (
                      <input
                        type={f.type || 'text'}
                        placeholder={f.placeholder}
                        value={fieldValues[f.key] || ''}
                        onChange={(e) => setFieldValues({ ...fieldValues, [f.key]: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs md:text-sm font-mono bg-[#070b34] text-white border border-[#ad30fb]/40 rounded-xl focus:outline-none focus:border-[#2bb9f9]"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              {isSaved && (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mr-auto">
                  <Check className="w-4 h-4" />
                  Đã kích hoạt và lưu cấu hình thành công!
                </span>
              )}
              <button
                type="button"
                onClick={() => setSelectedChannel(null)}
                className="px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors border border-white/10"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleSaveConfig}
                className="astronixa-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold shadow-xl transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Lưu & Kích hoạt Kênh</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
