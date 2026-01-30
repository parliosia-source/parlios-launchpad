// Chat history localStorage key
export const CHAT_HISTORY_KEY = "parlios_chat_history";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export const chatStorage = {
  getHistory: (): ChatMessage[] => {
    const data = localStorage.getItem(CHAT_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveHistory: (messages: ChatMessage[]): void => {
    // Keep only last 50 messages to avoid localStorage limits
    const trimmed = messages.slice(-50);
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(trimmed));
  },

  clearHistory: (): void => {
    localStorage.removeItem(CHAT_HISTORY_KEY);
  },
};
