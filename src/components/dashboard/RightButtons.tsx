"use client";
import React from "react";
import { Button } from "../ui/button";
import alerIcon from "@public/pics/AlertIcon.png";
import WatchList from "@public/pics/star-plusIcon.png";
import x from "@public/pics/XTwitterIcon.svg";
import telegram from "@public/pics/telegramIcon.svg";
import globe from "@public/pics/GlobIcon.svg";
import Image from "next/image";
import { Separator } from "../ui/separator";
// import SOLInputHeader from "./SOLInputHeader";
import { useWatchListAndAlertStore } from "@/store/WachListAndAlertModals";
import Link from "next/link";
import { useSolanaAuthStore } from "@/store/auth";
import toast from "react-hot-toast";
import CustomToast from "../CustomToast";

export default function RightButtons() {
  const toggleWatchListModal = useWatchListAndAlertStore(
    (state) => state.toggleWatchListModal
  );
  const toggleAlertModal = useWatchListAndAlertStore(
    (state) => state.toggleAlertModal
  );

  const key = useSolanaAuthStore((state) => state.key);

  return (
    <>
      <div className="flex  items-center gap-[clamp(0.5rem,3vw,0.75rem)]">
        {/* Alerts Button */}
        <div className="lg:flex hidden  items-center gap-[clamp(0.5rem,3vw,0.75rem)]">
          <Button
            className="bg-[#202020] h-[34px] flex items-center justify-center gap-[clamp(0.5rem,3vw,0.75rem)] text-[#C3C3C3]
          font-medium text-[clamp(14px,2.5vw,14px)] leading-[100%] tracking-[0%]
          w-full max-w-[clamp(100px,20vw,129px)]
          px-[clamp(15px,3vw,25px)] py-[clamp(8px,2vw,12px)] rounded-[6px]"
            onClick={() => {
              if (key) toggleAlertModal();
              else {
                toast.custom((t) => {
                  return (
                    <CustomToast
                      type="error"
                      t={t}
                      title="Please attach Wallet first."
                    />
                  );
                });
              }
            }}
          >
            <div className="w-[clamp(15px,2.5vw,15px)] h-[clamp(18px,2.5vw,18px)] relative">
              <Image
                src={alerIcon}
                alt="Alerts Icon"
                fill
                sizes="(max-width: 768px) 15px, 15px"
                className="object-contain"
              />
            </div>
            Alerts
          </Button>
          {/* Watchlist Button */}
          <Button
            className="bg-[#202020] h-[34px] flex items-center justify-center gap-[clamp(0.5rem,3vw,0.5rem)] text-[#C3C3C3]
          font-medium text-[clamp(14px,2.5vw,14px)] leading-[100%] tracking-[0%]
          w-full max-w-[clamp(100px,20vw,129px)]
          px-[clamp(15px,3vw,25px)] py-[clamp(8px,2vw,12px)] rounded-[6px]"
            onClick={() => {
              if (key) toggleWatchListModal();
              else {
                toast.custom((t) => {
                  return (
                    <CustomToast
                      type="error"
                      t={t}
                      title="Please attach Wallet first."
                    />
                  );
                });
              }
            }}
          >
            <div className="w-[clamp(22px,2.5vw,22px)] min-w-[clamp(22px,2.5vw,22px)] h-[clamp(22px,2.5vw,22px)] relative">
              <Image
                src={WatchList}
                alt="Watchlist Icon"
                fill
                sizes="(max-width: 768px) 22px, 22px"
                className="object-contain"
              />
            </div>
            Watchlist
          </Button>
          {/* Social Links Container */}
          <div
            className="bg-[#202020] h-[34px] flex items-center justify-center gap-[clamp(0.5rem,3vw,0.75rem)]
          font-medium text-[clamp(14px,2.5vw,14px)] leading-[100%] tracking-[0%] text-[#C3C3C3]
          w-full max-w-[clamp(100px,20vw,129px)]
          px-[clamp(8px,2vw,12px)] rounded-[6px]"
          >
            {/* X/Twitter Button */}
            <Link
              href={"https://x.com"}
              target="_blank"
              className="h-full px-0 bg-transparent py-[clamp(8px,2vw,11px)] hover:bg-transparent"
            >
              <div className="w-[clamp(15px,2.5vw,15px)] h-[clamp(15px,2.5vw,15px)] relative">
                <Image
                  src={x}
                  alt="X/Twitter Icon"
                  fill
                  sizes="(max-width: 768px) 15px, 15px"
                  className="object-contain"
                />
              </div>
            </Link>
            <Separator orientation="vertical" className="h-8 bg-gray-600" />
            {/* Telegram Link */}
            <Link
              href={"https://telegram.org/"}
              target="_blank"
              className="h-full px-0 bg-transparent py-[clamp(8px,2vw,11px)] hover:bg-transparent"
            >
              <div className="w-[clamp(16px,2.5vw,16px)] h-[clamp(13px,2.5vw,13px)] relative">
                <Image
                  src={telegram}
                  alt="Telegram Icon"
                  fill
                  sizes="(max-width: 768px) 16px, 16px"
                  className="object-contain"
                />
              </div>
            </Link>
            <Separator orientation="vertical" className="h-8 bg-gray-600" />
            {/* Globe Link */}
            <Link
              href={"www.google.com"}
              target="_blank"
              className="h-full px-0 bg-transparent py-[clamp(8px,2vw,11px)] hover:bg-transparent"
            >
              <div className="w-[clamp(16px,2.5vw,16px)] h-[clamp(16px,2.5vw,16px)] relative">
                <Image
                  src={globe}
                  alt="Globe Icon"
                  fill
                  sizes="(max-width: 768px) 16px, 16px"
                  className="object-contain"
                />
              </div>
            </Link>
          </div>
        </div>

        {/* SOL Input */}
        {/* <SOLInputHeader /> */}
      </div>
    </>
  );
}
