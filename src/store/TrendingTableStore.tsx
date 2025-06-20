import { TrendingTimeInteval } from "@/trade-functions/types";
import { create } from "zustand";
// import { persist } from "zustand/middleware";

// Define state interface

type filterType =
  // | "token"
  | "dateTime"
  | "liquidity"
  | "marketCap"
  | "vol1m"
  | "vol5m"
  | "vol1h"
  | "vol6h"
  | "vol24h"
  | "transactions1m"
  | "transactions5m"
  | "transactions1h"
  | "transactions6h"
  | "transactions24h"
  | "holders"
  | "price";

type titleType = "New Pairs" | "Trending";

interface TrendingTableStoreType {
  title: titleType;
  setTitle: (title: titleType) => void;

  //trending table time interval
  timeIntervale: TrendingTimeInteval;
  setTimeIntervale: (timeIntervale: TrendingTimeInteval) => void;

  // trending token filters
  selectedFilter: string;
  setSelectedFilter: (selectedFilter: string) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  // new store values for creating string
  filteringStringObject: {
    [K in filterType]: {
      min: string | null;
      max: string | null;
    };
  };
  setFilteringStringObject: (
    filterType: filterType,
    min: string | number | null,
    max: string | number | null
  ) => void;
  resetFilter: (filterType: filterType) => void;
  resetAllFilters: () => void;
}

// Create Zustand store
export const TrendingTableStore = create<TrendingTableStoreType>()((set) => ({
  title: "Trending",
  setTitle: (title) => set({ title }),

  //trending table time interval
  timeIntervale: "1 Minute Ago",
  setTimeIntervale: (timeIntervale) => set({ timeIntervale }),
  //for new pairs table filter logic

  isModalOpen: false,
  setIsModalOpen: (isModalOpen) => set({ isModalOpen }),
  selectedFilter: "",
  setSelectedFilter: (selectedFilter) => set({ selectedFilter }),

  // new store values for creating string
  filteringStringObject: {
    dateTime: { min: null, max: null },
    liquidity: { min: null, max: null },
    marketCap: { min: null, max: null },
    vol1m: { min: null, max: null },
    vol5m: { min: null, max: null },
    vol1h: { min: null, max: null },
    vol6h: { min: null, max: null },
    vol24h: { min: null, max: null },
    transactions1m: { min: null, max: null },
    transactions5m: { min: null, max: null },
    transactions1h: { min: null, max: null },
    transactions6h: { min: null, max: null },
    transactions24h: { min: null, max: null },
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
  // reset all filters
  resetAllFilters: () =>
    set(() => ({
      filteringStringObject: {
        dateTime: { min: null, max: null },
        liquidity: { min: null, max: null },
        marketCap: { min: null, max: null },
        vol1m: { min: null, max: null },
        vol5m: { min: null, max: null },
        vol1h: { min: null, max: null },
        vol6h: { min: null, max: null },
        vol24h: { min: null, max: null },
        transactions1m: { min: null, max: null },
        transactions5m: { min: null, max: null },
        transactions1h: { min: null, max: null },
        transactions6h: { min: null, max: null },
        transactions24h: { min: null, max: null },
        holders: { min: null, max: null },
        price: { min: null, max: null },
      },
    })),
}));
