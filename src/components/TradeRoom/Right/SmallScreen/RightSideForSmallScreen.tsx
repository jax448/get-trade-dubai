"use client";
import React, { useState } from "react";
import BuySellTradeComponent from "../Buy_Sell_Trade_Component";
import SecurityData from "../SecurityData";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import SmallScreenTokenDetailsCard from "./SmallScreenTokenDetailsCard";
import SmallScreenTransactionDataCard from "./SmallScreenTransactionDataCard";

type TabType = "" | "tokendetails" | "Trade" | "transaction" | "datasecurity";

function RightSideForSmallScreen({ tokenAddress }: { tokenAddress: string }) {
  const [tabs, setTabs] = useState<TabType>("Trade");

  const handleTabs = (value: TabType) => {
    // If clicking the same tab, close it; otherwise, set the new tab
    setTabs(value === tabs ? "" : value);
  };
  // Tab configuration
  const tabOptions = [
    { value: "tokendetails", label: "Token" },
    { value: "Trade", label: "Trade" },
    { value: "transaction", label: "Transactions" },
    { value: "datasecurity", label: "Security" },
  ];

  return (
    <div className="xl:hidden bg-black w-full fixed bottom-0 left-0 right-0  z-50 border-t border-t-[#2A2A3D] flex flex-col gap-4">
      {tabs !== "" && (
        <Button
          className="text-white bg-transparent ml-auto mr-4 mt-[1rem] border rounded-full hover:bg-blue-700/20 p-1 h-8 w-8"
          onClick={() => handleTabs("")}
          aria-label="Close panel"
        >
          <X size={18} />
        </Button>
      )}
      <div className="w-full">
        <div className="   ">
          {tabs === "tokendetails" && (
            <div className="">
              {/* <TokenDetailsCard tokenAddress={tokenAddress} /> */}
              <SmallScreenTokenDetailsCard tokenAddress={tokenAddress} />
            </div>
          )}
          {tabs === "Trade" && (
            <div className="">
              {/* <TokenDetailsCard tokenAddress={tokenAddress} /> */}
              <BuySellTradeComponent tokenAddress={tokenAddress} />
            </div>
          )}

          {tabs === "transaction" && (
            <div className=" pb-[2rem]  ">
              {/* <TransactionDataCard tokenMetrics={tokenMetrics} /> */}
              <SmallScreenTransactionDataCard tokenAddress={tokenAddress} />
            </div>
          )}

          {tabs === "datasecurity" && (
            <div className=" pb-[2rem] ">
              {/* <TransactionDataCard tokenMetrics={tokenMetrics} /> */}
              <SecurityData tokenAddress={tokenAddress} />
            </div>
          )}
        </div>
        <div className="flex w-full overflow-x-auto scrollbar-hide bg-black/5 backdrop-blur-md rounded-lg p-1 shadow-lg">
          {tabOptions.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabs(tab.value as TabType)}
              className={`
            flex-1 min-w-fit py-2 px-2 mx-1 rounded-md text-[clamp(14px,2vw,16px)] font-semibold transition-all duration-300 ease-in-out
            ${
              tabs === tab.value
                ? "bg-[#4CF37B] text-black shadow-md"
                : "bg-[rgba(255,255,255,0.55)] text-white  "
            }
          `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RightSideForSmallScreen;
