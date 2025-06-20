"use client";
import React, { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TokenIcon from "@public/pics/DummeyTokenIcon.png";
import Sol from "@public/pics/SOLwithBorderIcon.png";
import x from "@public/pics/XTwitterIcon.svg";
import telegram from "@public/pics/telegramIcon.svg";
import globe from "@public/pics/GlobIcon.svg";
import FillStar from "@public/pics/starTableIcon.png";
import yellowFillStar from "@public/pics/yellowFillStarsImage.png";
import { Button } from "@/components/ui/button";
import alerIcon from "@public/pics/AlertIcon.png";
import WatchList from "@public/pics/star-plusIcon.png";
import MinusWatchList from "@public/pics/MinusWatchListIcon.png";
import { useGetTokenInfo } from "@/api-lib/api-hooks/useAccountsApiHook";
import { useSolanaAuthStore } from "@/store/auth";
import { useWatchListMutate } from "@/api-lib/api-hooks/useWatchListApiHook";
import toast from "react-hot-toast";
import CustomToast from "@/components/CustomToast";
import { queryClient } from "@/Context/React-Query-Provider";
import AlertsDialog from "./AlertsDialog";
import MiddleMarketCap from "./MiddleMarketCap";
import { CopyButton } from "@/components/CopyButton";
import copy from "@public/pics/document-copy.svg";

function MiddleHeader({ tokenAddress }: { tokenAddress: string }) {
  const key = useSolanaAuthStore((state) => state.key);
  const getTradePublicKey = useSolanaAuthStore(
    (state) => state.getTradePublicKey
  );

  const { data } = useGetTokenInfo(
    tokenAddress,
    getTradePublicKey || "",
    key || ""
  );

  const { mutate } = useWatchListMutate(key || "");

  const handleWatchList = useCallback(() => {
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
    mutate(tokenAddress, {
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
              title=" Watchlist updated"
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
              description=""
              t={t}
              onClose={() => toast.dismiss(t.id)}
            />
          );
        });
      },
    });
  }, [mutate, tokenAddress, key]);

  const [OpenAlertModal, setOpenAlertModal] = useState(false);
  const handleAlertModal = () => {
    setOpenAlertModal(false);
  };

  return (
    <>
      <div className="border-b border-gray-800 md:p-6 px-2 py-4 flex justify-between items-center">
        <div className="flex items-center justify-center gap-3 ">
          <button onClick={() => handleWatchList()}>
            <Image
              src={data?.data.favourite ? yellowFillStar : FillStar}
              alt=""
              width={23}
              height={23}
              className="w-[clamp(14px,2vw,23px)] h-[clamp(14px,2vw,23px)] min-w-[clamp(14px,2vw,23px)] "
            />
          </button>
          <div className=" relative  w-[clamp(24px,3vw,47px)] min-w-[clamp(24px,3vw,47px)] h-[clamp(24px,3vw,47px)]  ">
            <Image
              src={data?.data.image || TokenIcon}
              fill
              alt=" "
              className="rounded-full  "
            />
            <Image
              src={Sol}
              width={14}
              height={14}
              className="absolute bottom-0 right-0  w-[clamp(10px,1.5vw,14px)] h-[clamp(10px,1.5vw,14px)]  "
              alt=""
            />
          </div>
          <div className=" flex flex-col justify-between py-[2px]  gap-2 ">
            <div className=" flex items-center gap-1 ">
              <span className="font-semibold text-[clamp(10px,1.8vw,18px)] leading-[100%] tracking-[0%]  ">
                {data?.data.symbol}
              </span>
              <CopyButton
                text={tokenAddress}
                className="!px-[clamp(2px,1vw,2px)] !py-[clamp(2px,1vw,2px)] !h-[unset] rounded-[2px] bg-transparent"
              >
                <div className="relative w-[clamp(14px,2vw,18px)] h-[clamp(14px,2vw,18px)]">
                  <Image src={copy} fill alt="copy" />
                </div>
              </CopyButton>
            </div>
            {/* Social Links Container */}
            <div className=" flex items-center justify-start gap-2 ">
              {/* X/Twitter Button */}
              {data?.data.links.twitter && (
                <Link href={data?.data.links.twitter} className="">
                  <div className="w-[clamp(10px,2.5vw,12px)] h-[clamp(10px,2.5vw,12px)] relative">
                    <Image
                      src={x}
                      alt="X/Twitter Icon"
                      fill
                      sizes="(max-width: 768px) 12px, 12px"
                      className="object-contain"
                    />
                  </div>
                </Link>
              )}
              {data?.data.links.telegram && (
                <Link href={data?.data.links.telegram} className="">
                  <div className="w-[clamp(10px,2.5vw,12px)] h-[clamp(10px,2.5vw,12px)] relative">
                    <Image
                      src={telegram}
                      alt="X/Twitter Icon"
                      fill
                      sizes="(max-width: 768px) 12px, 12px"
                      className="object-contain"
                    />
                  </div>
                </Link>
              )}
              {data?.data.links.website && (
                <Link href={data?.data.links.website} className="">
                  <div className="w-[clamp(10px,2.5vw,12px)] h-[clamp(10px,2.5vw,12px)] relative">
                    <Image
                      src={globe}
                      alt="X/Twitter Icon"
                      fill
                      sizes="(max-width: 768px) 12px, 12px"
                      className="object-contain"
                    />
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center lg:gap-12 gap-4 justify-end  ">
          <div className="flex items-center justify-center lg:gap-5 gap-2  ">
            {/* Alerts Button */}
            <Button
              onClick={() => setOpenAlertModal(true)}
              className="bg-[#DC1FFF]  h-[clamp(24px,3vw,32px)]  flex items-center justify-center gap-[clamp(0.2rem,3vw,0.75rem)] text-white 
        font-medium text-[clamp(8px,2.5vw,14px)] leading-[100%] tracking-[0%] 
        w-full max-w-[clamp(100px,20vw,120px)] 
        px-[clamp(8px,3vw,25px)] py-[clamp(8px,2vw,12px)] rounded-[6px]"
            >
              <div className="w-[clamp(10px,2.5vw,15px)] h-[clamp(13px,2.5vw,18px)] relative">
                <Image
                  src={alerIcon}
                  alt="Alerts Icon"
                  fill
                  sizes="(max-width: 768px) 15px, 15px"
                  className="object-contain brightness-[200000%] filter "
                />
              </div>
              <span className=" sm:inline-block hidden ">Alerts</span>
            </Button>

            {/* Watchlist Button */}
            <Button
              onClick={() => handleWatchList()}
              className={`"  h-[clamp(24px,3vw,32px)]  flex items-center justify-center gap-[clamp(0.2rem,3vw,0.5rem)] text-white
        font-medium text-[clamp(8px,2.5vw,14px)] leading-[100%] tracking-[0%] 
        w-full max-w-[clamp(100px,20vw,126px)] 
         px-[clamp(8px,3vw,25px)] py-[clamp(8px,2vw,12px)] rounded-[6px]" ${
           !data?.data.favourite ? "bg-[#2ED55D]" : " bg-red-500 "
         }  `}
            >
              <div className="w-[clamp(14px,2.5vw,22px)] min-w-[clamp(14px,2.5vw,22px)] h-[clamp(14px,2.5vw,22px)] relative">
                <Image
                  src={data?.data.favourite ? MinusWatchList : WatchList}
                  alt="Watchlist Icon"
                  fill
                  sizes="(max-width: 768px) 22px, 22px"
                  className="object-contain brightness-[200000%] filter"
                />
              </div>
              <span className=" sm:inline-block hidden ">Watchlist</span>
            </Button>
          </div>
          <MiddleMarketCap tokenAddress={tokenAddress} />
        </div>
      </div>
      <AlertsDialog
        isAlertOpen={OpenAlertModal}
        ToggleAlertModal={handleAlertModal}
        tokenAddress={tokenAddress}
      />
    </>
  );
}

export default MiddleHeader;
