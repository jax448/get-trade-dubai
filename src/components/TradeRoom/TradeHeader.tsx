"use client";
import React from "react";
import Logo from "@public/pics/TokenIcon.png";
import { useSolanaAuthStore } from "@/store/auth";
import { GetTradeLogo } from "@/components/dashboard/GetTradeLogo";
import { RightActions } from "@/components/dashboard/RightActions";
import { UserMenu } from "@/components/dashboard/UserProfileDropDown";
import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import SOL from "@public/pics/SOL - Solana.png";
// import { Input } from "@/components/ui/input";
import Link from "next/link";
import SOLInputHeader from "../dashboard/SOLInputHeader";

function TradeHeader() {
  const OpenModal = useSolanaAuthStore().OpenModalFunc;
  const key = useSolanaAuthStore().key;
  return (
    <header className=" fixed top-0 left-0 right-0 z-50 mx-auto h-[clamp(60px,18vh,85px)]  bg-black  w-full md:px-[2rem] px-[1rem] flex items-center justify-center    ">
      <div className=" mx-auto px-[clamp(2px,2vw,4px)] h-[clamp(12px,4vh,16px)] flex items-center justify-between gap-[clamp(0.8rem,3vw,2.8rem)]  w-full ">
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
        <div className=" flex items-center justify-end lg:gap-16 gap-4   ">
          <div className="flex items-center justify-center gap-4 lg:w-full  ">
            {/* SOL Button */}
            <SOLInputHeader />
            {/* <div className="flex items-center space-x-[clamp(0.5rem,2vw,1rem)] bg-[#202020] rounded-[6px] px-[clamp(0.5rem,2vw,1rem)] h-[clamp(30px,6vw,34px)] flex-grow max-w-[clamp(110px,50vw,139px)] min-w-[110px] ">
              <div className="w-[clamp(23px,2.5vw,23px)] h-[clamp(23px,2.5vw,23px)] relative">
                <Image
                  src={SOL}
                  alt="SOL Icon"
                  fill
                  sizes="(max-width: 768px) 23px, 23px"
                  className="object-contain"
                />
              </div>
              <Input
                placeholder="SOL"
                type="number"
                className="bg-transparent h-[clamp(28px,6vw,34px)] !rounded-[6px] max-w-[clamp(110px,50vw,139px)] w-full  !text-[clamp(12px,2.5vw,14px)] !font-medium !leading-[100%] !tracking-[0%] border-none text-white placeholder:text-[#C3C3C3] focus-visible:ring-0 focus-visible:ring-offset-0 p-0 placeholder-[#C3C3C3] "
              />
            </div> */}

            <RightActions />
          </div>
          <div className="flex items-center justify-center gap-4  ">
            {/* Portfolio Dropdown */}
            <div className="md:flex hidden items-center space-x-1 bg-[linear-gradient(90deg,_rgba(220,_31,_255,_0.4)_0%,_rgba(76,_243,_123,_0.4)_100%)] overflow-hidden p-[1px] max-w-[clamp(80px,18vw,137px)] h-[clamp(24px,4vw,39px)] min-w-[clamp(80px,18vw,137px)] rounded-[clamp(3px,1vw,6px)]">
              <Link
                href={"/holdings"}
                className="flex items-center justify-center font-medium text-[clamp(10px,1.8vw,16px)] leading-[100%] tracking-[0%] bg-[linear-gradient(90deg,_#030303_0%,_#1E1E1E_100%)] rounded-[clamp(3px,1vw,6px)] w-full h-full text-white"
              >
                Portfolio
              </Link>
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
      </div>
      {/* <GetBalancePolling /> */}
    </header>
  );
}

export default TradeHeader;
