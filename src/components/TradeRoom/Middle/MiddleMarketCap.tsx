import { useTokenMarketCap } from "@/api-lib/api-hooks/useAccountsApiHook";
import React, { memo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber, formatSmallNumber } from "@/helpers/TImeLeftSlotHelpers";

function MiddleMarketCap({ tokenAddress }: { tokenAddress: string }) {
  const { data, isLoading, isError } = useTokenMarketCap(tokenAddress);

  if (isLoading) {
    return (
      <div className="flex flex-col items-end md:gap-2 gap-1">
        <Skeleton className="h-4 w-20 bg-gray-700" />
        <Skeleton className="h-5 w-24 bg-gray-700" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-end md:gap-2 gap-1">
        <h3 className="font-bold text-[clamp(8px,1.5vw,15px)] leading-[100%] tracking-[0%] text-right text-red-400">
          --.--%
        </h3>
        <h3 className="font-bold text-[clamp(9px,2vw,18px)] leading-[100%] tracking-[0%] text-right text-white">
          $-.--
        </h3>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end md:gap-2 gap-1">
      <h3
        className={`font-bold text-[clamp(8px,1.5vw,15px)] leading-[100%] tracking-[0%] text-right`}
      >
        {formatSmallNumber(data.data ? data.data.price : 0)}
      </h3>
      <h3 className="font-bold text-[clamp(9px,2vw,18px)] leading-[100%] tracking-[0%] text-right text-white">
        {formatNumber(data.data ? data.data.marketCap : 0)}
      </h3>
    </div>
  );
}

export default memo(MiddleMarketCap);
