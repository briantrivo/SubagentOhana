import { 
  Subagent, 
  Customer, 
  Conversation, 
  KnowledgeItem, 
  Reminder, 
  ChannelStatus, 
  Message,
  SubagentId,
  AgentSkill,
  ScheduledTask
} from '@/types/crm';
import { 
  INITIAL_SUBAGENTS, 
  INITIAL_CUSTOMERS, 
  INITIAL_CONVERSATIONS, 
  INITIAL_CHANNELS, 
  INITIAL_KNOWLEDGE,
  INITIAL_SKILLS,
  INITIAL_TASKS
} from './initial-data';

// Persistent in-memory store for server runtime
class CRMStore {
  private static instance: CRMStore;
  public subagents: Subagent[] = [...INITIAL_SUBAGENTS];
  public customers: Customer[] = [...INITIAL_CUSTOMERS];
  public conversations: Conversation[] = [...INITIAL_CONVERSATIONS];
  public channels: ChannelStatus[] = [...INITIAL_CHANNELS];
  public knowledge: KnowledgeItem[] = [...INITIAL_KNOWLEDGE];
  public skills: AgentSkill[] = [...INITIAL_SKILLS];
  public tasks: ScheduledTask[] = [...INITIAL_TASKS];
  public reminders: Reminder[] = [];
  public settings = {
    claudeApiKey: '',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    openaiApiKey: '',
    globalAiActive: true,
    defaultModel: 'gemini-3.8-flash'
  };
  public tokenStats = {
    monthToken: 0,
    monthCalls: 0,
    todayToken: 0,
    todayCalls: 0,
    thirtyDaysToken: 0,
    thirtyDaysCalls: 0
  };

  private constructor() {}

  public static getInstance(): CRMStore {
    if (!CRMStore.instance) {
      CRMStore.instance = new CRMStore();
    }
    return CRMStore.instance;
  }

  public getConversation(id: string): Conversation | undefined {
    return this.conversations.find(c => c.id === id);
  }

  public getCustomer(id: string): Customer | undefined {
    return this.customers.find(c => c.id === id);
  }

  public addMessage(conversationId: string, message: Omit<Message, 'id'>): Message {
    const conv = this.getConversation(conversationId);
    const newMsg: Message = {
      ...message,
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7)
    };

    if (conv) {
      conv.messages.push(newMsg);
      conv.lastMessageSnippet = newMsg.text;
      conv.lastMessageTime = 'Vừa xong';
      if (newMsg.sender === 'customer') {
        conv.unreadCount += 1;
      }
    }
    return newMsg;
  }

  public updateConversation(id: string, updates: Partial<Conversation>): Conversation | null {
    const conv = this.getConversation(id);
    if (!conv) return null;
    Object.assign(conv, updates);
    return conv;
  }

  public updateCustomer(id: string, updates: Partial<Customer>): Customer | null {
    const cust = this.getCustomer(id);
    if (!cust) return null;
    Object.assign(cust, updates);
    return cust;
  }

  public updateSubagent(id: SubagentId, updates: Partial<Subagent>): Subagent | null {
    const agent = this.subagents.find(a => a.id === id);
    if (!agent) return null;
    Object.assign(agent, updates);
    return agent;
  }

  public addReminder(reminder: Omit<Reminder, 'id' | 'isDone'>): Reminder {
    const newRem: Reminder = {
      ...reminder,
      id: 'rem-' + Date.now(),
      isDone: false
    };
    this.reminders.push(newRem);
    return newRem;
  }

  public addKnowledge(item: Omit<KnowledgeItem, 'id' | 'updatedAt'>): KnowledgeItem {
    const newItem: KnowledgeItem = {
      ...item,
      id: 'k-' + Date.now(),
      updatedAt: new Date().toLocaleDateString('vi-VN')
    };
    this.knowledge.unshift(newItem);
    return newItem;
  }

  public deleteKnowledge(id: string): boolean {
    const initialLen = this.knowledge.length;
    this.knowledge = this.knowledge.filter(k => k.id !== id);
    return this.knowledge.length < initialLen;
  }

  public toggleSkill(id: string): AgentSkill | null {
    const skill = this.skills.find(s => s.id === id);
    if (!skill) return null;
    if (skill.isLocked) return skill; // Cannot toggle locked skills
    skill.isEnabled = !skill.isEnabled;
    return skill;
  }

  public addSkill(skill: Omit<AgentSkill, 'id'>): AgentSkill {
    const newSkill: AgentSkill = {
      ...skill,
      id: 'skill-' + Date.now()
    };
    this.skills.unshift(newSkill);
    return newSkill;
  }

  public deleteSkill(id: string): boolean {
    const initialLen = this.skills.length;
    this.skills = this.skills.filter(s => s.id !== id || s.isLocked);
    return this.skills.length < initialLen;
  }

  public toggleTask(id: string): ScheduledTask | null {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return null;
    task.isEnabled = !task.isEnabled;
    return task;
  }

  public addTask(task: Omit<ScheduledTask, 'id'>): ScheduledTask {
    const newTask: ScheduledTask = {
      ...task,
      id: 'task-' + Date.now()
    };
    this.tasks.unshift(newTask);
    return newTask;
  }

  public deleteTask(id: string): boolean {
    const initialLen = this.tasks.length;
    this.tasks = this.tasks.filter(t => t.id !== id);
    return this.tasks.length < initialLen;
  }

  public recordTokenUsage(tokens: number) {
    this.tokenStats.todayToken += tokens;
    this.tokenStats.todayCalls += 1;
    this.tokenStats.monthToken += tokens;
    this.tokenStats.monthCalls += 1;
    this.tokenStats.thirtyDaysToken += tokens;
    this.tokenStats.thirtyDaysCalls += 1;
  }
}

export const crmStore = CRMStore.getInstance();
