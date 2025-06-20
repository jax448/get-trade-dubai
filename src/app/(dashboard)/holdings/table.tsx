"use client";
import React, { memo, useCallback, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import Export from "@public/pics/ExportTableIcon.png";
import copy from "@public/pics/Pink-document-copy.png";
import BigWallet from "@public/pics/HoldingsBigWalletImg.png";
import sortingIcon from "@public/pics/SortingTableIcons.png";
import sortingUpIcon from "@public/pics/SortingUpTableIcon.png";
import sortingDownIcon from "@public/pics/SortingDonwTableIcon.png";

import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/CopyButton";
import { Skeleton } from "@/components/ui/skeleton";
import TokenStringShortener from "@/helpers/TokenStringShortener";
import { useRouter } from "next/navigation";
import { useShareModal } from "@/store/ShareModal";
import { WalletHoldings } from "@/types/apiTypes";
import { formatSmallNumber } from "@/helpers/TImeLeftSlotHelpers";
import QuickBuySellComponent from "./QuickBuySellComponent";

function HoldingTable({
  data,
  isError,
  isLoading,
}: {
  data: { data: WalletHoldings[]; isSuccessfull: boolean };
  isError: Error | undefined;
  isLoading: boolean;
}) {
  const router = useRouter();
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const toggleShareModal = useShareModal((state) => state.toggleShareModal);
  const setShareData = useShareModal((state) => state.setShareData);

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

  const toggleSort = useCallback(
    (field: string) => {
      if (sortField === field) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortDirection, sortField]
  );

  const sortedData = useMemo(() => {
    if (!data?.data || !sortField || isLoading) return data?.data || [];

    return [...data.data].sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "symbol":
          aValue = a.symbol.toLowerCase();
          bValue = b.symbol.toLowerCase();
          break;
        case "address":
          aValue = a.address.toLowerCase();
          bValue = b.address.toLowerCase();
          break;
        case "balance":
          aValue = a.balance;
          bValue = b.balance;
          break;
        default:
          return 0;
      }
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [data?.data, sortField, sortDirection, isLoading]);

  return (
    <div>
      <h2 className=" md:px-14 px-6 pt-4 pb-2 text-[#C3C3C3] font-medium text-[clamp(16px,1.2vw+1rem,20px)] leading-[100%] tracking-[0%] ">
        My Holdings
      </h2>
      <div className="w-full overflow-x-auto md:mt-10 mt-4 text-white rounded-lg">
        <Table className=" min-w-[550px]  ">
          <TableHeader className="bg-[#F1F2FF0D] border-b-[#FFFFFF1A]">
            <TableRow
              className={`
            font-medium 
            text-[clamp(10px,1.4vw,14px)] 
            leading-[clamp(14px,1.6vw,16.05px)] 
            tracking-[-2%] 
            h-[clamp(32px,6vw,50px)] 
            hover:bg-transparent 
            border-b-[#FFFFFF1A] 
            border-b-[0.5px] 
            text-[#9B9B9B]
            text-nowrap
          `}
            >
              <TableHead className="w-[clamp(20px,6vw,80px)] text-center"></TableHead>
              <TableHead
                className="w-[clamp(80px,10vw,120px)] text-center cursor-pointer select-none"
                onClick={() => toggleSort("name")}
              >
                <div className="flex items-center justify-center gap-2">
                  Name{" "}
                  {sortField === "name" ? (
                    sortDirection === "asc" ? (
                      <Image src={sortingUpIcon} alt=" " />
                    ) : (
                      <Image src={sortingDownIcon} alt=" " />
                    )
                  ) : (
                    <Image src={sortingIcon} alt=" " />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="w-[clamp(80px,10vw,120px)] text-center cursor-pointer select-none"
                onClick={() => toggleSort("symbol")}
              >
                <div className="flex items-center justify-center gap-2">
                  Token{" "}
                  {sortField === "symbol" ? (
                    sortDirection === "asc" ? (
                      <Image src={sortingUpIcon} alt=" " />
                    ) : (
                      <Image src={sortingDownIcon} alt=" " />
                    )
                  ) : (
                    <Image src={sortingIcon} alt=" " />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="w-[clamp(80px,10vw,120px)] text-center cursor-pointer select-none"
                onClick={() => toggleSort("address")}
              >
                <div className="flex items-center justify-center gap-2">
                  Wallets{" "}
                  {sortField === "address" ? (
                    sortDirection === "asc" ? (
                      <Image src={sortingUpIcon} alt=" " />
                    ) : (
                      <Image src={sortingDownIcon} alt=" " />
                    )
                  ) : (
                    <Image src={sortingIcon} alt=" " />
                  )}
                </div>
              </TableHead>
              <TableHead
                className="w-[clamp(80px,10vw,120px)] text-center cursor-pointer select-none"
                onClick={() => toggleSort("balance")}
              >
                <div className="flex items-center justify-center gap-2">
                  Invested{" "}
                  {sortField === "balance" ? (
                    sortDirection === "asc" ? (
                      <Image src={sortingUpIcon} alt=" " />
                    ) : (
                      <Image src={sortingDownIcon} alt=" " />
                    )
                  ) : (
                    <Image src={sortingIcon} alt=" " />
                  )}
                </div>
              </TableHead>
              <TableHead className="w-[clamp(80px,10vw,120px)] text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(3)].map((_, index) => (
                <TableRow
                  key={index}
                  className=" hover:bg-transparent bg-transparent border-b-[#FFFFFF1A] font-semibold text-[clamp(10px,1.4vw,14px)] leading-[clamp(14px,1.6vw,100%)] tracking-[0%] h-[clamp(50px,6vw,90px)]"
                >
                  <TableCell className="text-center">
                    <Skeleton className="h-[20px] w-[50px]" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className=" mx-auto h-[20px] w-[100px]" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className=" mx-auto h-[20px] w-[80px]" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className=" mx-auto h-[20px] w-[80px]" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className=" mx-auto h-[20px] w-[80px]" />
                  </TableCell>

                  <TableCell className="text-center">
                    <Skeleton className=" mx-auto h-[20px] w-[80px]" />
                  </TableCell>
                </TableRow>
              ))
            ) : isError || !data?.isSuccessfull || data?.data.length === 0 ? (
              <TableRow className="hover:bg-transparent bg-transparent h-full ">
                <TableCell
                  colSpan={6}
                  className="text-center  p-4 h-full font-medium text-[clamp(10px,2vw,16px)] leading-[100%] tracking-[0%]"
                >
                  {isError ? (
                    <div className=" text-red-500 h-full capitalize  w-full ">
                      Failed to load holdings.
                    </div>
                  ) : (
                    <div className=" flex flex-col items-center justify-center w-full px-4 h-full ">
                      <Image
                        src={BigWallet}
                        alt=""
                        className=" w-[clamp(60px,8vw,114px)] h-[clamp(60px,8vw,114px)] "
                      />
                      <span className=" text-white text-opacity-60 ">
                        You currently do not have any token holdings in your
                        Photon trading wallet.
                      </span>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((entry, idx) => (
                <React.Fragment key={entry.symbol + idx}>
                  <TableRow
                    className=" hover:bg-[#1E1E1E]
    bg-[#F1F2FF0D]
    border-b-[#FFFFFF1A]
    font-semibold
    text-[clamp(10px,1.4vw,14px)]
    leading-[clamp(14px,1.6vw,20px)]
    tracking-[0%]
    h-[clamp(32px,6vw,90px)]
    cursor-pointer"
                    onClick={() => router.push(`/trade/${entry.address}`)}
                  >
                    <TableCell className="w-[clamp(40px,6vw,100px)] text-center">
                      <div className="w-full px-4 flex items-center justify-center gap-6 ">
                        <Button
                          className=" bg-transparent  px-[1.2rem] "
                          onClick={(e) => HandleShare(e, entry.address)}
                        >
                          <Image
                            src={Export}
                            alt=""
                            width={24}
                            height={24}
                            className="w-[clamp(16px,3vw,24px)] min-w-[clamp(16px,3vw,24px)] h-[clamp(16px,3vw,24px)]"
                          />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <p className="text-[#CEB2E2]">{entry.name}</p>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Image
                          src={entry.logoURI}
                          alt={entry.name}
                          width={40}
                          height={40}
                          className="w-[clamp(30px,6vw,40px)] h-[clamp(30px,6vw,40px)] rounded-full"
                        />
                        <span>{entry.symbol}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-[clamp(4px,1vw,8px)]">
                        <p className="text-[#CEB2E2]">
                          <TokenStringShortener
                            originalString={entry.address}
                          />
                        </p>
                        <CopyButton
                          text={entry.address}
                          className="!px-[clamp(2px,4vw,4px)] !py-[clamp(2px,4vw,4px)] rounded-[2px] bg-transparent"
                        >
                          <div className="relative w-[clamp(14px,2vw,18px)] h-[clamp(14px,2vw,18px)]">
                            <Image src={copy} fill alt="copy" />
                          </div>
                        </CopyButton>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className=" flex items-center justify-center gap-[clamp(4px,1vw,8px)]">
                        <Image
                          src={entry.logoURI}
                          alt={""}
                          width={16}
                          height={16}
                          className="w-[clamp(12px,1.5vw,16px)] h-[clamp(12px,1.5vw,16px)] rounded-full "
                        />
                        {/* {formatNumber(entry.balance)} */}
                        {formatSmallNumber(entry.balance)}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <QuickBuySellComponent
                        tokenAddress={entry.address}
                        tokenBalance={entry.balance}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-none bg-transparent h-[0.4rem] w-full" />
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default memo(HoldingTable);
