import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define state interface
interface ShareModalState {
  isAlertModalOpen: boolean;
  toggleAlertModal: () => void;
  isWatchListModalOpen: boolean;
  toggleWatchListModal: () => void;
}
// Create Zustand store
export const useWatchListAndAlertStore = create<ShareModalState>()(
  persist(
    (set) => ({
      isAlertModalOpen: false,
      isWatchListModalOpen: false,
      toggleAlertModal() {
        set((state) => ({ isAlertModalOpen: !state.isAlertModalOpen }));
      },
      toggleWatchListModal() {
        set((state) => ({ isWatchListModalOpen: !state.isWatchListModalOpen }));
      },
    }),
    {
      name: "watchandalertmodal",
    }
  )
);
