// src/store/searchStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchStoreState {
  mywalletsearch: string;
  depositsearch: string;
  withdrawsearch: string;
  archievedsearch: string;
  setMyWalletSearch: (input: string) => void;
  setDepositSearch: (input: string) => void;
  setWithdrawSearch: (input: string) => void;
  setArchievedSearch: (input: string) => void;
  clearAllSearchInputs: () => void;
  clearMyWalletSearch: () => void;
  clearDepositSearch: () => void;
  clearWithdrawSearch: () => void;
  clearArchievedSearch: () => void;
}

const useSearchStore = create<SearchStoreState>()(
  persist(
    (set) => ({
      // Search input values for different tables
      mywalletsearch: "",
      depositsearch: "",
      withdrawsearch: "", // Fixed the name for consistency
      archievedsearch: "", // Fixed the name for consistency

      // Update search input for specific table
      setMyWalletSearch: (input: string) => {
        set({ mywalletsearch: input });
      },

      setDepositSearch: (input: string) => {
        set({ depositsearch: input });
      },

      setWithdrawSearch: (input: string) => {
        set({ withdrawsearch: input });
      },

      setArchievedSearch: (input: string) => {
        set({ archievedsearch: input });
      },

      // Clear all search inputs
      clearAllSearchInputs: () => {
        set({
          mywalletsearch: "",
          depositsearch: "",
          withdrawsearch: "",
          archievedsearch: "",
        });
      },

      // Clear specific search input
      clearMyWalletSearch: () => set({ mywalletsearch: "" }),
      clearDepositSearch: () => set({ depositsearch: "" }),
      clearWithdrawSearch: () => set({ withdrawsearch: "" }),
      clearArchievedSearch: () => set({ archievedsearch: "" }),
    }),
    {
      name: "walletSearch",
    }
  )
);

export default useSearchStore;
