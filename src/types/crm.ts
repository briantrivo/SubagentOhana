export type SubagentId = 
  | 'orchestrator' 
  | 'receptionist' 
  | 'sales' 
  | 'support' 
  | 'booking' 
  | 'followup';

export type ChannelType = 
  | 'facebook' 
  | 'zalo_personal' 
  | 'zalo_oa' 
  | 'telegram' 
  | 'instagram' 
  | 'webchat' 
  | 'tiktok';

export type PipelineStage = 
  | 'Mới' 
  | 'Tiếp cận' 
  | 'Tư vấn' 
  | 'Chốt đơn' 
  | 'Thành công' 
  | 'Thất bại';

export interface SubagentTool {
  id: string;
  name: string;
  description: string;
}

export interface Subagent {
  id: SubagentId;
  name: string;
  icon: string;
  role: string;
  description?: string;
  whenToUse: string;
  systemPrompt: string;
  customModel?: string;
  enabledTools: string[];
  isActive: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  channel: ChannelType;
  stage: PipelineStage;
  tags: string[];
  notes: string;
  aiMemories: string[];
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: 'customer' | 'subagent' | 'human' | 'system';
  subagentName?: string;
  subagentIcon?: string;
  text: string;
  timestamp: string;
  isHandoffAlert?: boolean;
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  channel: ChannelType;
  status: 'open' | 'closed' | 'pending';
  aiAutoReply: boolean;
  activeSubagentId: SubagentId;
  activeSubagentName: string;
  lastMessageSnippet: string;
  lastMessageTime: string;
  unreadCount: number;
  needsHuman: boolean;
  messages: Message[];
}

export type KnowledgeCategory = 'Cá Nhân' | 'Công Ty' | 'Sản Phẩm' | 'Workflow' | 'Quy Ước';

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: KnowledgeCategory | string;
  updatedAt: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
}

export type SkillCategory = 'Tự tạo' | 'Bán hàng' | 'Hệ thống';

export interface AgentSkill {
  id: string;
  name: string;
  description: string;
  category: SkillCategory | string;
  tag?: string;
  icon?: string;
  scenariosCount: number;
  referencesCount: number;
  isEnabled: boolean;
  isLocked?: boolean;
  lockedNote?: string;
  instructionPrompt?: string;
  command?: string;
  guide?: any;
}

export interface ScheduledTask {
  id: string;
  title: string;
  description: string;
  nextRun: string;
  schedule: string;
  lastRun: string;
  isEnabled: boolean;
  category?: string;
  actionPrompt?: string;
}

export interface Reminder {
  id: string;
  customerId: string;
  customerName: string;
  title: string;
  dueAt: string;
  isDone: boolean;
  note?: string;
}

export interface ChannelStatus {
  id: ChannelType;
  name: string;
  icon: string;
  description: string;
  isActive: boolean;
  statusText: string;
  conversationsCount: number;
  messages30dCount: number;
}
