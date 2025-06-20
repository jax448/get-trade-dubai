// store/ShareModal.ts
import { create } from "zustand";

interface ShareData {
  text: string;
  title?: string;
  url?: string;
  description?: string;
  image?: string;
}

interface ShareModalState {
  isShareModalOpen: boolean;
  shareData: ShareData;
  toggleShareModal: () => void;
  setShareData: (data: ShareData) => void;
}

export const useShareModal = create<ShareModalState>((set) => ({
  isShareModalOpen: false,
  shareData: {
    text: "",
    title: "Check out my Token on GetTrade.",
    url: typeof window !== "undefined" ? window.location.href : "",
    description: "Explore my assets and transactions on GetTrade.",
    image: "",
  },
  toggleShareModal: () =>
    set((state) => ({ isShareModalOpen: !state.isShareModalOpen })),
  setShareData: (data: ShareData) => set({ shareData: data }),
}));
