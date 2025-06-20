"use client";
import Image from "next/image";
import React from "react";
import copy from "@public/pics/document-copy.svg";
import Share from "@public/pics/ShareExportImage2.png";
import { Button } from "@/components/ui/button";
import { useSolanaAuthStore } from "@/store/auth";
import TokenStringShortener from "@/helpers/TokenStringShortener";
import { CopyButton } from "@/components/CopyButton";
import { useShareModal } from "@/store/ShareModal";
import DepositQrCode from "./deposit/DepositQrCode";

function Page() {
  const gettradePublicKey = useSolanaAuthStore(
    (state) => state.getTradePublicKey
  );

  const sharemodalopen = useShareModal((state) => state.toggleShareModal);
  const balance = useSolanaAuthStore((state) => state.balance);

  return (
    <div
      style={{ maxWidth: "clamp(1200px,90vw,1700px)" }}
      className=" w-full bg-[#F1F2FF0D] border border-[#FFFFFF1A]  mt-12 "
    >
      <div className=" rounded-lg  text-white overflow-x-auto   ">
        <table className="w-full min-w-[600px]   ">
          <thead>
            <tr className="h-[50px] bg-[#F1F2FF0D] border border-[#FFFFFF1A] font-medium text-[clamp(12px,1.4vw,14px)] leading-[17.09px] tracking-[-2%] text-[#9B9B9B] ">
              <th className=" text-left pl-[4rem] pb-2">Wallet 1</th>
              <th className="   pb-2">SOL</th>
              <th className="   pb-2">Holding</th>
              <th className="pr-[4rem]">Actions</th>
              <th className="pr-[4rem]"></th>
            </tr>
          </thead>
          <tbody>
            <tr className=" h-[90px]  ">
              <td className=" pl-[4rem] text-[clamp(14px,1.6vw,16px)] font-semibold">
                <TokenStringShortener
                  originalString={gettradePublicKey || ""}
                />
              </td>
              <td className="text-[clamp(14px,1.6vw,16px)] font-semibold text-center">
                {balance}
              </td>
              <td className="text-[clamp(14px,1.6vw,16px)] font-semibold text-center">
                0
              </td>
              <td className=" ">
                <div className=" flex justify-center space-x-2 w-full">
                  <CopyButton
                    text={gettradePublicKey || ""}
                    className="text-[#9B9B9B] hover:text-white bg-[#FFFFFF1A] rounded-[9px] min-w-[40px] w-[40px] !h-[40px] transition-colors !p-[8px]  "
                  >
                    <Image
                      src={copy}
                      alt=""
                      className="w-[clamp(20px,3vw,30px)] min-w-[clamp(20px,3vw,30px)] h-[clamp(20px,3vw,30px)]"
                    />
                  </CopyButton>
                  <Button
                    onClick={sharemodalopen}
                    className="text-white hover:text-white bg-[#FFFFFF1A] rounded-[9px] min-w-[40px] w-[40px] @h-[40px] transition-colors !p-[8px]"
                  >
                    <Image
                      src={Share}
                      alt=""
                      className="w-[clamp(14px,3vw,18px)] min-w-[clamp(14px,3vw,18px)] h-[clamp(18px,3vw,22px)]"
                    />
                    {/* <Share2 className="  w-[clamp(20px,3vw,24px)] min-w-[clamp(20px,3vw,24px)] h-[clamp(20px,3vw,24px)]" /> */}
                  </Button>
                </div>
              </td>
              <td>
                <div className=" mx-auto  my-[1rem] bg-white rounded-[6px] p-[0.4rem] w-full h-full max-w-[87px] max-h-[87px]  flex items-center justify-center  ">
                  <DepositQrCode amount={0.1} />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Page;
