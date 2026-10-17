import skillsGuideJson from './skills-guide-data.json';
import { AgentSkill } from '@/types/crm';

export interface SkillGuide {
  purpose?: string;
  icon?: string;
  title?: string;
  blurb?: string;
  can: string[];
  ask: string[];
  limits: string[];
  command?: string;
}

const RAW_GUIDES: Record<string, SkillGuide> = skillsGuideJson as Record<string, SkillGuide>;

// Name mapping to 9BizClaw guide keys
const NAME_TO_KEY: Record<string, string> = {
  'chăm sóc khách zalo': 'zalo-customer-care',
  'việc tự động nhiều bước': 'workflow-orchestration',
  'thiết kế quy trình làm việc': 'workflow-design',
  'thao tác trên trình duyệt': 'web-task-automation',
  'dạy trợ lý zalo': 'teach-zalo-agent',
  'việc hằng ngày ở cửa hàng': 'store-operations-checklist',
  'kịch bản bán hàng': 'sales-scripts',
  'soạn báo giá': 'sales-quotation',
  'tuyển dụng nhanh': 'quick-hiring',
  'viết nội dung bán hàng': 'social-content-helper',
  'kế hoạch đăng facebook': 'facebook-publisher',
  'đăng bài fanpage': 'facebook-page',
  'nghiên cứu thị trường': 'market-research',
  'quảng cáo facebook': 'meta-ads',
  'quảng cáo tiktok': 'tiktok-ads',
  'quảng cáo google': 'google-ads',
  'tổng quan quảng cáo': 'ads-overview',
  'quản lý gmail': 'gmail',
  'quản lý outlook': 'outlook',
  'google drive': 'google-drive',
  'lịch google': 'google-calendar',
  'tạo tài liệu word, excel, pdf': 'document-artifacts',
  'kết nối ứng dụng': 'connect-composio-apps',
  'dùng ứng dụng đã kết nối': 'use-connected-apps',
  'xu hướng github': 'github-trending',
  'đọc file trên máy': 'local-files',
  'gửi tin zalo': 'zalo-operator',
  'báo cáo cuối ngày': 'evening-briefing',
  'bộ hồ sơ doanh nghiệp': 'business-profile-intake'
};

// Built-in fallback guides for system skills not in 9bizclaw standard catalog
const CUSTOM_FALLBACKS: Record<string, SkillGuide> = {
  'đối soát sao kê ngân hàng': {
    title: 'Đối soát sao kê ngân hàng',
    blurb: 'Tự động đọc ảnh chụp chuyển khoản, đối chiếu sao kê và kích hoạt tài khoản.',
    can: [
      'Đọc thông tin biên lai chuyển khoản khách gửi: số tiền, mã giao dịch, ngân hàng thụ hưởng.',
      'Đối chiếu mã giao dịch với danh sách sao kê ngân hàng trong hệ thống CRM.',
      'Tự động cập nhật trạng thái đơn hàng sang Đã thanh toán và kích hoạt tài khoản cho khách.'
    ],
    ask: [
      'Kiểm tra giúp mình khách Nguyễn Thị Lan đã chuyển khoản 499k chưa',
      'Đọc mã giao dịch trong ảnh chuyển khoản khách vừa gửi',
      'Đối soát các giao dịch chuyển khoản phát sinh hôm nay'
    ],
    limits: [
      'Nếu ảnh chụp mờ, thiếu mã hoặc tiền không khớp, trợ lý sẽ chuyển cho bạn kiểm tra thủ công.',
      'Trợ lý không có quyền can thiệp hay chuyển tiền khỏi tài khoản ngân hàng của bạn.'
    ],
    command: 'bank_reconciliation'
  },
  'chăm sóc sau bán & nhắc hẹn': {
    title: 'Chăm sóc sau bán & Nhắc hẹn',
    blurb: 'Lên lịch nhắn tin chăm sóc lại sau 3 ngày, nhắc gia hạn trước 7 ngày.',
    can: [
      'Tự động lên lịch nhắn tin hỏi thăm khách sau khi mua 3 ngày để nhận phản hồi.',
      'Gửi thông báo nhắc lịch hẹn dịch vụ hoặc nhắc gia hạn gói trước ngày hết hạn.',
      'Phát hiện dấu hiệu khách không hài lòng sau bán để can thiệp kịp thời.'
    ],
    ask: [
      'Xem danh sách khách hàng cần chăm sóc sau bán tuần này',
      'Lên lịch nhắc gia hạn cho khách hết hạn trong 7 ngày tới',
      'Soạn tin nhắn hỏi thăm trải nghiệm khách hàng sau khi dùng sản phẩm'
    ],
    limits: [
      'Mỗi tin nhắn nhắc hẹn hoặc chăm sóc đều tuân thủ khung giờ hành chính (8h30 - 20h00).',
      'Không tự động gửi dồn dập quá 2 tin nhắn khi khách chưa phản hồi.'
    ],
    command: 'aftersales_followup'
  },
  'phát hiện khiếu nại & handoff': {
    title: 'Phát hiện khiếu nại & Handoff',
    blurb: 'Tự nhận diện từ ngữ giận dữ, khiếu nại và chuyển giao gấp cho nhân viên thật.',
    can: [
      'Phân tích sắc thái ngôn từ (sentiment analysis) trong từng tin nhắn của khách.',
      'Tự động nhận diện từ khóa nhạy cảm: khiếu nại, lừa đảo, báo công an, đòi tiền, chửi bới.',
      'Lập tức tắt chế độ AI tự trả lời, đẩy thông báo đỏ "Cần can thiệp gấp" lên thanh CRM và bàn giao cho người phụ trách.'
    ],
    ask: [
      'Mô phỏng tin nhắn khiếu nại để kiểm tra tính năng bàn giao',
      'Xem lại các cuộc hội thoại vừa được kích hoạt handoff trong ngày',
      'Cấu hình danh sách từ khóa nhạy cảm cần chuyển giao gấp'
    ],
    limits: [
      'Tính năng này luôn được kích hoạt mặc định ở mức hệ thống để bảo vệ khách và thương hiệu.',
      'Khi đã handoff, AI sẽ dừng trả lời tự động cho đến khi nhân viên chủ động bật lại.'
    ],
    command: 'handoff_detector'
  },
  'tra cứu rag tài liệu doanh nghiệp': {
    title: 'Tra cứu RAG tài liệu doanh nghiệp',
    blurb: 'Truy xuất tức thì chính sách, bảng giá, quy ước từ kho kiến thức để trả lời khách.',
    can: [
      'Truy vấn ngữ nghĩa vector hóa trên toàn bộ tài liệu doanh nghiệp đã tải lên kho Kiến thức.',
      'Trích xuất chính xác điều khoản đổi trả, phí vận chuyển, bảng giá niêm yết.',
      'Đối chiếu câu hỏi khách với Quy ước cấm kỵ để đảm bảo AI không phát ngôn sai lệch.'
    ],
    ask: [
      'Chính sách đổi trả sản phẩm trong kho kiến thức đang quy định thế nào?',
      'Bảng giá gói dịch vụ doanh nghiệp hiện tại có những bậc nào?',
      'Trợ lý đang tham khảo những tài liệu nào để tư vấn cho khách?'
    ],
    limits: [
      'Chỉ trả lời dựa trên tài liệu có thật trong kho Tri thức, tuyệt đối không bịa đặt thông tin.',
      'Nếu tài liệu chưa có thông tin, trợ lý sẽ thông báo cần xin ý kiến quản lý.'
    ],
    command: 'rag_knowledge_search'
  },
  'phân loại khách & gán nhãn pipeline': {
    title: 'Phân loại khách & Gán nhãn Pipeline',
    blurb: 'Nhận diện nhu cầu, tự cập nhật giai đoạn từ Mới -> Tư vấn -> Chốt đơn.',
    can: [
      'Tự động phân tích nhu cầu và mức độ quan tâm của khách qua nội dung chat.',
      'Gán các nhãn đặc trưng: VIP, Khách mới, Chờ chuyển khoản, Đã mua, Khách sỉ.',
      'Tự động di chuyển thẻ khách hàng trên bảng Pipeline Kanban tương ứng với tiến trình hội thoại.'
    ],
    ask: [
      'Phân loại lại các khách hàng đang ở giai đoạn Tư vấn',
      'Tìm tất cả khách hàng có nhãn VIP trên kênh Zalo',
      'Gợi ý giai đoạn Pipeline phù hợp cho khách Nguyễn Thị Lan'
    ],
    limits: [
      'Việc xóa nhãn hoặc chuyển sang giai đoạn Hủy đơn cần có sự xác nhận của bạn.',
      'Dựa trên ngữ cảnh trò chuyện thực tế của khách hàng.'
    ],
    command: 'pipeline_auto_tagger'
  },
  'lưu trữ thông tin & trí nhớ dài hạn': {
    title: 'Lưu trữ thông tin & Trí nhớ dài hạn',
    blurb: 'Tự ghi nhớ tên, số điện thoại, sở thích và ghi chú riêng của khách vào CRM.',
    can: [
      'Trích xuất tự động thông tin định danh: Họ tên, Số điện thoại, Địa chỉ giao hàng, Email.',
      'Ghi nhận các sở thích riêng hoặc lưu ý đặc biệt (VD: thích giao buổi tối, dị ứng cồn...).',
      'Cập nhật trực tiếp vào Hồ sơ khách hàng ở Cột 3 để toàn bộ nhân viên cùng theo dõi.'
    ],
    ask: [
      'Khách này đã từng mua sản phẩm nào trước đây chưa?',
      'Xem các ghi nhớ đặc biệt về khách Nguyễn Thị Lan',
      'Thêm ghi chú: khách thích thanh toán qua Techcombank'
    ],
    limits: [
      'Chỉ lưu các thông tin khách tự nguyện cung cấp trong cuộc hội thoại.',
      'Tuyệt đối bảo mật và không chia sẻ dữ liệu giữa các khách hàng khác nhau.'
    ],
    command: 'memory_extractor'
  },
  'đồng bộ facebook messenger': {
    title: 'Đồng bộ Facebook Messenger',
    blurb: 'Kết nối Fanpage, nhận diện tin nhắn và tự động phân luồng cho Subagent xử lý.',
    can: [
      'Lắng nghe webhook tin nhắn real-time từ các Fanpage Facebook đã kết nối.',
      'Tự động nhận diện bài viết mà khách đang bình luận hoặc nhắn tin tới.',
      'Đẩy tin nhắn vào Hộp thư hợp nhất và phân luồng cho Subagent Lễ tân / Bán hàng.'
    ],
    ask: [
      'Kiểm tra kết nối Fanpage Facebook hiện tại',
      'Đồng bộ lại tin nhắn mới nhất trên Fanpage',
      'Xem các hội thoại đang mở từ kênh Facebook Messenger'
    ],
    limits: [
      'Tuân thủ chính sách 24 giờ phản hồi của Meta.',
      'Cần cấp quyền Fanpage hợp lệ trước khi bắt đầu nhận tin.'
    ],
    command: 'sync_facebook'
  },
  'đồng bộ zalo cá nhân & oa': {
    title: 'Đồng bộ Zalo Cá nhân & OA',
    blurb: 'Kết nối tài khoản Zalo cá nhân và Zalo OA, đồng bộ danh bạ và tin nhắn 2 chiều.',
    can: [
      'Kết nối phiên Zalo cá nhân qua QR code hoặc Zalo OA qua Access Token chính thức.',
      'Đồng bộ tin nhắn 2 chiều real-time với độ trễ dưới 1 giây.',
      'Hỗ trợ gửi nhận đầy đủ: văn bản, hình ảnh, tài liệu và vị trí.'
    ],
    ask: [
      'Kiểm tra trạng thái kết nối tài khoản Zalo cá nhân',
      'Quét lại mã QR để đăng nhập phiên Zalo mới',
      'Đồng bộ danh sách bạn bè và khách hàng từ Zalo OA'
    ],
    limits: [
      'Chỉ gửi tin cho những người đã phát sinh hội thoại hoặc trong danh bạ cho phép.',
      'Không thực hiện hành vi spam gửi tin hàng loạt làm khóa tài khoản Zalo.'
    ],
    command: 'sync_zalo'
  }
};

export function getSkillGuide(skill: AgentSkill): SkillGuide {
  // If skill already has a guide attached
  if (skill.guide) return skill.guide;

  const normalized = skill.name.toLowerCase().trim();

  // Try direct key mapping
  const mappedKey = NAME_TO_KEY[normalized];
  if (mappedKey && RAW_GUIDES[mappedKey]) {
    const g = RAW_GUIDES[mappedKey];
    return {
      ...g,
      title: skill.name,
      command: mappedKey.replace(/-/g, '_')
    };
  }

  // Try custom fallback
  if (CUSTOM_FALLBACKS[normalized]) {
    return CUSTOM_FALLBACKS[normalized];
  }

  // Check if any key contains part of the name
  for (const [key, val] of Object.entries(RAW_GUIDES)) {
    if (normalized.includes(val.title?.toLowerCase() || '') || key.includes(normalized)) {
      return {
        ...val,
        title: skill.name,
        command: key.replace(/-/g, '_')
      };
    }
  }

  // Default dynamic guide
  return {
    title: skill.name,
    blurb: skill.description || 'Kỹ năng trợ lý tác tử trong hệ thống ASTRONIXA • OHANA CRM.',
    can: [
      `Tự động kích hoạt khi phát hiện nhu cầu phù hợp với nghiệp vụ "${skill.name}".`,
      'Tra cứu tài liệu và dữ liệu khách hàng trong hệ thống trước khi thực hiện.',
      'Báo cáo kết quả rõ ràng và đề xuất bước tiếp theo cho chủ shop.'
    ],
    ask: [
      `Nhờ trợ lý thực hiện công việc theo kỹ năng "${skill.name}"`,
      `Trợ lý đang áp dụng kỹ năng "${skill.name}" cho những trường hợp nào?`,
      `Tư vấn cho mình cách dùng kỹ năng "${skill.name}" hiệu quả nhất`
    ],
    limits: [
      'Chỉ thao tác trong phạm vi quyền hạn và tài liệu bạn cung cấp.',
      'Các hành động gửi tin hay thanh toán luôn cần bạn xem trước và xác nhận.'
    ],
    command: skill.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '_')
  };
}
