import React from "react";
import { TableCell } from "../ui/table";
import Image from "next/image";

import TokenIcon from "@public/pics/DummeyTokenIcon.png";
import Sol from "@public/pics/SOLwithBorderIcon.png";
import PumpFunLogo from "@public/pics/PumpFunTableLogo.png";
// import x from "@public/pics/XTwitterIcon.svg";
// import telegram from "@public/pics/telegramIcon.svg";
// import globe from "@public/pics/GlobIcon.svg";
import TokenStringShortener from "@/helpers/TokenStringShortener";
import { CopyButton } from "../CopyButton";
import copy from "@public/pics/Pink-document-copy.png";
// import Link from "next/link";
import { SearchTokenData } from "@/trade-functions/types";
import { formatNumber } from "@/helpers/TImeLeftSlotHelpers";

function SearchedTokenItem({ token }: { token: SearchTokenData }) {
  return (
    <>
      <TableCell className="w-[clamp(80px,12vw,120px)]">
        <div className="flex  items-stretch justify-start gap-2  ">
          <div className=" relative w-[clamp(28px,3vw,40px)] min-w-[clamp(28px,3vw,40px)] h-[clamp(28px,3vw,40px)]  ">
            {token.image ? (
              <Image
                src={token.image}
                alt="Token icon"
                fill
                className="rounded-full object-cover"
                unoptimized // optionally skip optimization for external URLs
              />
            ) : (
              <Image
                src={TokenIcon}
                alt="Default icon"
                fill
                className="rounded-full"
              />
            )}

            <Image
              src={Sol}
              width={14}
              height={14}
              className="absolute bottom-0 right-0 w-[14px] h-[14px]  "
              alt=""
            />
            {/* {token.image ? (
  <Image
    src={token.image}
    alt="Token icon"
    fill
    className="rounded-full object-cover"
    unoptimized
  />
) : (
  <Image
    src={TokenIcon}
    alt="Default icon"
    fill
    className="rounded-full"
  />
)} */}
          </div>

          <div className=" flex flex-col justify-start items-start py-[2px]  gap-0 ">
            <div className=" flex items-center space-x-3 ">
              <span className="max-w-[10ch] truncate leading-[clamp(10px,3vw,10px)] text-ellipsis">
                {token?.symbol}
              </span>
              {token.chain === "pump_dot_fun" && (
                <Image
                  src={PumpFunLogo}
                  alt=""
                  className=" w-[clamp(9px,3vw,12px)] min-w-[clamp(9px,3vw,12px)] h-[clamp(11px,3vw,15px)] "
                />
              )}
            </div>
            <div className="flex items-center justify-start  space-x-1  text-[10px] leading-[clamp(10px,3vw,12px)] tracking-[-2%] ">
              <TokenStringShortener originalString={token.address} />
              <CopyButton
                text={token.address}
                className="!px-[clamp(2px,4vw,4px)] !py-[clamp(2px,4vw,2px)] rounded-[2px] bg-transparent"
              >
                <div className="relative w-[clamp(10px,2vw,12px)] h-[clamp(10px,2vw,12px)]">
                  <Image
                    src={copy}
                    fill
                    alt="copy"
                    className="brightness-[20000%]  "
                  />
                </div>
              </CopyButton>{" "}
            </div>
            {/* Social Links Container */}
            {/* <div className=" flex items-center justify-start gap-1 ">
                  {crypto.t.links.twitter && (
                    <Link href={crypto.t.links.twitter} className="">
                      <div className="w-[clamp(6px,2.5vw,12px)] h-[clamp(6px,2.5vw,12px)] relative">
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

                  {crypto.t.links.telegram && (
                    <Link href={crypto.t.links.telegram} className="">
                      <div className="w-[clamp(6px,2.5vw,12px)] h-[clamp(6px,2.5vw,12px)] relative">
                        <Image
                          src={telegram}
                          alt="Telegram Icon"
                          fill
                          sizes="(max-width: 768px) 12px, 12px"
                          className="object-contain"
                        />
                      </div>
                    </Link>
                  )}

                  {crypto.t.links.website && (
                    <Link href={crypto.t.links.website} className="">
                      <div className="w-[clamp(6px,2.5vw,12px)] h-[clamp(6px,2.5vw,12px)] relative">
                        <Image
                          src={globe}
                          alt="Globe Icon"
                          fill
                          sizes="(max-width: 768px) 12px, 12px"
                          className="object-contain"
                        />
                      </div>
                    </Link>
                  )}
                </div> */}
          </div>
        </div>
      </TableCell>
      <TableCell className="w-[clamp(80px,12vw,120px)] ">
        {token.createdTime}
      </TableCell>
      <TableCell className="w-[clamp(80px,12vw,120px)] ">
        {formatNumber(token.price)}
      </TableCell>
      {/* <TableCell className="w-[clamp(80px,12vw,120px)] ">
        {formatPrice(token.)}
      </TableCell>
      <TableCell className="w-[clamp(80px,12vw,120px)] ">
        {formatPrice(token.total_volume)}
      </TableCell> */}
    </>
  );
}

export default SearchedTokenItem;
