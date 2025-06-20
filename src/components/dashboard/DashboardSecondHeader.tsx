"use client";
import { useSolanaAuthStore } from "@/store/auth";
// import React, { useState, useCallback } from "react";
// import { Search } from "lucide-react";
// import { Input } from "../ui/input";
// import Image from "next/image";
// import seattings from "@public/pics/settings-2.png";
// import logo from "@public/pics/TokenIcon.png";
// import { GetTradeLogo } from "./GetTradeLogo";
// import { QuickBuyButton } from "./QuickBuyButton";
import Link from "next/link";
// import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { TrendingTableStore } from "@/store/TrendingTableStore";
// import { DashBoardTableStore } from "@/store/DashBoardTableStore";
import SOLInputHeader from "./SOLInputHeader";
import { memo } from "react";
// import TimeIntervalButtons from "./TimeIntervalButtons";
import { usePathname } from "next/navigation";
// import useFilterString from "../useFilterString";
// import { useDebounce } from "use-debounce";
// import { useTokenByAddress } from "@/api-lib/api-hooks/useAccountsApiHook";
// import { useRouter } from "next/navigation";
// import { Table, TableBody, TableRow } from "../ui/table";
// import SearchedTokenItem from "./SearchedTokenItem";

function DashboardSecondHeader() {
  const key = useSolanaAuthStore((state) => state.key);
  const OpenModalFunc = useSolanaAuthStore((state) => state.OpenModalFunc);
  const pathname = usePathname();

  // const filterString = DashBoardTableStore.getState().getFilterString();
  // const filterString = useFilterString();
  // const [searchQuery, setSearchQuery] = useState("");
  // const [debouncedQuery] = useDebounce(searchQuery, 500);
  // const isValidAddress = debouncedQuery.trim().length > 0;
  // const router = useRouter();

  // const {
  //   data: token,
  //   isLoading,
  //   isError,
  // } = useTokenByAddress(debouncedQuery.trim(), isValidAddress);

  // const handleTokenSelect = useCallback(
  //   (tokenAddress: string) => {
  //     setSearchQuery("");
  //     router.push(`/trade/${tokenAddress}`);
  //   },
  //   [router]
  // );

  const setTitle = TrendingTableStore((s) => s.setTitle);

  return (
    <>
      <div className="bg-[#0D0D0D5E] md:h-[clamp(40px,10vw,74px)] md:my-0 my-[0.6rem] text-white flex items-center lg:justify-between px-[clamp(0.6rem,3vw,2rem)] py-[clamp(0.5rem,2vw,0.5rem)]  justify-center   small:gap-0 gap-2 ">
        {/* Left Side - Logo */}
        <div className="flex items-center w-full  sm:flex-nowrap flex-wrap gap-[clamp(0.3rem,2vw,2rem)] ">
          {/* Portfolio Dropdown */}
          <div className="flex items-center space-x-1 bg-[linear-gradient(90deg,_rgba(220,_31,_255,_0.4)_0%,_rgba(76,_243,_123,_0.4)_100%)] overflow-hidden p-[1px] max-w-[clamp(80px,18vw,137px)] h-[clamp(24px,4vw,39px)] min-w-[clamp(80px,18vw,137px)] rounded-[clamp(3px,1vw,6px)] [&>a]:text-nowrap ">
            <Link
              href={key ? "/holdings" : "#"}
              onClick={() => {
                if (!key) {
                  OpenModalFunc();
                } else {
                  return;
                }
              }}
              className="flex items-center justify-center font-medium text-[clamp(10px,1.8vw,16px)] leading-[100%] tracking-[0%] bg-[linear-gradient(90deg,_#030303_0%,_#1E1E1E_100%)] rounded-[clamp(3px,1vw,6px)] w-full h-full text-white"
            >
              Portfolio
            </Link>
          </div>
          <div className=" h-[clamp(30px,6vw,39px)] w-fit flex items-center justify-center  bg-[#202020] overflow-hidden rounded-[6px] ">
            <Link
              href={"/"}
              className={cn(
                " bg-transparent flex items-center justify-center w-[clamp(60px,8vw,109px)] px-[0.4rem] h-[clamp(30px,6vw,39px)]  text-[#CDCDCDB2]  !rounded-[6px] border border-transparent font-medium text-[clamp(10px,1.8vw,16px)] leading-[100%] tracking-[0%] ",
                pathname.match(/^\/$/) &&
                  "border-[#DC1FFF66] border !text-[#CDCDCD]"
              )}
              onClick={() => {
                setTitle("Trending");
              }}
            >
              Trending
            </Link>
            <Link
              href={"/new-pairs"}
              className={cn(
                " bg-transparent flex items-center justify-center w-[clamp(60px,8vw,109px)] px-[0.4rem] h-[clamp(30px,6vw,39px)]  text-[#CDCDCDB2] !rounded-[6px] border border-transparent font-medium text-[clamp(10px,1.8vw,16px)] leading-[100%] tracking-[0%] ",
                pathname.match("/new-pairs") &&
                  "border-[#DC1FFF66] border !text-[#CDCDCD]"
              )}
              onClick={() => {
                setTitle("New Pairs");
              }}
            >
              New Pairs
            </Link>
          </div>
          {/* <div className=" md:block hidden  ">
            <TimeIntervalButtons />
          </div> */}
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

        {/* Right Side - Actions */}
        <div className="flex items-center justify-end space-x-[clamp(0.5rem,3vw,1rem)] sm:w-full">
          {/* <div className="relative w-full max-w-[clamp(300px,50vw,443px)]">
          <div className="flex items-center space-x-[clamp(0.5rem,2vw,1rem)] bg-zinc-800 rounded-lg px-[clamp(0.5rem,2vw,1rem)] h-[clamp(30px,6vw,39px)]">
            <Search
              className="text-white w-[clamp(16px,3vw,18px)] h-[clamp(16px,3vw,18px)]"
              size={18}
            />
            <Input
              placeholder="Search token or address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent h-[clamp(30px,6vw,39px)] w-full !font-normal !text-[clamp(12px,2.5vw,14px)] !leading-[100%] !tracking-[0%] border-none text-white placeholder:text-[#B6B6B6] focus-visible:ring-0 focus-visible:ring-offset-0 p-0 placeholder-zinc-500"
            />
          </div>

          {searchQuery.length > 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-zinc-900 rounded-lg border border-zinc-700 max-h-[250px] overflow-y-auto shadow-lg z-50">
              {isLoading && (
                <p className="text-sm text-white p-4">Searching...</p>
              )}
              {isError && (
                <p className="text-sm text-red-400 p-4">Token not found.</p>
              )}
              {!isLoading && !isError && token && (
                <Table className=" w-full ">
                  <TableBody className=" w-full ">
                    {token.map((itm, key) => {
                      return (
                        <TableRow
                          key={key}
                          onClick={() => handleTokenSelect(itm.address)}
                          className={`cursor-pointer hover:bg-[#1E1E1E] w-full    bg-[#F1F2FF0D]    border-b-[#FFFFFF1A] font-semibold    text-[clamp(8px,2.5vw,14px)]    leading-[clamp(12px,3vw,18px)    tracking-[0%]    h-[clamp(36px,6vw,90px)]`}
                        >
                          <SearchedTokenItem token={itm} />
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
        </div> */}

          {/* Action Buttons */}
          <div className="flex items-center space-x-[clamp(0.5rem,2vw,0.75rem)]">
            {/* <QuickBuyButton /> */}
            {/* SOL Input */}
            <SOLInputHeader />
            {/* <button className="text-gray-500 hover:text-gray-700">
            <div className="w-[clamp(20px,4vw,24px)] h-[clamp(20px,4vw,24px)] relative">
              <Image
                src={seattings}
                alt="Settings"
                fill
                sizes="(max-width: 768px) 24px, 24px"
                className="object-contain"
              />
            </div>
          </button> */}
          </div>
        </div>
        {/* <span className="font-medium text-nowrap text-[14px] leading-[100%] tracking-[0%] text-white">
        filteringStringObject: {filterString}
      </span> */}
      </div>
      {/* <div className=" block md:hidden mx-auto ">
        <TimeIntervalButtons />
      </div> */}
    </>
  );
}

export default memo(DashboardSecondHeader);
