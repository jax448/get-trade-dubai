import LeftSide from "@/components/TradeRoom/LeftSide";
import MiddleColumn from "@/components/TradeRoom/Middle/MiddleColumn";
import RightSideForSmallScreen from "@/components/TradeRoom/Right/SmallScreen/RightSideForSmallScreen";
import RightSide from "@/components/TradeRoom/Right/RightSide";
import { Metadata } from "next";
import React from "react";

type Props = {
  params: Promise<{ tokenAddress: string }>;
  // searchParams?: Promise<{ name: string; pair: boolean }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const id = (await params).tokenAddress;
  return {
    title: `${id}`,
  };
}

export default async function Page({ params }: Props) {
  const tokenAddress = (await params).tokenAddress;
  return (
    <div className="   w-full mx-auto flex flex-col h-screen text-white ">
      {/* Main content */}
      <div className=" xl:pb-0 pb-[6rem] mx-auto w-full justify-center flex flex-1 flex-wrap pt-[clamp(60px,18vh,85px)]  xl:overflow-hidden">
        {/* Left column - Asset list */}
        <LeftSide />

        {/* Middle column - Chart */}
        <MiddleColumn tokenAddress={tokenAddress} />

        {/* Right column - Market stats & Trading */}
        <RightSide tokenAddress={tokenAddress} />
        <RightSideForSmallScreen tokenAddress={tokenAddress} />
      </div>
    </div>
  );
}
