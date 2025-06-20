import { TrendingTableStore } from "@/store/TrendingTableStore";
import { useMemo } from "react";

const useTrendingFilterString = () => {
  const filteringStringObject = TrendingTableStore(
    (s) => s.filteringStringObject
  );

  return useMemo(() => {
    // Backend key mapping
    const backendKeyMapping = {
      dateTime: {
        min: "Min_Time",
        max: "Max_Time",
      },
      liquidity: {
        min: "Min_Liquidity",
        max: "Max_Liquidity",
      },
      marketCap: {
        min: "Min_MarketCap",
        max: "Max_MarketCap",
      },
      // Volume related keys
      vol1m: {
        min: "Min_Volume",
        max: "Max_Volume",
      },
      vol5m: {
        min: "Min_Volume",
        max: "Max_Volume",
      },
      vol1h: {
        min: "Min_Volume",
        max: "Max_Volume",
      },
      vol6h: {
        min: "Min_Volume",
        max: "Max_Volume",
      },
      vol24h: {
        min: "Min_Volume",
        max: "Max_Volume",
      },
      // Transaction related keys - Not included in backend keys list but mapped anyway
      // You may need to adjust these based on your backend's requirements
      transactions1m: {
        min: "Min_Transactions",
        max: "Max_Transactions",
      },
      transactions5m: {
        min: "Min_Transactions",
        max: "Max_Transactions",
      },
      transactions1h: {
        min: "Min_Transactions",
        max: "Max_Transactions",
      },
      transactions6h: {
        min: "Min_Transactions",
        max: "Max_Transactions",
      },
      transactions24h: {
        min: "Min_Transactions",
        max: "Max_Transactions",
      },
      holders: {
        min: "Min_Holders",
        max: "Max_Holders",
      },
      price: {
        min: "Min_Price",
        max: "Max_Price",
      },
    };

    // Use objects to track values by backend key to avoid duplicates
    const filterValues: Record<string, string> = {};

    // Map frontend filter keys to backend keys
    Object.entries(filteringStringObject).forEach(([filterKey, values]) => {
      // Skip if filter has no values set
      if (values.min === null && values.max === null) return;

      // Check if there's a mapping for this filter key
      if (filterKey in backendKeyMapping) {
        // If min exists, map it to the proper backend key
        if (values.min !== null) {
          const backendKey =
            backendKeyMapping[filterKey as keyof typeof backendKeyMapping].min;
          filterValues[backendKey] = values.min;
        }

        // If max exists, map it to the proper backend key
        if (values.max !== null) {
          const backendKey =
            backendKeyMapping[filterKey as keyof typeof backendKeyMapping].max;
          filterValues[backendKey] = values.max;
        }
      }
    });

    // Convert the values object to a query string
    const filterParts = Object.entries(filterValues).map(
      ([key, value]) => `${key}=${value}`
    );

    return filterParts.join("&");
  }, [filteringStringObject]);
};

// Usage in component:
export default useTrendingFilterString;
