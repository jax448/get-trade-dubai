import { useGetTokenMetrics } from "@/api-lib/api-hooks/useAccountsApiHook";
import { Separator } from "@/components/ui/separator";
import { formatCompactNumber } from "@/helpers/FormatCompactNumber";
import React from "react";

function SmallScreenTransactionDataCard({
  tokenAddress,
}: {
  tokenAddress: string;
}) {
  const { data: tokenMetrics } = useGetTokenMetrics(tokenAddress);

  return (
    <div className=" w-full    mt-[clamp(0.5rem,1vw,1rem)] rounded-[8px] ">
      <div className=" rounded-tl-[8px] rounded-tr-[8px] bg-[#232323] h-[clamp(2.5rem,5vw,4.6rem)] w-full p-[clamp(0.5rem,2vw,1rem)] font-bold text-[clamp(12px,2vw,16px)] leading-[100%] tracking-[0%] flex items-center font-gilroy  ">
        Transaction Data
      </div>
      <div className=" rounded-br-[8px] rounded-bl-[8px] bg-[#F1F2FF0D]  ">
        {/* first row */}
        <div className=" flex items-center justify-between w-full border-b border-b-[#FFFFFF14] ">
          <div className="w-full flex flex-col items-center justify-center gap-2 p-[clamp(0.5rem,0.3rem,1.8rem)] ">
            <h1 className=" text-[#FFFFFFB2] font-bold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              Top 10 Holders
            </h1>
            <h1 className=" text-white font-semibold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              {tokenMetrics?.top10HoldersPercent?.toLocaleString() ?? "N/A"}%
            </h1>
          </div>
          <Separator className=" h-[clamp(40px,7vw,65px)]  w-[1px] bg-[#FFFFFF14]  " />
          <div className="w-full flex flex-col items-center justify-center gap-2 p-[clamp(0.5rem,0.3rem,1.8rem)] ">
            <h1 className=" text-[#FFFFFFB2] font-bold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              Holders
            </h1>
            <h1 className=" text-white font-semibold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              {formatCompactNumber(tokenMetrics?.holders)}
            </h1>
          </div>
          <Separator className=" h-[clamp(40px,7vw,65px)]  w-[1px] bg-[#FFFFFF14]  " />
          <div className="w-full flex flex-col items-center justify-center gap-2 p-[clamp(0.5rem,0.3rem,1.8rem)] ">
            <h1 className=" text-[#FFFFFFB2] font-bold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              Watchers
            </h1>
            <h1 className=" text-white font-semibold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              {formatCompactNumber(tokenMetrics?.watchers)}
            </h1>
          </div>
        </div>
        {/* second row */}
        <div className=" flex items-center justify-between w-full  ">
          <div className="w-full flex flex-col items-center justify-center gap-2 p-[clamp(0.5rem,0.3rem,1.8rem)] ">
            <h1 className=" text-[#FFFFFFB2] font-bold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              CIR Supply
            </h1>
            <h1 className=" text-white font-semibold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              {formatCompactNumber(tokenMetrics?.cirSupply)}
            </h1>
          </div>
          <Separator className=" h-[clamp(40px,7vw,65px)]  w-[1px] bg-[#FFFFFF14]  " />
          <div className="w-full flex flex-col items-center justify-center gap-2 p-[clamp(0.5rem,0.3rem,1.8rem)] ">
            <h1 className=" text-[#FFFFFFB2] font-bold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              Total Supply
            </h1>
            <h1 className=" text-white font-semibold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              {formatCompactNumber(tokenMetrics?.totalSupply)}
            </h1>
          </div>
          <Separator className=" h-[clamp(40px,7vw,65px)]  w-[1px] bg-[#FFFFFF14]  " />
          <div className="w-full flex flex-col items-center justify-center gap-2 p-[clamp(0.5rem,0.3rem,1.8rem)] ">
            <h1 className=" text-[#FFFFFFB2] font-bold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              Markets
            </h1>
            <h1 className=" text-white font-semibold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              {formatCompactNumber(tokenMetrics?.markets)}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SmallScreenTransactionDataCard;
