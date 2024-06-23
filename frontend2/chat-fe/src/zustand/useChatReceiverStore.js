import { create } from "zustand";

export const useChatReceiverStore = create((set) => ({
    chatReceiver: "",
    updateChatReceiver: (receiver) => set({ chatReceiver: receiver }),
}));