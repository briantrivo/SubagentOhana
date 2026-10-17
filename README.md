# Subagent CRM - Omnichannel Multi-Subagent AI Architecture

Hệ thống CRM đa kênh tích hợp kiến trúc Đa tác tử AI (Multi-Subagent) chuyên trách, định tuyến thông minh qua Router Agent, tự động hóa phản hồi, tra cứu tài liệu kiến thức (RAG), cập nhật hồ sơ khách hàng và chuyển giao cho nhân viên (Handoff to Human).

---

## 🌟 Tính năng nổi bật

### 1. Kiến trúc Đa Subagent chuyên trách
- **🧭 Điều phối (Router Agent):** Tự động đọc ngữ cảnh hội thoại và định tuyến tin nhắn mới đến đúng Subagent phụ trách.
- **👋 Lễ tân (Receptionist Agent):** Chào khách mới, giới thiệu, xin thông tin Tên/SĐT.
- **💼 Tư vấn bán hàng (Sales Agent):** Tra cứu bảng giá, khuyến mãi, tính năng, chốt đơn.
- **🔧 CSKH & Hậu mãi (Customer Support Agent):** Tiếp nhận sự cố, đối soát giao dịch chuyển khoản. Tự động nhận diện khách giận dữ để gọi công cụ `handoff_to_human`.
- **📅 Đặt lịch & Nhắc hẹn (Booking Agent):** Quản lý lịch hẹn, giờ mở cửa.
- **🔄 Chăm sóc lại (Follow-up Agent):** Nhắn tin chủ động sau bán hàng hoặc kích hoạt lại khách cũ.

### 2. Giao diện Hộp thư Real-time (Chuẩn 3 cột như bản vẽ)
- **Cột 1:** Lọc theo kênh (Facebook, Zalo cá nhân, Zalo OA, Webchat, Telegram, TikTok) và tab trạng thái (Chưa đọc, Cần bạn, AI đang trực).
- **Cột 2:** Khung chat trực tiếp, hiển thị thẻ Subagent phụ trách, tin nhắn AI, bong bóng cảnh báo hệ thống (Handoff Alert), nút *AI gợi ý* và *Để AI trả lời*.
- **Cột 3:** Drawer thông tin khách hàng, thẻ Tag, giai đoạn Pipeline, AI ghi nhớ (Long-term memory) và nhắc việc.

### 3. Tổng quan & Đo lường Token
- Giám sát trạng thái 8 kênh kết nối.
- Thống kê tin nhắn khách và lượt AI phản hồi trong ngày.
- Theo dõi tiêu thụ token của Claude / Gemini theo Tháng, Hôm nay và 30 ngày.

---

## 🚀 Cách khởi chạy

Hệ thống hiện đang chạy tại: **`http://localhost:3005`**

Nếu muốn khởi động lại dự án:
```powershell
cd "d:\AGENT OHANA\subagent-crm"
npm.cmd run dev   # Môi trường Development (Port 3005)
# hoặc
npm.cmd run start # Môi trường Production (Port 3005)
```

---

## ⚙️ Cấu hình API Key AI (Claude & Gemini)
1. Mở trình duyệt truy cập: `http://localhost:3005/settings`
2. Nhập API Key:
   - **Claude API Key:** Lấy từ Anthropic Console.
   - **Google Gemini API Key:** Lấy từ Google AI Studio.
3. Chọn Model mặc định (`claude-sonnet-5`, `gemini-2.5-flash`, `gemini-2.5-pro`, `gpt-4o`).
4. Nhấn **Lưu tất cả thay đổi**.
