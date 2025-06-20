"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import HoldingTable from "./table";
// import Sliders from "@public/pics/FilterSLidersIcon.png";
// import ArrowDown from "@public/pics/arrow-down.png";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import seattings from "@public/pics/settings-2.png";
// import { Search } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import Image from "next/image";
// import { GetTradeLogo } from "@/components/dashboard/GetTradeLogo";
// import logo from "@public/pics/TokenIcon.png";
import { useGetHoldings } from "@/api-lib/api-hooks/useAccountsApiHook";
import { useSolanaAuthStore } from "@/store/auth";
import { WalletHoldings } from "@/types/apiTypes";
import FilterComponent from "./FilterComponent";

function Page() {
  const walletAddress = useSolanaAuthStore((state) => state.getTradePublicKey);
  const key = useSolanaAuthStore((state) => state.key);
  const [filteredData, setFilteredData] = useState<WalletHoldings[]>([]);
  const [hasAppliedFilter, setHasAppliedFilter] = useState(false);

  const { data, isLoading, isError } = useGetHoldings(
    walletAddress || "",
    key || ""
  );

  // Set initial data when API response changes
  useEffect(() => {
    if (data?.data && !hasAppliedFilter) {
      setFilteredData(data.data);
    }
  }, [data, hasAppliedFilter]);

  // This function won't cause re-renders when the data changes
  const handleFilteredDataChange = useCallback((newData: WalletHoldings[]) => {
    setFilteredData(newData);
    setHasAppliedFilter(true);
  }, []);

  // Get the data to display
  const displayData = useMemo(
    () => ({
      isSuccessfull: data?.isSuccessfull || false,
      data: filteredData.length > 0 ? filteredData : data?.data || [],
    }),
    [data?.isSuccessfull, filteredData, data?.data]
  );

  console.log("holdinss table data: ", data?.data);

  return (
    <div>
      <div className=" bg-[#0D0D0D5E] h-[clamp(80px,10vw,90px)] w-full flex items-center justify-between px-[clamp(0.5rem,3vw,2rem)] md:flex-nowrap flex-wrap    ">
        <div className="flex items-center space-x-[clamp(0.3rem,2vw,2rem)] w-full">
          <span className="font-semibold text-[clamp(14px,2vw,24px)] leading-[100%] tracking-[0%] text-white">
            Portfolio
          </span>
          {/* <span className="font-medium text-[clamp(14px,2vw,24px)] leading-[100%] tracking-[0%] text-white">
            Onchain360
          </span> */}

          {/* <div className="flex items-center space-x-[clamp(0.1rem,0.8vw,0.5rem)]">
            <GetTradeLogo Logo={logo} />
            <span className="font-bold text-[clamp(14px,2.5vw,25px)] leading-[100%] tracking-[0%]">
              Kiki
            </span>
            <span className="font-semibold text-[clamp(12px,1.8vw,18px)] leading-[100%] tracking-[0%] text-[#E1414A]">
              -1.2%
            </span>
          </div> */}
        </div>

        <FilterComponent
          data={data?.data || []}
          onFilteredDataChange={handleFilteredDataChange}
        />
      </div>
      <HoldingTable
        data={displayData}
        isLoading={isLoading}
        isError={isError ? new Error("An error occurred") : undefined}
      />
    </div>
  );
}

export default Page;
