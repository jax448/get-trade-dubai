"use client";
// import Image from "next/image";
import React, { useEffect } from "react";
// import seattings from "@public/pics/settings-2.png";
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
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import useSearchStore from "@/store/WalletSearchFilterStore";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";

type SearchFormValues = {
  searchTerm: string;
};

function WalletsecondHeader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    setMyWalletSearch,
    setDepositSearch,
    setWithdrawSearch,
    setArchievedSearch,
  } = useSearchStore();

  // Initialize form with current search value based on URL
  const { register, watch } = useForm<SearchFormValues>({
    defaultValues: {
      searchTerm: "",
    },
  });

  // Watch for search input changes
  const searchValue = watch("searchTerm");

  // Apply debounce to search term to avoid excessive updates
  const [debouncedSearchTerm] = useDebounce(searchValue, 300);

  // Update store when debounced search term changes
  useEffect(() => {
    if (location.href.match("/wallet-managment")) {
      setMyWalletSearch(debouncedSearchTerm);
    }
    if (location.href.match("wallet-managment/deposit")) {
      setDepositSearch(debouncedSearchTerm);
    }
    if (location.href.match("wallet-managment/withdraw")) {
      setWithdrawSearch(debouncedSearchTerm);
    }
    if (location.href === "/wallet-managment/archived") {
      setArchievedSearch(debouncedSearchTerm);
    }
  }, [
    debouncedSearchTerm,
    pathname,
    setArchievedSearch,
    setDepositSearch,
    setMyWalletSearch,
    setWithdrawSearch,
  ]);

  return (
    <div className=" bg-[#0D0D0D5E] h-[clamp(80px,10vw,90px)] w-full  flex items-center justify-between gap-8 px-[2rem] ">
      {children}

      <div className="flex items-center justify-end space-x-[clamp(0.5rem,3vw,1rem)] w-full">
        <div className="flex items-center space-x-[clamp(0.5rem,2vw,1rem)] bg-zinc-800 rounded-lg px-[clamp(0.5rem,2vw,1rem)] h-[clamp(30px,6vw,39px)] flex-grow max-w-[clamp(300px,50vw,443px)]">
          <Search
            className="text-white w-[clamp(16px,3vw,18px)] h-[clamp(16px,3vw,18px)]"
            size={18}
          />
          <Input
            {...register("searchTerm")}
            placeholder="Search token or address"
            className="bg-transparent h-[clamp(30px,6vw,39px)] max-w-[clamp(300px,50vw,443px)] w-full !font-normal !text-[clamp(12px,2.5vw,14px)] !leading-[100%] !tracking-[0%] border-none text-white placeholder:text-[#B6B6B6] focus-visible:ring-0 focus-visible:ring-offset-0 p-0 placeholder-zinc-500"
          />
        </div>

        {/* Action Buttons */}
        {/* <div className="flex items-center space-x-[clamp(6px,2vw,12px)]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className=" h-[clamp(32px,5vw,37px)]
                 max-w-[clamp(80px,26vw,101px)]
                 bg-[#FFFFFF1A]
                 rounded-[6px]
                 px-[clamp(12px,4vw,20px)]
                 flex items-center justify-center
                 gap-[clamp(4px,1vw,8px)]
                 text-white
                 font-normal
                 text-[clamp(10px,3vw,12px)]
                 leading-[100%]
                 tracking-[0%] "
              >
                <Image
                  src={Sliders}
                  alt=""
                  className=" w-[clamp(14px,3.5vw,16.36px)] h-[clamp(14px,3.5vw,16.36px)]  "
                />
                Filter
                <Image
                  src={ArrowDown}
                  alt=""
                  className=" w-[clamp(10px,2.5vw,11.45px)] h-[clamp(10px,2.5vw,11.45px)]  "
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-black text-white border-none  ">
              <DropdownMenuGroup>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <button className="text-gray-500 hover:text-gray-700">
            <div className="w-[clamp(20px,4vw,24px)] h-[clamp(20px,4vw,24px)] relative">
              <Image
                src={seattings}
                alt="Settings"
                fill
                sizes="(max-width: 768px) 24px, 24px"
                className="object-contain"
              />
            </div>
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default WalletsecondHeader;
