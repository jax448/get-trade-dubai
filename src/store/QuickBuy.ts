import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define state interface
interface QuickBuyState {
  isQuickBuyEnabled: boolean;
  quickBuyAmount: number | null;
  setQuickBuyState: (amount: number | null) => void;
  removeQuickBuyState: () => void;
  toggleQuickBuy: () => void;
}

// Create Zustand store
export const useQuickBuyStore = create<QuickBuyState>()(
  persist(
    (set) => ({
      isQuickBuyEnabled: false,
      quickBuyAmount: null,

      setQuickBuyState: (amount) => {
        set(() => {
          // Handle null case
          if (amount === null) {
            return { quickBuyAmount: null, isQuickBuyEnabled: false };
          }

          const numAmount =
            typeof amount === "string" ? parseFloat(amount) : amount;

          if (!isNaN(numAmount)) {
            return { quickBuyAmount: numAmount, isQuickBuyEnabled: true };
          }

          // Fall back to null case for any other invalid inputs
          return { quickBuyAmount: null, isQuickBuyEnabled: false };
        });
      },
      removeQuickBuyState: () => {
        set({ isQuickBuyEnabled: false, quickBuyAmount: null });
      },

      toggleQuickBuy: () => {
        set((state) => ({
          isQuickBuyEnabled: !state.isQuickBuyEnabled,
        }));
      },
    }),
    {
      name: "get-trade-QuickBuy",
    }
  )
);
