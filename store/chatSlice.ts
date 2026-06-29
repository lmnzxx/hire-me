import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Role = 'user' | 'assistant' | 'system' | 'data';

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt?: Date;
}

export interface ChatState {
  messages: ChatMessage[];
  wizardStep: number;
}

const initialState: ChatState = {
  messages: [],
  wizardStep: 1, // 1: Chatting, 2: Review/Download
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
    },
    setMessages(state, action: PayloadAction<ChatMessage[]>) {
      state.messages = action.payload;
    },
    setWizardStep(state, action: PayloadAction<number>) {
      state.wizardStep = action.payload;
    },
    clearChat(state) {
      state.messages = [];
      state.wizardStep = 1;
    }
  },
});

export const { addMessage, setMessages, setWizardStep, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
