import { create } from "zustand";
// import { persist } from "zustand/middleware";

type FilterType =
  // | "token"
  | "dateTime"
  | "liquidity"
  | "marketCap"
  | "vol30m"
  | "vol1h"
  | "vol2h"
  | "vol4h"
  | "vol8h"
  | "vol24h"
  | "holders"
  | "price";

interface DashBoardTableStoreType {
  // for filtering in the new pair table

  selectedFilter: string;
  setSelectedFilter: (selectedFilter: string) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  // new store values for creating string
  filteringStringObject: {
    [K in FilterType]: {
      min: string | null;
      max: string | null;
    };
  };
  setFilteringStringObject: (
    filterType: FilterType,
    min: string | number | null,
    max: string | number | null
  ) => void;
  resetFilter: (filterType: FilterType) => void;
  getFilterString: () => string;
}

// Create Zustand store
export const DashBoardTableStore = create<DashBoardTableStoreType>()(
  (set, get) => ({
    // for filtering in the dahbord table

    isModalOpen: false,
    setIsModalOpen: (isModalOpen) => set({ isModalOpen }),
    selectedFilter: "",
    setSelectedFilter: (selectedFilter) => set({ selectedFilter }),

    // new store values for creating string
    filteringStringObject: {
      dateTime: { min: null, max: null },
      liquidity: { min: null, max: null },
      marketCap: { min: null, max: null },
      vol30m: { min: null, max: null },
      vol1h: { min: null, max: null },
      vol2h: { min: null, max: null },
      vol4h: { min: null, max: null },
      vol8h: { min: null, max: null },
      vol24h: { min: null, max: null },
      holders: { min: null, max: null },
      price: { min: null, max: null },
    },

    setFilteringStringObject: (filterType, min, max) =>
      set((state) => ({
        filteringStringObject: {
          ...state.filteringStringObject,
          [filterType]: { min, max },
        },
      })),

    resetFilter: (filterType) =>
      set((state) => ({
        filteringStringObject: {
          ...state.filteringStringObject,
          [filterType]: { min: null, max: null },
        },
      })),

    // Generate filter string from the filteringStringObject
    getFilterString: () => {
      const state = get();
      const filterParts: string[] = [];

      Object.entries(state.filteringStringObject).forEach(
        ([filterKey, values]) => {
          if (values.min !== null) {
            filterParts.push(`${filterKey}_min=${values.min}`);
          }
          if (values.max !== null) {
            filterParts.push(`${filterKey}_max=${values.max}`);
          }
        }
      );

      return filterParts.join("&");
    },
  })
);
