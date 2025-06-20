"use client";
import React from "react";
import InfoCircle from "@public/pics/info-circle.png";
import Image from "next/image";
import { useGetTokenSecurity } from "@/api-lib/api-hooks/useAccountsApiHook";

function SecurityData({ tokenAddress }: { tokenAddress: string }) {
  const { data: tokenSecurity } = useGetTokenSecurity(tokenAddress);
  const infoRows = [
    {
      label: "Mint Authority",
      value: tokenSecurity?.mintAuth ? tokenSecurity.mintAuth : "Disabled",
      valueColor: "text-[#00FFA3]",
    },
    {
      label: "Freeze Authority",
      value: tokenSecurity?.freezeAuth ? tokenSecurity.freezeAuth : "Disabled",
      valueColor: "text-[#00FFA3]",
    },
    {
      label: "LP Burned",
      value: tokenSecurity?.lpBurned ? "True" : "False",
      valueColor: "text-white",
    },
    // {
    //   label: "Pooled flavia",
    //   value: "12M $580K",
    //   valueColor: "text-white",
    // },
    // {
    //   label: "Pooled SOL",
    //   value: "3.5 $345K",
    //   valueColor: "text-white",
    // },
    {
      label: "Top 10 Holders",
      value: tokenSecurity?.top10HoldersPercent
        ? `${tokenSecurity.top10HoldersPercent.toFixed(2)}%`
        : "N/A",
      valueColor: "text-[#E1414A]",
    },
    {
      label: "CA Deployer",
      value: tokenSecurity?.caDeployer
        ? `${tokenSecurity.caDeployer.slice(
            0,
            4
          )}...${tokenSecurity.caDeployer.slice(-4)}`
        : "N/A",
      valueColor: "text-white",
    },
    {
      label: "LP Creator",
      value: tokenSecurity?.lpCreator
        ? `${tokenSecurity.lpCreator.slice(
            0,
            4
          )}...${tokenSecurity.lpCreator.slice(-4)}`
        : "N/A",
      valueColor: "text-white",
    },
    // {
    //   label: "Open Trading",
    //   value: "-",
    //   valueColor: "text-white",
    // },
  ];

  return (
    <div className="mt-[clamp(0.5rem,1vw,1rem)] w-full  rounded-[8px]">
      <div className=" rounded-tl-[8px] rounded-tr-[8px] bg-[#232323] h-[clamp(2.5rem,5vw,4.6rem)] w-full p-[clamp(0.5rem,2vw,1rem)] font-bold text-[clamp(12px,2vw,16px)] leading-[100%] tracking-[0%] flex items-center font-gilroy ">
        Data & Security
      </div>
      <div className="rounded-b-[8px] bg-[#F1F2FF0D]">
        <div className="w-full p-[clamp(1rem,3vw,2rem)]">
          <div className="space-y-[clamp(0.25rem,1vw,0.5rem)]">
            {infoRows.map((row, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-[clamp(0.25rem,1vw,0.5rem)]"
              >
                <div className="flex items-center gap-[clamp(0.25rem,1vw,0.5rem)]">
                  <Image
                    src={InfoCircle}
                    alt=""
                    className="w-[clamp(14px,2vw,18px)] h-auto"
                  />
                  <span className="text-[#CDD0E5] font-medium text-[clamp(12px,1.5vw,14px)] leading-none">
                    {row.label}
                  </span>
                </div>
                <span
                  className={`${row.valueColor} font-medium text-[clamp(12px,1.5vw,14px)] leading-none`}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SecurityData;
