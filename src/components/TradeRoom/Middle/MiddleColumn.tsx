import React from "react";
import MiddleBottonTabs from "./MiddleBottonTabs";
// import TradingViewWidget from "./TradingViewWidget";
import MiddleHeader from "./MiddleHeader";
import dynamic from "next/dynamic";

const BirdEyeChartWidget = dynamic(() => import("./BirdEyeChartWidget"), {
  ssr: false,
});

function MiddleColumn({ tokenAddress }: { tokenAddress: string }) {
  return (
    <div className=" xl:order-2 order-1 flex-1 xl:overflow-y-auto xl:h-[calc(100vh-85px)] 2xl:max-w-[1170px] lg:min-w-[520px] max-w-full  w-full flex flex-col">
      {/* middle header */}
      <MiddleHeader tokenAddress={tokenAddress} />
      {/* Chart details */}

      <div className="h-[50vh]  ">
        <div className="h-full w-full relative overflow-hidden ">
          <BirdEyeChartWidget tokenAddress={tokenAddress} />
        </div>
      </div>

      {/* bottoms tabs */}
      <div className=" ">
        <MiddleBottonTabs tokenAddress={tokenAddress} />
      </div>
    </div>
  );
}

export default MiddleColumn;
