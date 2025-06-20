"use client";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TransactionTable from "../tables/TransactionTable";
import TopTradersTable from "../tables/TopTradersTable";
import TopHoldersTable from "../tables/TopHolders";
// import { useGetTokenHolders } from "@/api-lib/api-hooks/useAccountsApiHook";

function MiddleBottonTabs({ tokenAddress }: { tokenAddress: string }) {
  const [activeTab, setActiveTab] = useState("transactions");

  // const { data } = useGetTokenHolders(tokenAddress);

  return (
    <>
      <Tabs defaultValue={activeTab}>
        <TabsList className="flex items-center justify-start gap-[clamp(1rem,5vw,4rem)] mx-0  h-[clamp(30px,4vh,40px)] !bg-transparent  [&>button]:font-bold [&>button]:text-[clamp(12px,1vw,14px)] [&>button]:leading-[100%] [&>button]:tracking-[0%] [&>button]:text-center [&>button]:py-[clamp(0.4rem,1vh,0.6rem)] p-0 border-b-[#D9D9D933] border-b w-full pl-[clamp(1rem,3vw,6rem)] ">
          <TabsTrigger
            onClick={() => setActiveTab("transactions")}
            value="transactions"
            className="!bg-transparent hover:!bg-transparent h-full text-[#9B9B9B] data-[state=active]:text-white relative after:[content('')] after:absolute after:w-full after:rounded-lg after:h-[1.5px] after:z-10 after:bottom-[-1px] after:left-0 data-[state=active]:after:bg-[#D9D9D9]  "
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger
            onClick={() => setActiveTab("Traders")}
            value="Traders"
            className="!bg-transparent hover:!bg-transparent h-full text-[#9B9B9B] data-[state=active]:text-white relative after:[content('')] after:absolute after:w-full after:rounded-lg after:h-[1.5px] after:z-10 after:bottom-[-1px] after:left-0 data-[state=active]:after:bg-[#D9D9D9]  "
          >
            Traders
          </TabsTrigger>
          <TabsTrigger
            onClick={() => setActiveTab("Holders")}
            value="Holders"
            className="!bg-transparent hover:!bg-transparent h-full text-[#9B9B9B] data-[state=active]:text-white relative after:[content('')] after:absolute after:w-full after:rounded-lg after:h-[1.5px] after:z-10 after:bottom-[-1px] after:left-0 data-[state=active]:after:bg-[#D9D9D9]  "
          >
            Holders
            {/* ({data?.data.length}) */}
          </TabsTrigger>
          {/* <TabsTrigger
            onClick={() => setActiveTab("Liquidity")}
            value="Liquidity"
            className="!bg-transparent hover:!bg-transparent h-full text-[#9B9B9B] data-[state=active]:text-white relative after:[content('')] after:absolute after:w-full after:rounded-lg after:h-[1.5px] after:z-10 after:bottom-[-1px] after:left-0 data-[state=active]:after:bg-[#D9D9D9]  "
          >
            Liquidity
          </TabsTrigger> */}
        </TabsList>
        <div className=" overflow-y-auto lg:max-h-[calc(50vh-200px)] h-full  ">
          {/* Buy activeTab Content */}
          <TabsContent value="transactions">
            <TransactionTable tokenAddress={tokenAddress} />
          </TabsContent>
          <TabsContent value="Traders">
            <TopTradersTable tokenAddress={tokenAddress} />
          </TabsContent>
          <TabsContent value="Holders">
            <TopHoldersTable tokenAddress={tokenAddress} />
          </TabsContent>
          {/* <TabsContent value="Liquidity">Liquidity</TabsContent> */}
        </div>
      </Tabs>
    </>
  );
}

export default MiddleBottonTabs;
