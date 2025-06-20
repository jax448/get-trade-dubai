"use client";
// import React, { useCallback, useState } from "react";
import { RightActions } from "./RightActions";
import { GetTradeLogo } from "./GetTradeLogo";
import Logo from "@public/pics/TokenIcon.png";
import RightButtons from "./RightButtons";
import { useSolanaAuthStore } from "@/store/auth";
import { Button } from "../ui/button";
import { UserMenu } from "./UserProfileDropDown";
import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useTokenByAddress } from "@/api-lib/api-hooks/useAccountsApiHook";
// import { Search } from "lucide-react";
// import { Input } from "../ui/input";
// import { Table, TableBody, TableRow } from "../ui/table";
// import SearchedTokenItem from "./SearchedTokenItem";
// import { useDebounce } from "use-debounce";

function Header() {
  const OpenModal = useSolanaAuthStore().OpenModalFunc;
  const key = useSolanaAuthStore().key;

  // const filterString = DashBoardTableStore((s) => s.filterString);
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

  return (
    <header className="mx-auto h-[clamp(60px,70px,85px)] bg-black w-full px-[clamp(1rem,2vw,2rem)] flex items-center justify-center">
      <div className="mx-auto px-[clamp(2px,2vw,4px)] h-[clamp(12px,4vh,16px)] flex items-center justify-between gap-[clamp(0.8rem,3vw,2.8rem)] max-w-full w-full">
        <div className="flex items-center space-x-[clamp(3px,2vw,6px)]">
          <Link
            href={"/"}
            className="flex items-center space-x-[clamp(1px,1vw,2px)]"
          >
            <GetTradeLogo Logo={Logo} />
            <span className="font-bold text-nowrap text-[clamp(16px,4vw,26px)] leading-[100%] tracking-[0%]">
              GetTrade
            </span>
          </Link>
        </div>

        <div className="flex items-center lg:justify-between justify-end lg:max-w-[clamp(600px,70vw,800px)] lg:gap-0 sm:gap-6 gap-2 lg:w-full">
          {/* search component */}
          {/* <div className="relative w-full max-w-[443px] mr-4 ">
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
          {/* search component */}
          <div className="flex items-center justify-center gap-[clamp(0.6px,2vw,3rem)] w-full   ">
            <RightButtons />
            <RightActions />
          </div>
          {key ? (
            <UserMenu />
          ) : (
            <Button
              onClick={OpenModal}
              className="max-w-[clamp(80px,15vw,120px)] hover:text-white h-[clamp(34px,4vh,34px)] !w-full block font-semibold text-[clamp(12px,3vw,16px)] leading-[100%] tracking-[0%] text-center bg-white [box-shadow:0px_4px_4px_0px_rgba(0,_0,_0,_0.25)] text-black px-[clamp(15px,3vw,25px)] py-[clamp(4px,1vh,7px)] rounded-[clamp(4px,1vw,6px)]"
            >
              Connect
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
