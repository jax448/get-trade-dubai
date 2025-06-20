import React from "react";
import Image from "next/image";
// import Radium from "@public/pics/raydiumLogo.png";
// import pump from "@public/pics/pumpLogo.png";
// import { ChevronRightIcon } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import x from "@public/pics/XTwitterIcon.svg";
// import telegram from "@public/pics/telegramIcon.svg";
// import globe from "@public/pics/GlobIcon.svg";
// import shareExport from "@public/pics/ShareExportImage2.png";
import TokenBanner from "@public/pics/TokenBannerImage.png";
import { Separator } from "@/components/ui/separator";
import { useGetTokenMetrics } from "@/api-lib/api-hooks/useAccountsApiHook";
import { formatCompactNumber } from "@/helpers/FormatCompactNumber";

function SmallScreenTokenDetailsCard({
  tokenAddress,
}: {
  tokenAddress: string;
}) {
  const { data: tokenMetrics } = useGetTokenMetrics(tokenAddress);
  return (
    <div className="  h-full  w-full   ">
      <div className=" flex">
        <Image
          src={TokenBanner}
          alt=""
          height={91}
          className=" w-full h-[clamp(40px,75px,91px)]  "
        />
      </div>
      <div className="rounded-[8px]  ">
        {/* first row */}
        <div className=" flex items-center justify-between w-full border-b border-b-[#FFFFFF14] ">
          <div className="w-full flex flex-col items-center justify-center gap-2 p-[clamp(0.5rem,0.3rem,1.8rem)] ">
            <h1 className=" text-[#FFFFFFB2] font-bold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              Price USD
            </h1>
            <h1 className=" text-white font-semibold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              ${" "}
              {typeof tokenMetrics?.priceUSD === "number"
                ? tokenMetrics.priceUSD.toFixed(8)
                : "N/A"}
            </h1>
          </div>
          <Separator className=" h-[clamp(40px,7vw,65px)]  w-[1px] bg-[#FFFFFF14]  " />
          <div className="w-full flex flex-col items-center justify-center gap-2 p-[clamp(0.5rem,0.3rem,1.8rem)] ">
            <h1 className=" text-[#FFFFFFB2] font-bold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              Price
            </h1>
            <h1 className=" text-white font-semibold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              {tokenMetrics?.priceSol
                ? parseFloat(tokenMetrics.priceSol).toFixed(8)
                : "N/A"}{" "}
              SOL
            </h1>
          </div>
        </div>
        {/* second row */}
        <div className=" flex items-center justify-between w-full border-b border-b-[#FFFFFF14] ">
          <div className="w-full flex flex-col items-center justify-center gap-2 p-[clamp(0.5rem,0.3rem,1.8rem)] ">
            <h1 className=" text-[#FFFFFFB2] font-bold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              LIQUIDITY
            </h1>
            <h1 className=" text-white font-semibold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              ${formatCompactNumber(tokenMetrics?.liquidity)}
            </h1>
          </div>
          <Separator className=" h-[clamp(40px,7vw,65px)]  w-[1px] bg-[#FFFFFF14]  " />
          <div className="w-full flex flex-col items-center justify-center gap-2 p-[clamp(0.5rem,0.3rem,1.8rem)] ">
            <h1 className=" text-[#FFFFFFB2] font-bold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              Market Cap
            </h1>
            <h1 className=" text-white font-semibold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              ${formatCompactNumber(tokenMetrics?.marketCap)}
            </h1>
          </div>
          <Separator className=" h-[clamp(40px,7vw,65px)]  w-[1px] bg-[#FFFFFF14]  " />
          <div className="w-full flex flex-col items-center justify-center gap-2 p-[clamp(0.5rem,0.3rem,1.8rem)] ">
            <h1 className=" text-[#FFFFFFB2] font-bold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              FDV
            </h1>
            <h1 className=" text-white font-semibold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              ${formatCompactNumber(tokenMetrics?.fdv)}
            </h1>
          </div>
        </div>
        {/* thrid row */}
        <div className=" flex items-center justify-between w-full border-b border-b-[#FFFFFF14] ">
          <div className="w-full flex flex-col items-center justify-center gap-2 p-[clamp(0.5rem,0.3rem,1.8rem)] ">
            <h1 className=" text-[#FFFFFFB2] font-bold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              30M
            </h1>
            <h1
              className={`font-semibold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ${
                (tokenMetrics?.price30MinPercent ?? 0) < 0
                  ? "text-[#E1414A]"
                  : "text-[#00FFA3]"
              }`}
            >
              {tokenMetrics?.price30MinPercent?.toFixed(2) ?? "N/A"}%
            </h1>
          </div>
          <Separator className=" h-[clamp(40px,7vw,65px)]  w-[1px] bg-[#FFFFFF14]  " />
          <div className="w-full flex flex-col items-center justify-center gap-2 p-[clamp(0.5rem,0.3rem,1.8rem)] ">
            <h1 className=" text-[#FFFFFFB2] font-bold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              1H
            </h1>
            <h1
              className={`font-semibold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ${
                (tokenMetrics?.price1HourPercent ?? 0) < 0
                  ? "text-[#E1414A]"
                  : "text-[#00FFA3]"
              }`}
            >
              {tokenMetrics?.price1HourPercent?.toFixed(2) ?? "N/A"}%
            </h1>
          </div>
          <Separator className=" h-[clamp(40px,7vw,65px)]  w-[1px] bg-[#FFFFFF14]  " />
          <div className="w-full flex flex-col items-center justify-center gap-2 p-[clamp(0.5rem,0.3rem,1.8rem)] ">
            <h1 className=" text-[#FFFFFFB2] font-bold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              4H
            </h1>
            <h1
              className={`font-semibold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ${
                (tokenMetrics?.price4HourPercent ?? 0) < 0
                  ? "text-[#E1414A]"
                  : "text-[#00FFA3]"
              }`}
            >
              {tokenMetrics?.price4HourPercent?.toFixed(2) ?? "N/A"}%
            </h1>
          </div>
          <Separator className=" h-[clamp(40px,7vw,65px)]  w-[1px] bg-[#FFFFFF14]  " />
          <div className="w-full flex flex-col items-center justify-center gap-2 p-[clamp(0.5rem,0.3rem,1.8rem)] ">
            <h1 className=" text-[#FFFFFFB2] font-bold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              24H
            </h1>
            <h1
              className={`font-semibold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ${
                (tokenMetrics?.price24HourPercent ?? 0) < 0
                  ? "text-[#E1414A]"
                  : "text-[#00FFA3]"
              }`}
            >
              {tokenMetrics?.price24HourPercent?.toFixed(2) ?? "N/A"}%
            </h1>
          </div>
        </div>
        {/* fourth row */}
        <div className=" flex items-center justify-between w-full border-b border-b-[#FFFFFF14] ">
          <div className="w-full flex flex-col items-start justify-center gap-2 p-[clamp(0.5rem,3vw,1.8rem)] ">
            <h1 className=" text-[#FFFFFFB2] font-bold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              24 VOl
            </h1>
            <h1 className=" flex items-center flex-nowrap gap-2 text-white font-semibold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              ${formatCompactNumber(tokenMetrics?.vol24Hours)}
              <span
                className={`font-semibold ${
                  (tokenMetrics?.vol24HoursPercentChange ?? 0) < 0
                    ? "text-[#E1414A]"
                    : "text-[#00FFA3]"
                }`}
              >
                {tokenMetrics?.vol24HoursPercentChange?.toFixed(2) ?? "N/A"}%
              </span>
            </h1>
          </div>
          <div className="w-full flex flex-col items-center justify-center gap-2 p-[clamp(0.5rem,0.3rem,1.8rem)] ">
            <h1 className=" text-[#FFFFFFB2] font-bold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              BUY
            </h1>
            <h1 className=" text-[#00FFA3] font-semibold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              ${formatCompactNumber(tokenMetrics?.buyVol24Hours)}
            </h1>
          </div>
          <div className="w-full flex flex-col items-center justify-center gap-2 p-[clamp(0.5rem,0.3rem,1.8rem)] ">
            <h1 className=" text-[#FFFFFFB2] font-bold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              SELL
            </h1>
            <h1 className=" text-[#E1414A] font-semibold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              ${formatCompactNumber(tokenMetrics?.sellVol24Hours)}
            </h1>
          </div>
        </div>
        {/* fifith row */}
        <div className=" flex items-center justify-between w-full  ">
          <div className="w-full flex flex-col items-start justify-center gap-2 p-[clamp(0.5rem,3vw,1.8rem)] ">
            <h1 className=" text-[#FFFFFFB2] font-bold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              24 TXNS
            </h1>
            <h1 className=" flex items-center flex-nowrap gap-2 text-white font-semibold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              {formatCompactNumber(tokenMetrics?.txnS24h)}
            </h1>
          </div>
          <div className="w-full flex flex-col items-center justify-center gap-2 p-[clamp(0.5rem,0.3rem,1.8rem)] ">
            <h1 className=" text-[#FFFFFFB2] font-bold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              BUY
            </h1>
            <h1 className=" text-[#00FFA3] font-semibold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              {tokenMetrics?.buy?.toLocaleString() ?? "N/A"}K
            </h1>
          </div>
          <div className="w-full flex flex-col items-center justify-center gap-2 p-[clamp(0.5rem,0.3rem,1.8rem)] ">
            <h1 className=" text-[#FFFFFFB2] font-bold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              SELL
            </h1>
            <h1 className=" text-[#E1414A] font-semibold text-[clamp(10px,2vw,14px)] leading-[100%] tracking-[0%] text-center ">
              {tokenMetrics?.sell?.toLocaleString() ?? "N/A"}K
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SmallScreenTokenDetailsCard;
