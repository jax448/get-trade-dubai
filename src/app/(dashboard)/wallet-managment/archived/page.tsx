import { Share2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import copy from "@public/pics/document-copy.svg";
import { Button } from "@/components/ui/button";

function page() {
  return (
    <div
      style={{ maxWidth: "clamp(1200px,90vw,1700px)" }}
      className=" w-full bg-[#F1F2FF0D] border border-[#FFFFFF1A]  mt-12 "
    >
      <div className=" rounded-lg  text-white">
        <table className="w-full">
          <thead>
            <tr className="h-[50px] bg-[#F1F2FF0D] border border-[#FFFFFF1A] font-medium text-[clamp(12px,1.4vw,14px)] leading-[17.09px] tracking-[-2%] text-[#9B9B9B] ">
              <th className=" text-left pl-[4rem] pb-2">Wallet</th>

              <th className="pr-[4rem]">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className=" h-[90px]  ">
              <td className=" pl-[4rem] text-[clamp(14px,1.6vw,16px)] font-semibold">
                793678764
              </td>

              <td className=" ">
                <div className=" flex justify-center space-x-2 w-full">
                  <Button className="text-[#9B9B9B] hover:text-white bg-[#FFFFFF1A] rounded-[9px] w-[40px] h-[40px] transition-colors">
                    <Image
                      src={copy}
                      alt=""
                      className="w-[clamp(20px,3vw,24px)] min-w-[clamp(20px,3vw,24px)] h-[clamp(20px,3vw,24px)]"
                    />
                  </Button>
                  <Button className="text-[#9B9B9B] hover:text-white bg-[#FFFFFF1A] rounded-[9px] w-[40px] h-[40px] transition-colors">
                    <Share2 className="w-[clamp(20px,3vw,24px)] min-w-[clamp(20px,3vw,24px)] h-[clamp(20px,3vw,24px)]" />
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default page;
