"use client";
import React, { useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  //   DialogTitle,
} from "../ui/dialog";
import Image from "next/image";
import WatchListImage from "@public/pics/WachlistModalImg.png";
import { useWatchListAndAlertStore } from "@/store/WachListAndAlertModals";
import { useSolanaAuthStore } from "@/store/auth";
import {
  useWatchListData,
  useWatchListMutate,
} from "@/api-lib/api-hooks/useWatchListApiHook";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CustomToast from "../CustomToast";
import { queryClient } from "@/Context/React-Query-Provider";
import FillStar from "@public/pics/starTableIcon.png";
import yellowFillStar from "@public/pics/yellowFillStarsImage.png";
import { useShareModal } from "@/store/ShareModal";
import Export from "@public/pics/ExportTableIcon.png";
import Delete from "@public/pics/DeleteIcon.png";
import Token from "@public/pics/DummeyTokenIcon.png";
import Pump from "@public/pics/PumpFunTableLogo.png";
import Sol from "@public/pics/SOLwithBorderIcon.png";
import { formatNumber, formatSmallNumber } from "@/helpers/TImeLeftSlotHelpers";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { Skeleton } from "../ui/skeleton";
// import TimeAgoCell from "./TimeAgoCell";
// import TokenStringShortener from "@/helpers/TokenStringShortener";
// import { CopyButton } from "../CopyButton";
// import copy from "@public/pics/document-copy.svg";

function WachListModal() {
  const isWatchListModalOpen = useWatchListAndAlertStore(
    (state) => state.isWatchListModalOpen
  );
  const toggleWatchListModal = useWatchListAndAlertStore(
    (state) => state.toggleWatchListModal
  );
  const setShareData = useShareModal((state) => state.setShareData);
  const toggleShareModal = useShareModal((state) => state.toggleShareModal);

  const HandleShare = (e: React.MouseEvent, tokenAddress: string) => {
    e.stopPropagation();
    toggleShareModal();
    setShareData({
      text: `${process.env.NEXT_PUBLIC_FRONT_END_URL}trade/${tokenAddress}`,
      title: "Check out this token!",
      url: `${process.env.NEXT_PUBLIC_FRONT_END_URL}trade/${tokenAddress}`,
      description: `Explore this  token on GetTrade.Token: ${tokenAddress}`,
    });
  };

  const key = useSolanaAuthStore((state) => state.key);
  const { data: cryptoDatas, isLoading, isError } = useWatchListData(key || "");

  const router = useRouter();

  const { mutate } = useWatchListMutate(key || "");

  const handleWatchList = useCallback(
    (e: React.MouseEvent, tokenAdd: string) => {
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

  const renderSkeletonRows = useCallback((count = 5) => {
    return Array.from({ length: count }).map((_, index) => (
      <TableRow
        key={`skeleton-${index}`}
        className="h-[clamp(36px,6vw,60px)] border-none w-full hover:bg-transparent bg-transparent"
      >
        <TableCell className="text-center">
          <div className="flex justify-center gap-2">
            <Skeleton className="h-[20px] w-[20px]" />
            <Skeleton className="h-[20px] w-[20px]" />
          </div>
        </TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Skeleton className="rounded-full w-[32px] h-[32px]" />
            <div className="flex flex-col text-left gap-1">
              <Skeleton className="w-[40px] h-[12px]" />
              <Skeleton className="w-[30px] h-[10px]" />
            </div>
          </div>
        </TableCell>
        {Array.from({ length: 2 }).map((_, i) => (
          <TableCell key={i} className="text-center">
            <Skeleton className="mx-auto h-[14px] w-[70px]" />
          </TableCell>
        ))}
        <TableCell className="text-center">
          <Skeleton className="mx-auto h-[20px] w-[80px] rounded-sm" />
        </TableCell>
        <TableCell className="text-center">
          <div className="flex gap-2 justify-center">
            <Skeleton className="h-[20px] w-[50px] rounded" />
          </div>
        </TableCell>
      </TableRow>
    ));
  }, []);

  return (
    <Dialog
      open={isWatchListModalOpen}
      onOpenChange={() => {
        toggleWatchListModal();
      }}
    >
      <DialogContent
        aria-describedby="connect you wallet modal"
        className="max-w-[860px] w-full !rounded-[18px] bg-[linear-gradient(97.9deg,_#09090E_10.36%,_#0A0A0A_91.34%)] border border-[#161936] text-white py-[4rem] px-[2rem]    "
      >
        <DialogHeader className="relative">
          {key && (
            <h1 className=" border-b border-b-[#FFFFFF1A] md:pb-[2rem] pb-[1rem]  text-[#FEFEFF] font-bold text-[28px] leading-[40px] tracking-[-2%] text-center  ">
              Watchlist
            </h1>
          )}
        </DialogHeader>
        <DialogDescription className=" max-h-[40rem] h-full overflow-y-auto  ">
          {isLoading ? (
            <Table className=" w-full ">
              <TableBody className="">{renderSkeletonRows()}</TableBody>
            </Table>
          ) : isError ? (
            "Error"
          ) : cryptoDatas?.data?.length === 0 ? (
            <div className=" flex flex-col items-center justify-center  ">
              <Image src={WatchListImage} alt="" />
              <div>
                <h2 className="font-bold text-[clamp(24px,5vw,32px)] leading-[clamp(36px,6vw,57.57px)] tracking-[-2%] text-center text-[#FEFEFF]">
                  Your Watchlist is Empty
                </h2>
              </div>
            </div>
          ) : (
            <Table>
              <TableBody>
                {cryptoDatas?.data?.map((crypto, index) => (
                  <TableRow
                    onClick={() => {
                      router.push(`/trade/${crypto.tokenAddress}`);
                      toggleWatchListModal();
                    }}
                    key={crypto.tokenAddress + index}
                    className="cursor-pointer border-t-0 border-l-0 border-r-0 border-b border-[#ffffff60] h-[70px] "
                  >
                    <TableCell className=" w-[90px]  ">
                      <div className="flex items-center gap-[clamp(4px,1vw,8px)]">
                        <button
                          onClick={(e: React.MouseEvent) =>
                            handleWatchList(e, crypto.tokenAddress)
                          }
                        >
                          <Image
                            src={crypto.name ? yellowFillStar : FillStar}
                            alt=""
                            width={24}
                            height={24}
                            className="  min-w-[clamp(14px,1.5vw,24px)] w-[clamp(14px,1.5vw,24px)] h-[clamp(14px,1.5vw,24px)]"
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
                            width={24}
                            height={24}
                            className="min-w-[clamp(14px,1.5vw,24px)] w-[clamp(14px,1.5vw,24px)] h-[clamp(14px,1.5vw,24px)]"
                          />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="  w-[220px] ">
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
                        <div className="flex flex-col gap-[clamp(1px,1vw,2px)]">
                          <span className=" text-white  font-semibold text-[clamp(10px,1vw,14px)] leading-[100%] tracking-[0%] white flex items-center gap-2 ">
                            {crypto.symbol}
                            <Image src={Pump} alt="" />
                          </span>
                          {/* <div className=" flex items-center gap-2 ">
                            <TokenStringShortener
                              originalString={crypto.tokenAddress}
                            />
                            <CopyButton
                              className="!px-[clamp(2px,4vw,4px)] h-[unset] !py-[clamp(2px,4vw,4px)] rounded-[2px] bg-transparent"
                              text={crypto.tokenAddress}
                            >
                              <div className="relative w-[clamp(14px,2vw,18px)] h-[clamp(14px,2vw,18px)]">
                                <Image src={copy} fill alt="copy" />
                              </div>
                            </CopyButton>
                          </div> */}

                          <span className=" text-[#C3C3C3] font-bold text-[clamp(8px,0.9vw,12px)] leading-[100%] tracking-[0%]">
                            {crypto.name}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    {/* <TableCell className="text-center">
                      <span className="text-white font-semibold text-[clamp(12px,0.9vw+0.5rem,14px)] leading-[100%] tracking-[0%]">
                        {formatNumber(crypto.marketCap)}
                      </span>
                    </TableCell> */}
                    <TableCell className="text-white font-semibold text-[clamp(10px,0.9vw+0.5rem,14px)] leading-[100%] tracking-[0%]">
                      {/* <TimeAgoCell dateTime={crypto.dateTime || ""} /> */}
                      {crypto.dateTime}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-white font-semibold text-[clamp(10px,0.9vw+0.5rem,14px)] leading-[100%] tracking-[0%]">
                        {formatSmallNumber(crypto.price)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-[#00FFA3] font-semibold text-[clamp(10px,0.9vw+0.5rem,14px)] leading-[100%] tracking-[0%]">
                        {formatNumber(crypto.marketCap)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        onClick={(e: React.MouseEvent) =>
                          handleWatchList(e, crypto.tokenAddress)
                        }
                      >
                        <Image
                          src={Delete}
                          alt=""
                          width={24}
                          height={24}
                          className="  min-w-[clamp(14px,1.5vw,24px)] w-[clamp(14px,1.5vw,24px)] h-[clamp(14px,1.5vw,24px)]"
                        />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

export default WachListModal;
