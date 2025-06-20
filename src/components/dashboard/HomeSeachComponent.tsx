import React, { memo, useCallback, useState, useRef } from "react";
import { Input } from "../ui/input";
import { X as CloseIcon, Search } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
// import { useSearchTokens } from "@/lib/hooks/useServices";
import { useDebounce } from "use-debounce";
import Image from "next/image";
import { useRouter } from "next/navigation";
import searchIcon from "@public/pics/search.png";
import { AnimatePresence, motion } from "framer-motion";
import { useTokenByAddress } from "@/api-lib/api-hooks/useAccountsApiHook";
import SearchedTokenItem from "./SearchedTokenItem";
import { Table, TableBody, TableRow } from "../ui/table";

export interface SearchTokenDataInterface {
  price: number;
  symbol: string;
  name: string;
  address: string;
  chain: string;
  image: string;
  createdTime: string;
}

function HomeSearchComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 500);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const {
    data: token,
    isLoading,
    isError,
  } = useTokenByAddress(
    debouncedQuery.trim(),
    debouncedQuery.trim().length > 0
  );
  const handleTokenSelect = (tokenAddress: string) => {
    setIsSearchOpen(false); // close the modal
    setSearchQuery(""); // clear input
    router.push(`/trade/${tokenAddress}`); // navigate to token detail page
  };

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSearchQuery("");
  }, []);

  // Show dropdown when input is focused
  const handleFocus = useCallback(() => {
    if (debouncedQuery.length > 0) {
      setIsSearchOpen(true);
    }
  }, [debouncedQuery]);

  return (
    <div
      ref={searchContainerRef}
      className="relative md:w-full w-[31px] md:max-w-[400px]"
    >
      <button
        className="text-gray-500 hover:text-gray-700 flex items-center justify-center"
        onClick={() => setIsSearchOpen(true)}
      >
        <div className="w-[clamp(20px,3vw,24px)] h-[clamp(20px,3vw,24px)] relative">
          <Image
            src={searchIcon}
            alt="Search"
            fill
            sizes="(max-width: 768px) 24px, 24px"
            className="object-contain ml-[clamp(0.25rem,1vw,0.5rem)]"
          />
        </div>
      </button>
      {/* Mobile full-screen search overlay */}
      <AnimatePresence mode="wait">
        {isSearchOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={scaleVariants}
            className=" w-full max-w-[700px] rounded-[32px] p-[2rem] left-[50%] !translate-x-[-50%] top-[50px] max-h-[calc(100vh-40%)] h-full  fixed inset-0 bg-[#00000036] backdrop-blur-lg z-[41]  flex flex-col"
          >
            <div className="  w-full flex flex-col mx-auto justify-center items-center  ">
              <div className="flex items-center gap-3 mb-4  w-full ">
                <div className="flex items-center space-x-[clamp(0.5rem,2vw,1rem)] bg-zinc-800 rounded-lg px-[clamp(0.5rem,2vw,1rem)] h-[clamp(30px,6vw,39px)] flex-grow w-full">
                  <Search
                    className="text-white w-[clamp(16px,3vw,18px)] h-[clamp(16px,3vw,18px)]"
                    size={18}
                  />
                  <Input
                    ref={inputRef}
                    type="search"
                    value={searchQuery}
                    onChange={handleSearch}
                    onFocus={handleFocus}
                    placeholder="Search token or address"
                    className="bg-transparent h-[clamp(30px,6vw,39px)]  w-full !font-normal !text-[clamp(12px,2.5vw,14px)] !leading-[100%] !tracking-[0%] border-none text-white placeholder:text-[#B6B6B6] focus-visible:ring-0 focus-visible:ring-offset-0 p-0 placeholder-zinc-500"
                  />
                </div>
                <button
                  onClick={closeSearch}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#FFFFFF1A]"
                >
                  <CloseIcon className="text-white w-4 h-4" />
                </button>
              </div>
              <div className="w-full max-h-[clamp(108px,18vw,270px)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#555] scrollbar-track-transparent">
                {searchQuery.length > 0 && (
                  <>
                    {isLoading && (
                      <div className="p-4">
                        {[1].map((i) => (
                          <div key={i} className="flex items-center gap-3 py-3">
                            <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                            <div className="space-y-2 flex-1">
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-3 w-28" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {isError && debouncedQuery.trim().length > 0 && (
                      <div className="p-4 text-red-400 text-center">
                        Token not found or invalid address.
                      </div>
                    )}

                    {!isLoading && !isError && token && (
                      // ✅ Insert the updated token UI block here

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
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(HomeSearchComponent);

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};
