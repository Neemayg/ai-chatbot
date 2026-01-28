import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: Date;
  pinned?: boolean;
}

interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
  sidebarOpen: boolean;
  isLoading: boolean;

  // Actions
  setSidebarOpen: (open: boolean) => void;
  setCurrentChat: (chatId: string) => void;
  addMessage: (chatId: string, message: Message) => void;
  createChat: () => string; // returns new chat ID
  deleteChat: (chatId: string) => void;
  renameChat: (chatId: string, title: string) => void;
  togglePinChat: (chatId: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  currentChatId: null,
  sidebarOpen: true,
  isLoading: false,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  setCurrentChat: (chatId) => set({ currentChatId: chatId }),

  addMessage: (chatId, message) => set((state) => ({
    chats: state.chats.map((chat) =>
      chat.id === chatId
        ? { ...chat, messages: [...chat.messages, message], updatedAt: new Date() }
        : chat
    )
  })),

  createChat: () => {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      updatedAt: new Date(),
    };
    set((state) => ({
      chats: [newChat, ...state.chats],
      currentChatId: newChat.id
    }));
    return newChat.id;
  },

  deleteChat: (chatId) => set((state) => ({
    chats: state.chats.filter((c) => c.id !== chatId),
    currentChatId: state.currentChatId === chatId ? null : state.currentChatId
  })),

  renameChat: (chatId, title) => set((state) => ({
    chats: state.chats.map((c) => c.id === chatId ? { ...c, title } : c)
  })),

  togglePinChat: (chatId) => set((state) => ({
    chats: state.chats.map((c) => c.id === chatId ? { ...c, pinned: !c.pinned } : c)
  })),

  setLoading: (loading) => set({ isLoading: loading }),
}));
