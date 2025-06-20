"use client";
import { Search } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import star from "@public/pics/EmptyStarImage.png";
import FillStar from "@public/pics/starTableIcon.png";
import yellowFillStar from "@public/pics/yellowFillStarsImage.png";
import Export from "@public/pics/ExportTableIcon.png";
import Token from "@public/pics/DummeyTokenIcon.png";
import Sol from "@public/pics/SOLwithBorderIcon.png";
import { Input } from "@/components/ui/input";
import { useSolanaAuthStore } from "@/store/auth";
import {
  useWatchListData,
  useWatchListMutate,
} from "@/api-lib/api-hooks/useWatchListApiHook";
import { queryClient } from "@/Context/React-Query-Provider";
import toast from "react-hot-toast";
import CustomToast from "../CustomToast";
import { Skeleton } from "../ui/skeleton";
import { formatNumber, formatSmallNumber } from "@/helpers/TImeLeftSlotHelpers";
import { useDebounce } from "use-debounce";
import { useShareModal } from "@/store/ShareModal";
import { useRouter } from "next/navigation";

function LeftSide() {
  const router = useRouter();
  const toggleShareModal = useShareModal((state) => state.toggleShareModal);
  const setShareData = useShareModal((state) => state.setShareData);

  const key = useSolanaAuthStore((state) => state.key);
  const { data: cryptoDatas, isLoading } = useWatchListData(key || "");

  const { mutate } = useWatchListMutate(key || "");

  const [searchTerm, setSearchTerm] = useState(""); // Add state for search term
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const handleWatchList = useCallback(
    (tokenAdd: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (!key) {
        toast.custom((t) => (
          <CustomToast
            type="error"
            title={"Please login to add to watchlist"}
            description=""
            t={t}
            onClose={() => toast.dismiss(t.id)}
          />
        ));
        return;
      }
      mutate(tokenAdd, {
        onSuccess(data) {
          console.log("Success:", data);
          queryClient.invalidateQueries({ queryKey: ["GetTokenInfo"] });
          queryClient.invalidateQueries({ queryKey: ["WatchList"] });
          toast.custom((t) => {
            return (
              <CustomToast
                type={
                  data.data === "Token added to watchlist" ? "success" : "error"
                }
                title="Watchlist updated"
                description={data.data}
                t={t}
                onClose={() => toast.dismiss(t.id)}
              />
            );
          });
        },
        onError(error) {
          console.log("Error");
          toast.custom((t) => {
            return (
              <CustomToast
                type="error"
                title={error.message}
                description=" Error updating watchlist"
                t={t}
                onClose={() => toast.dismiss(t.id)}
              />
            );
          });
        },
      });
    },
    [mutate, key]
  );

  const HandleShare = (e: React.MouseEvent, tokenAddress: string) => {
    e.stopPropagation();
    toggleShareModal();
    setShareData({
      text: `${process.env.NEXT_PUBLIC_FRONT_END_URL}trade/${tokenAddress}`,
      title: "Check out this token!",
      url: `${process.env.NEXT_PUBLIC_FRONT_END_URL}trade/${tokenAddress}`,
      description: `Explore this  token on Get.Trade.Token: ${tokenAddress}`,
    });
  };

  // Filter the crypto data based on the debounced search term
  const filteredData = cryptoDatas?.data?.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <div className=" xl:order-1 order-3  w-full bg-[#F1F2FF0D] border overflow-y-auto h-[calc(100vh-85px)] 2xl:max-w-[271px] max-w-[240px]  border-[#FFFFFF14] xl:flex hidden flex-col">
      <div className="w-full h-[clamp(25px,4vh,30px)] bg-[#232323] p-[clamp(8px,8vw,12px)] flex items-center justify-center gap-1">
        <Image
          src={star}
          width={23}
          height={23}
          alt=""
          className=" w-[clamp(16px,2vw,23px)] h-[clamp(16px,2vw,23px)]  "
        />
        <h3 className=" text-[#C3C3C3] font-bold text-[clamp(8px,2vw,13.7px)]  tracking-[0%]  ">
          Wachlist
        </h3>
      </div>
      <div className=" py-[clamp(1rem,2vw,2rem)]  ">
        <div className="px-[clamp(0.5rem,2vw,1rem)]">
          <div className="relative">
            <Search size={16} className="absolute left-2 top-2.5 text-white " />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
              placeholder="Search tokens"
              className="bg-[#FFFFFF0F] !font-medium !text-[clamp(10px,1vw,12.72px)] focus-visible:ring-0 focus-visible:ring-offset-0 !text-white leading-[100%] tracking-[0%] placeholder:text-[#B6B6B6] border-none h-[clamp(25px,4vh,30px)] rounded-[6px] pl-10 pr-2 py-2 w-full "
            />
          </div>
        </div>
        <div className="overflow-y-auto mt-[clamp(1rem,3vh,2rem)] flex-1">
          {isLoading
            ? // Show skeletons while loading
              Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-[clamp(0.5rem,2vw,1rem)] py-[clamp(4px,1vh,8px)] border-b border-gray-800"
                >
                  <div className="flex items-center gap-[clamp(4px,1vw,8px)]">
                    <div className="flex items-center gap-[clamp(4px,1vw,8px)]">
                      <Skeleton className="w-[clamp(12px,1.5vw,20px)] h-[clamp(12px,1.5vw,20px)] rounded" />
                      <Skeleton className="w-[clamp(12px,1.5vw,20px)] h-[clamp(12px,1.5vw,20px)] rounded" />
                    </div>
                    <div className="flex items-center gap-[clamp(4px,1vw,8px)]">
                      <Skeleton className="w-[clamp(26px,3vw,47px)] h-[clamp(26px,3vw,47px)] rounded-full relative" />
                      <div className="flex flex-col gap-[clamp(4px,1vw,8px)]">
                        <Skeleton className="h-[clamp(10px,1vw,14px)] w-[80px]" />
                        <Skeleton className="h-[clamp(8px,0.9vw,12px)] w-[40px]" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : filteredData
                ?.sort((a, b) => {
                  const dateA = a.dateTime ? new Date(a.dateTime).getTime() : 0;
                  const dateB = b.dateTime ? new Date(b.dateTime).getTime() : 0;
                  return dateA - dateB;
                })
                ?.map((crypto) => (
                  <div
                    onClick={() => router.push(`/trade/${crypto.tokenAddress}`)}
                    key={crypto.tokenAddress}
                    className="flex items-center justify-between px-[clamp(0.5rem,2vw,1rem)] py-[clamp(4px,1vh,8px)] hover:bg-gray-800 border-b border-gray-800 cursor-pointer "
                  >
                    <div className="flex items-center gap-[clamp(4px,1vw,8px)]">
                      <div className="flex items-center gap-[clamp(4px,1vw,8px)]">
                        <button
                          onClick={(e: React.MouseEvent) =>
                            handleWatchList(crypto.tokenAddress, e)
                          }
                        >
                          <Image
                            src={crypto.name ? yellowFillStar : FillStar}
                            alt=""
                            width={20}
                            height={20}
                            className="  min-w-[clamp(12px,1.5vw,20px)] w-[clamp(12px,1.5vw,20px)] h-[clamp(12px,1.5vw,20px)]"
                          />
                        </button>
                        <button
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            HandleShare(e, crypto.tokenAddress);
                          }}
                        >
                          <Image
                            src={Export}
                            alt=""
                            width={20}
                            height={20}
                            className="w-[clamp(12px,1.5vw,20px)] h-[clamp(12px,1.5vw,20px)]"
                          />
                        </button>
                      </div>
                      <div className="flex items-center gap-[clamp(4px,1vw,8px)]">
                        <div className="relative w-[clamp(26px,3vw,47px)] min-w-[clamp(26px,3vw,47px)] h-[clamp(26px,3vw,47px)]">
                          <Image
                            src={crypto.image ? crypto.image : Token}
                            fill
                            alt=" "
                            className=" rounded-full"
                          />
                          <Image
                            src={Sol}
                            width={14}
                            height={14}
                            className="absolute bottom-0 right-0 w-[clamp(10px,1vw,14px)] h-[clamp(10px,1vw,14px)]"
                            alt=""
                          />
                        </div>
                        <div className="flex flex-col gap-[clamp(4px,1vw,8px)]">
                          <span className=" max-w-[6ch] truncate font-semibold text-[clamp(10px,1vw,14px)] leading-[100%] tracking-[0%] white">
                            {crypto.symbol}
                          </span>
                          <span className="max-w-[6ch] truncate text-[#898989] font-bold text-[clamp(8px,0.9vw,10px)] leading-[100%] tracking-[0%]">
                            {crypto.name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-[clamp(4px,1vw,8px)] items-end font-semibold text-[clamp(8px,1vw,10px)] leading-[100%] tracking-[0%] text-right">
                      <span
                        className={`${
                          crypto.marketCap ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {formatNumber(crypto.marketCap)}
                      </span>
                      <span className="">
                        {formatSmallNumber(crypto.price)}
                      </span>
                    </div>
                  </div>
                ))}
        </div>
      </div>
    </div>
  );
}

export default LeftSide;
