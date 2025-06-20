"use client";
import Image from "next/image";
import React, { memo, useCallback } from "react";
import { Input } from "../ui/input";
import SOL from "@public/pics/SOL - Solana.png";
import { useQuickBuyStore } from "@/store/QuickBuy";
import { useSolanaAuthStore } from "@/store/auth";

function SOLInputHeader() {
  const amount = useQuickBuyStore((state) => state.quickBuyAmount);
  const setQuickBuyAmount = useQuickBuyStore((state) => state.setQuickBuyState);
  const key = useSolanaAuthStore((s) => s.key);
  const OpenModalFunc = useSolanaAuthStore((s) => s.OpenModalFunc);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!key) {
        OpenModalFunc();
        return;
      } else {
        const value = event.target.value;

        if (value === "") {
          setQuickBuyAmount(null);
          return;
        }
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
          setQuickBuyAmount(numericValue);
        }
      }
    },
    [setQuickBuyAmount, key, OpenModalFunc]
  );

  return (
    <div className="flex items-center space-x-[clamp(0.5rem,2vw,1rem)] min-w-[clamp(60px,12vw,110px)] bg-[#202020] rounded-[clamp(4px,1vw,6px)] px-[clamp(0.5rem,2vw,1rem)] h-[clamp(30px,6vw,39px)] flex-grow max-w-[clamp(70px,12vw,139px)]">
      <div className="w-[clamp(18px,2.5vw,23px)] h-[clamp(18px,2.5vw,23px)] relative">
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
        step="0.0000001"
        min="0.0000001"
        max="9999999"
        value={amount !== null && amount !== undefined ? amount : ""}
        onChange={handleInputChange}
        className="bg-transparent h-[clamp(30px,6vw,39px)] !rounded-[clamp(4px,1vw,6px)] max-w-[clamp(80px,45vw,139px)] w-full !text-[clamp(10px,2vw,14px)] !font-medium !leading-[100%] !tracking-[0%] border-none text-white placeholder:text-[#C3C3C3] focus-visible:ring-0 focus-visible:ring-offset-0 p-0 placeholder-[#C3C3C3]"
      />
    </div>
  );
}

export default memo(SOLInputHeader);
