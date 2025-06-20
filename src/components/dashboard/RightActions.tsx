"use client";
import React from "react";

import seattings from "@public/pics/settings-2.png";
import shareExport from "@public/pics/ShareExportImage.png";
import Image from "next/image";
import HomeSeachComponent from "./HomeSeachComponent";
import { useShareModal } from "@/store/ShareModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const RightActions = () => {
  const toggleShareModal = useShareModal((state) => state.toggleShareModal);
  const setShareData = useShareModal((state) => state.setShareData);

  return (
    <>
      <div className="flex items-center space-x-[clamp(0.5rem,3vw,1.6rem)]">
        <HomeSeachComponent />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="lg:block hidden  text-gray-500 hover:text-gray-700">
              <div className="w-[clamp(16px,4vw,24px)] h-[clamp(16px,4vw,24px)] relative">
                <Image
                  src={seattings}
                  alt="Settings"
                  fill
                  sizes="(max-width: 768px) 24px, 24px"
                  className="object-contain ml-[clamp(0.5rem,2vw,0.5rem)]"
                />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            className="w-[260px] bg-[#28282B] rounded-[8px] p-7 border border-transparent [box-shadow:0px_-1px_4px_0px_rgba(127,_127,_127,_0.25)_inset]"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <div className=" flex items-center justify-between gap-2 ">
              <h4 className=" text-white font-normal text-[14px] leading-[100%] tracking-[0%]  ">
                Language
              </h4>
              <Select>
                <SelectTrigger className="   focus-visible:ring-0 focus-visible:ring-offset-0 border-none !h-[30px] w-[104px] bg-[#242222] !text-white [&>span]:font-normal [&>span]:text-[14px] [&>span]:leading-[100%] [&>span]:tracking-[0%] [&>span]:!overflow-[unset] ">
                  <SelectValue
                    className="text-white [&>span]:font-normal [&>span]:text-[14px] [&>span]:leading-[100%] [&>span]:tracking-[0%] [&>span]:!overflow-[unset]  "
                    placeholder="English"
                  />
                </SelectTrigger>
                <SelectContent className=" bg-black bg-opacity-80 border-none !text-white font-normal text-[14px] leading-[100%] tracking-[0%]  ">
                  <SelectItem value="English">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          className=" lg:block hidden "
          onClick={() => {
            toggleShareModal();
            setShareData({
              url: `${process.env.NEXT_PUBLIC_FRONT_END_URL}`,
              text: "",
              title: "Check out my Solana wallet!",
              description:
                "Explore my Solana assets and transactions on Phantom wallet.",
              image: "",
            });
          }}
        >
          <div className="w-[clamp(24px,7vw,46px)] h-[clamp(18px,5vw,34px)] relative">
            <Image
              src={shareExport}
              alt="Share/Export"
              fill
              sizes="(max-width: 768px) 46px, 46px"
              className="object-contain ml-[clamp(-0.5rem,-2vw,-0.375rem)]"
            />
          </div>
        </button>
      </div>
    </>
  );
};
