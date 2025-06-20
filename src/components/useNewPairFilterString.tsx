import { DashBoardTableStore } from "@/store/NewPairTableStore";
import { useMemo } from "react";

const useNewPairsFilterString = () => {
  const filteringStringObject = DashBoardTableStore(
    (s) => s.filteringStringObject
  );

  return useMemo(() => {
    const filterParts: string[] = [];
    Object.entries(filteringStringObject).forEach(([filterKey, values]) => {
      if (values.min !== null)
        filterParts.push(`${filterKey}_min=${values.min}`);
      if (values.max !== null)
        filterParts.push(`${filterKey}_max=${values.max}`);
    });
    return filterParts.join("&");
  }, [filteringStringObject]);
};

// Usage in component:
export default useNewPairsFilterString;
