# HƯỚNG DẪN SỬ DỤNG HỆ THỐNG SUBAGENT CRM OHANA (ASTRONIXA)

> **Hệ điều hành AI đa nhiệm tự động hóa Bán hàng, CSKH & Vận hành Doanh nghiệp đa kênh.**  
> **Địa chỉ truy cập:** [https://subagent-ohana.vercel.app](https://subagent-ohana.vercel.app)

---

## MỤC LỤC
1. [Tổng quan Kiến trúc Hệ thống](#1-tổng-quan-kiến-trúc-hệ-thống)
2. [Kho Kiến thức Doanh nghiệp (RAG Knowledge)](#2-kho-kiến-thức-doanh-nghiệp-rag-knowledge)
3. [Đội ngũ Subagent AI Chuyên trách](#3-đội-ngũ-subagent-ai-chuyên-trách)
4. [Quản lý Kỹ năng (Skill) & Nhiệm vụ Tự động (Tasks)](#4-quản-lý-kỹ-năng-skill--nhiệm-vụ-tự-động-tasks)
5. [Hộp thư Hội thoại Đa kênh (Multi-channel Inbox)](#5-hộp-thư-hội-thoại-đa-kênh-multi-channel-inbox)
6. [Quy trình Bán hàng (Sales Pipeline Kanban)](#6-quy-trình-bán-hàng-sales-pipeline-kanban)
7. [Kết nối Đa kênh (Channels Integration)](#7-kết-nối-đa-kênh-channels-integration)
8. [Cài đặt Hệ thống & Chế độ Giao diện](#8-cài-đặt-hệ-thống--chế-độ-giao-diện)

---

## 1. TỔNG QUAN KIẾN TRÚC HỆ THỐNG

Subagent CRM Ohana vận hành dựa trên mô hình **Multi-Agent Orchestration (Đa tác tử phối hợp)** kết hợp cùng kỹ thuật **RAG (Retrieval-Augmented Generation)**:
- Khách hàng nhắn tin từ Facebook Messenger, Zalo OA, Telegram, TikTok.
- **Subagent Lễ Tân AI** chào đón, định danh và phân loại nhu cầu của khách.
- Hệ thống điều phối thông minh sang **Subagent Bán Hàng**, **CSKH** hoặc **Đặt Lịch**.
- Từng Subagent sẽ tự động tra cứu chính xác dữ liệu từ **Kho Kiến Thức RAG** trước khi phản hồi để đảm bảo câu trả lời luôn chuẩn xác và đúng bảng giá, chính sách công ty.

---

## 2. KHO KIẾN THỨC DOANH NGHIỆP (RAG KNOWLEDGE)

> **Đường dẫn:** `/knowledge`  
> Đây là "bộ não" của toàn bộ Subagent. AI chỉ trả lời đúng sự thật dựa trên dữ liệu bạn nạp vào đây, không tự bịa đặt thông tin.

### 2.1. Phân loại 5 danh mục kiến thức:
1. **Cá Nhân:** Lịch làm việc riêng của chủ doanh nghiệp, thông tin liên hệ khẩn cấp, phong cách xưng hô mong muốn.
2. **Công Ty:** Lịch sử, tầm nhìn, địa chỉ văn phòng, pháp lý, chính sách bảo mật & thanh toán.
3. **Sản Phẩm:** Danh sách sản phẩm/dịch vụ, thông số kỹ thuật, bảng giá, chương trình khuyến mãi tháng.
4. **Workflow:** Quy trình giao nhận hàng, chính sách đổi trả, quy trình bảo hành từng bước.
5. **Quy Ước:** Câu mẫu chuẩn thương hiệu, từ khóa cấm kỵ (những điều AI tuyệt đối không được hứa hẹn với khách).

### 2.2. Cách thêm tài liệu:
- **Cách 1: Tải file có sẵn (`.pdf`, `.docx`, `.txt`, `.md`, `.json`):**
  1. Chọn đúng tab danh mục muốn tải lên (ví dụ: *Sản Phẩm* hoặc *Công Ty*).
  2. Bấm nút **"Up tài liệu"** ở góc trên bên phải.
  3. Chọn file từ máy tính. Hệ thống sẽ trích xuất thông tin, hiển thị modal xác nhận.
  4. Bấm **"Lưu vào kho tri thức"**. Màn hình sẽ tự động hiển thị tài liệu mới trong danh mục vừa chọn.
- **Cách 2: Soạn thảo bài viết trực tiếp:**
  1. Bấm nút **"Thêm bài viết"**.
  2. Nhập Tiêu đề và Nội dung chi tiết (hỗ trợ định dạng gạch đầu dòng, bảng biểu, Markdown).
  3. Bấm **"Lưu vào kho tri thức"**.

---

## 3. ĐỘI NGŨ SUBAGENT AI CHUYÊN TRÁCH

> **Đường dẫn:** `/subagents`

Hệ thống bao gồm 4 Subagent chuyên môn hóa cao:

| Subagent | Chuyên môn chính | Kịch bản mặc định |
| :--- | :--- | :--- |
| **Lễ tân AI** | Chào hỏi, sàng lọc khách, lấy thông tin ban đầu | Tiếp đón lịch sự trong 3 giây, xin tên/SĐT/nhu cầu rồi chuyển tiếp sang Subagent tương ứng. |
| **Bán hàng AI** | Tư vấn sâu sản phẩm, xử lý từ chối, báo giá | Tra cứu bảng giá trong kho RAG, gợi ý gói dịch vụ phù hợp, gửi link thanh toán/chốt đơn. |
| **CSKH AI** | Giải đáp thắc mắc, hướng dẫn sử dụng, xử lý khiếu nại | Đồng cảm, giải thích chính sách đổi trả/bảo hành, xoa dịu khách hàng khó tính. |
| **Đặt lịch hẹn AI**| Check lịch trống, gửi link đặt lịch, gửi tin nhắc hẹn | Đối soát lịch của chuyên viên, gửi xác nhận qua tin nhắn, tự động gửi nhắc hẹn trước 2 giờ. |

### Các thao tác cấu hình:
- **Bật / Tắt hoạt động:** Dùng công tắc gạt trực tiếp trên từng thẻ Subagent.
- **Tùy chỉnh Prompt chỉ dẫn:** Bấm vào thẻ để chỉnh sửa vai trò, phong cách giọng nói (Tone of Voice) và hướng dẫn chi tiết theo thực tế doanh nghiệp bạn.

---

## 4. QUẢN LÝ KỸ NĂNG (SKILL) & NHIỆM VỤ TỰ ĐỘNG (TASKS)

> **Đường dẫn:** `/skills` và `/tasks`

### 4.1. Kỹ năng (Skill - Chuẩn 9BizClaw):
- Mỗi Subagent sở hữu các kỹ năng đặc thù như: *Chăm sóc Zalo OA, Chốt sale thần tốc, Thu thập Lead, Nhận diện ý định khách hàng, Đặt lịch Google Calendar...*
- **Xem chi tiết hoạt động:** Bấm trực tiếp vào từng thẻ Kỹ năng để mở popup phân tích:
  - Mục đích kỹ năng.
  - Các bước thực thi tự động.
  - Kịch bản tin nhắn mẫu mà AI sẽ dùng.

### 4.2. Nhiệm vụ tự động (Tasks / Cron Job):
- Lập lịch cho Subagent tự động làm việc mà không cần nhân sự trực:
  - *Gửi tin nhắn chúc mừng sinh nhật khách hàng lúc 08:30 sáng.*
  - *Tự động quét và nhắn tin nhắc khách còn lịch hẹn hôm nay.*
  - *Tổng hợp báo cáo doanh số & số lượng lead vào lúc 21:00 mỗi ngày.*

---

## 5. HỘP THƯ HỘI THOẠI ĐA KÊNH (MULTI-CHANNEL INBOX)

> **Đường dẫn:** `/inbox`

- **Tập trung tất cả tin nhắn:** Tin từ Fanpage, Zalo OA, Telegram đổ về một màn hình duy nhất.
- **Cơ chế Human-in-the-loop (Người can thiệp):**
  - Mặc định Subagent sẽ tự động trả lời khách ngay lập tức.
  - Khi nhân viên tư vấn muốn tự tay trả lời, chỉ cần gõ nội dung vào ô chat; Subagent sẽ tự động nhường quyền để không làm gián đoạn cuộc hội thoại.

---

## 6. QUY TRÌNH BÁN HÀNG (SALES PIPELINE KANBAN)

> **Đường dẫn:** `/pipeline`

Theo dõi hành trình của từng khách hàng qua 5 giai đoạn:
1. **Khách hàng mới (Lead):** Vừa nhắn tin vào Fanpage/Zalo.
2. **Tiềm năng (Qualified):** Đã cung cấp SĐT và nhu cầu cụ thể.
3. **Đang tư vấn / Demo:** Đã nhận báo giá, đang xem xét.
4. **Chốt đơn thành công (Won):** Đã chuyển khoản hoặc xác nhận mua.
5. **Tạm dừng / Thất bại (Lost):** Chưa có nhu cầu lúc này, chuyển vào danh sách nuôi dưỡng (nurturing).

*Thao tác:* Kéo và thả thẻ khách hàng giữa các cột để cập nhật trạng thái ngay lập tức.

---

## 7. KẾT NỐI ĐA KÊNH (CHANNELS INTEGRATION)

> **Đường dẫn:** `/channels`

Hỗ trợ kết nối các kênh phổ biến tại Việt Nam:
1. **Zalo Official Account (OA):** Nhận & trả lời tin nhắn từ trang Zalo Doanh nghiệp.
2. **Facebook Fanpage / Messenger:** Kết nối Page để AI tự động nhắn tin khi có khách inbox.
3. **Telegram Bot:** Thiết lập bot Telegram nội bộ hoặc CSKH nhanh chóng.
4. **Instagram Direct & TikTok:** Tích hợp quản lý hội thoại bán hàng.

---

## 8. CÀI ĐẶT HỆ THỐNG & CHẾ ĐỘ GIAO DIỆN

> **Đường dẫn:** `/settings`

- **Chuyển đổi Giao diện:** Bấm vào nút biểu tượng **Sáng / Tối** ở thanh điều hướng bên trái để đổi giữa chế độ nền tối Neon sang giao diện sáng chuyên nghiệp.
- **Cấu hình API Key AI:** Nhập Gemini API Key hoặc OpenAI / Claude API Key để hệ thống vận hành với tốc độ cao nhất và chi phí tiết kiệm tối đa.
