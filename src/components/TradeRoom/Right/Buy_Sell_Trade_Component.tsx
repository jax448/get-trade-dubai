"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import coloredbuy from "@public/pics/Coloredshare.png";
import noncoloredbuy from "@public/pics/NonColoredshare.png";
import coloredsell from "@public/pics/Coloredtag.png";
import noncoloredsell from "@public/pics/NonColoredtag.png";
import coloredswap from "@public/pics/ColoredSwap.png";
import noncoloredswap from "@public/pics/NonColoredSwap.png";
import Image from "next/image";
import { cn } from "@/lib/utils";
import TokenSwapComponent from "./TokenSwapComponent";
import TokenBuyComponent from "./TokenBuyComponent";
import TokenSellComponent from "./TokenSellComponent";

function BuySellTradeComponent({
  defaultTab = "buy",
  tokenAddress,
}: {
  defaultTab?: "buy" | "sell" | "swap";
  tokenAddress: string;
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const handleTabChange = (value: string) => {
    setActiveTab(value as "buy" | "sell" | "swap");
  };

  return (
    <div className=" xl:mt-4 rounded-[6px] h-full   bg-[#F1F2FF0D] text-white w-full  mx-auto ">
      <div className="p-4">
        <Tabs defaultValue={defaultTab} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-3 bg-[#232323] h-[unset] mb-[clamp(6px,1vw,16px)] [&_span]:font-medium [&_span]:text-[clamp(10px,2vw,16px)] [&_span]:leading-[100%] [&_span]:tracking-[0%] [&_button]:rounded-[6px] [&_button]:py-[1rem] p-0 ">
            <TabsTrigger
              onClick={() => setActiveTab("buy")}
              value="buy"
              className="data-[state=active]:bg-[#131313] h-full text-[#5F5F5F] data-[state=active]:text-[#00FFA3] rounded-md"
            >
              <div className="flex items-center gap-2">
                <Image
                  src={activeTab === "buy" ? coloredbuy : noncoloredbuy}
                  alt=""
                  className=" w-[clamp(14px,2vw,24px)] h-[clamp(14px,2vw,24px)]  "
                />
                <span>Buy</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              onClick={() => setActiveTab("sell")}
              value="sell"
              className="data-[state=active]:bg-[#131313] h-full text-[#5F5F5F] data-[state=active]:text-[#E1414A] rounded-md"
            >
              <div className="flex items-center gap-2">
                <Image
                  src={activeTab === "sell" ? coloredsell : noncoloredsell}
                  alt=""
                  className=" w-[clamp(14px,2vw,24px)] h-[clamp(14px,2vw,24px)]  "
                />

                <span>Sell</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              onClick={() => setActiveTab("swap")}
              value="swap"
              className="data-[state=active]:!bg-[#131313] h-full  rounded-md"
            >
              <div className="flex items-center gap-2">
                <Image
                  src={activeTab === "swap" ? coloredswap : noncoloredswap}
                  alt=""
                  className=" w-[clamp(14px,2vw,24px)] h-[clamp(14px,2vw,24px)]  "
                />
                <span
                  className={cn(
                    activeTab === "swap"
                      ? "text-transparent bg-clip-text !bg-[linear-gradient(256.05deg,_#F001FF_12.39%,_#4CF37B_76.55%)]"
                      : "text-[#5F5F5F]"
                  )}
                >
                  Swap
                </span>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Buy Tab Content */}
          <TabsContent value="buy">
            <TokenBuyComponent tokenAddress={tokenAddress} />
          </TabsContent>

          {/* Sell Tab Content */}
          <TabsContent value="sell">
            <TokenSellComponent tokenAddress={tokenAddress} />
          </TabsContent>

          {/* Swap Tab Content */}
          <TabsContent value="swap">
            <TokenSwapComponent tokenAddress={tokenAddress} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default BuySellTradeComponent;
