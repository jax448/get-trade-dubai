"use client";
import React, { memo, useCallback, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Image from "next/image";
import TokenIcon from "@public/pics/DummeyTokenIcon.png";
import Sol from "@public/pics/SOLwithBorderIcon.png";
import PumpFunLogo from "@public/pics/PumpFunTableLogo.png";
import x from "@public/pics/XTwitterIcon.svg";
import telegram from "@public/pics/telegramIcon.svg";
import globe from "@public/pics/GlobIcon.svg";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetPublicTokenData } from "@/api-lib/api-hooks/useAccountsApiHook";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber, formatSmallNumber } from "@/helpers/TImeLeftSlotHelpers";
import MainTableQuickBuyButton from "../MainTableQuickBuyButton";
import TimeAgoCell from "../TimeAgoCell";
// import TokenStringShortener from "@/helpers/TokenStringShortener";
// import { CopyButton } from "../CopyButton";
// import copy from "@public/pics/Pink-document-copy.png";
import DashBoardTableImages from "../DashBoardTableImages";
import { useSolanaAuthStore } from "@/store/auth";
// import { DashBoardTableStore } from "@/store/DashBoardTableStore";
import useNewPairsFilterString from "../../useNewPairFilterString";
import NewPairTableHeader from "./NewPairTableHeader";

type SortableField =
  | "dateTime"
  | "liquidity"
  | "marketCap"
  | "vol30m"
  | "vol1h"
  | "vol2h"
  | "vol4h"
  | "vol8h"
  | "vol24h"
  | "holders"
  | "price"
  // Add more fields as needed
  | "percent1m"
  | "percent5m"
  | "percent1h"
  | "percent6h"
  | "percent24h";

function Page() {
  const router = useRouter();

  // const getFilterString = DashBoardTableStore((s) => s.getFilterString);
  const filterString = useNewPairsFilterString();

  const key = useSolanaAuthStore((state) => state.key);

  const fetchKey = key || "";

  // Use the appropriate query hook based on the title
  const useDataHook = useGetPublicTokenData;

  const { data, isLoading, isError } = useDataHook(fetchKey, filterString);

  // Combine the query loading state with the title change loading state

  // Detect title changes and set loading state

  const [sortField, setSortField] = useState<SortableField | null>(null);

  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "none">(
    "none"
  );

  const [sortingloading, setSortingLoading] = useState(false);

  const toggleSort = useCallback(
    (field: SortableField) => {
      setSortingLoading(true);

      if (sortField === field) {
        // Cycle through states: none -> asc -> desc -> none
        setSortDirection((prev) => {
          if (prev === "none") return "asc";
          if (prev === "asc") return "desc";
          return "none"; // If it was "desc", go back to "none"
        });
      } else {
        // When switching to a new field, start with "none"
        setSortField(field);
        setSortDirection("asc");
      }

      setTimeout(() => {
        setSortingLoading(false);
      }, 100); // Simulate a delay for sorting
    },
    [sortField]
  );

  const tokenList = useMemo(() => data?.data ?? [], [data]);

  const sortedData = useMemo(() => {
    if (!sortField || sortDirection === "none") return tokenList;

    return [...tokenList].sort((a, b) => {
      // Check if the sort field is a percentage field
      const percentageFields = [
        "percent30m",
        "percent1h",
        "percent2h",
        "percent4h",
        "percent8h",
        "percent24h",
      ];

      if (percentageFields.includes(sortField)) {
        // Extract numeric values from formatted percentage strings
        const aPercentStr =
          a.buySell_Percentages[
            sortField as keyof typeof a.buySell_Percentages
          ];
        const bPercentStr =
          b.buySell_Percentages[
            sortField as keyof typeof b.buySell_Percentages
          ];
        // Extract only numeric values, ignoring B/S prefix
        const aValue = parseFloat(
          aPercentStr.replace(/^[BS]:/, "").replace("%", "")
        );
        const bValue = parseFloat(
          bPercentStr.replace(/^[BS]:/, "").replace("%", "")
        );
        // Sort just based on numeric value, ignoring B/S prefix
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      } else {
        // Regular fields in t object
        const aValue = a[sortField as keyof typeof a];
        const bValue = b[sortField as keyof typeof b];

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return 0;
      }
    });
  }, [tokenList, sortField, sortDirection]);

  const renderSkeletonRows = useCallback((count = 5) => {
    return Array.from({ length: count }).map((_, index) => (
      <React.Fragment key={`skeleton-${index}`}>
        <TableRow className="cursor-pointer hover:bg-[#1E1E1E] bg-[#F1F2FF0D] border-b-[#FFFFFF1A] font-semibold text-[clamp(8px,1.5vw,14px)] leading-[clamp(12px,3vw,18px)] tracking-[0%] h-[clamp(36px,6vw,90px)]">
          {/* Favorite Column */}
          <TableCell className="w-[clamp(40px,6vw,60px)] text-center sticky-col first-col">
            <div className="w-full flex md:flex-row flex-col items-center justify-center gap-2">
              <Skeleton className="h-[20px] w-[20px] rounded-full" />
              <Skeleton className="h-[20px] w-[20px] rounded-full" />
            </div>
          </TableCell>

          {/* Token Info Column */}
          <TableCell className="w-[clamp(80px,12vw,120px)]">
            <div className="flex items-center justify-start gap-3">
              <Skeleton className="rounded-full w-[clamp(28px,3vw,40px)] h-[clamp(28px,3vw,40px)]" />
              <div className="flex flex-col justify-start items-start py-[2px] gap-1.5">
                <Skeleton className="w-[40px] h-[12px]" />
                <div className="flex items-center justify-start gap-1.5">
                  <Skeleton className="w-[12px] h-[12px] rounded-full" />
                  <Skeleton className="w-[12px] h-[12px] rounded-full" />
                  <Skeleton className="w-[12px] h-[12px] rounded-full" />
                </div>
              </div>
            </div>
          </TableCell>

          {/* Time Ago Cell */}
          <TableCell className="w-[clamp(60px,12vw,120px)] text-center">
            <Skeleton className="mx-auto h-[14px] w-[50px]" />
          </TableCell>

          {/* Liquidity Cell */}
          <TableCell className="w-[clamp(60px,12vw,120px)] text-center">
            <Skeleton className="mx-auto h-[14px] w-[70px]" />
          </TableCell>

          {/* Market Cap Cell */}
          <TableCell className="w-[clamp(60px,12vw,120px)] text-center">
            <Skeleton className="mx-auto h-[14px] w-[70px]" />
          </TableCell>

          {/* Volume Cells with Percentage (30m, 1h, 2h, 4h, 8h, 24h) */}
          {Array.from({ length: 6 }).map((_, i) => (
            <TableCell
              key={i}
              className="w-[clamp(60px,12vw,120px)] text-center"
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Skeleton className="h-[14px] w-[30px] mr-1" />
              </div>
              <Skeleton className="mx-auto h-[14px] w-[50px]" />
            </TableCell>
          ))}

          {/* Holders Cell */}
          <TableCell className="w-[clamp(60px,12vw,120px)] text-center">
            <Skeleton className="mx-auto h-[14px] w-[50px]" />
          </TableCell>

          {/* Price Cell */}
          <TableCell className="w-[clamp(60px,12vw,120px)] text-center">
            <Skeleton className="mx-auto h-[14px] w-[70px]" />
          </TableCell>

          {/* Portfolio Cell */}
          <TableCell className="w-[clamp(60px,12vw,120px)] text-center">
            <Skeleton className="mx-auto h-[14px] w-[40px]" />
          </TableCell>

          {/* Quick Buy Button Cell */}
          <TableCell className="w-[clamp(40px,12vw,100px)] text-center end-col sticky-col">
            <Skeleton className="mx-auto md:h-[clamp(25px,4vw,30px)] md:w-[clamp(25px,10vw,80px)] h-[22px] w-[22px] md:rounded-md rounded-full " />
          </TableCell>
        </TableRow>
        <TableRow className="border-none bg-transparent h-[0.4rem] w-full" />
      </React.Fragment>
    ));
  }, []);

  return (
    <div className=" wrapper w-full h-full [&>div]:md:max-h-[calc(100vh-215px)] [&>div]:max-h-[calc(100vh-170px)] lg:mt-6 mt-2 text-white rounded-lg">
      <Table>
        <NewPairTableHeader
          sortField={sortField ? sortField : null}
          sortDirection={sortDirection}
          toggleSort={toggleSort}
        />
        <TableBody className=" ">
          {isLoading || sortingloading ? (
            renderSkeletonRows()
          ) : isError || !data?.isSuccessfull || !data?.data?.length ? (
            <TableRow className=" hover:bg-transparent bg-transparent h-full">
              <TableCell
                colSpan={17}
                className="text-center py-6 text-4xl text-red-500"
              >
                <div className="  flex items-center justify-center  ">
                  {isError
                    ? "Failed to load token data."
                    : "No token data available."}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            sortedData?.map((crypto, idx) => {
              return (
                <React.Fragment key={crypto.name + idx}>
                  <TableRow
                    onClick={() => router.push(`/trade/${crypto.tokenAddress}`)}
                    key={crypto.tokenAddress}
                    className={`cursor-pointer hover:bg-[#F1F2FF0D]    bg-[#F1F2FF0D]    border-b-[#FFFFFF1A]    font-semibold    text-[clamp(8px,1.5vw,14px)]    leading-[clamp(12px,3vw,18px)]    tracking-[0%]    h-[clamp(36px,6vw,90px)]              `}
                  >
                    <TableCell className="w-[clamp(40px,6vw,60px)] text-center sticky-col first-col">
                      <div className="w-full  flex md:flex-row flex-col items-center justify-center gap-1 ">
                        {
                          <DashBoardTableImages
                            tokenAddress={crypto.tokenAddress}
                            favourite={crypto.favourite}
                          />
                        }
                      </div>
                    </TableCell>
                    <TableCell className="w-[clamp(80px,12vw,120px)]  ">
                      <div className="flex  items-center justify-start gap-3  ">
                        <div className=" relative w-[clamp(28px,3vw,40px)] min-w-[clamp(28px,3vw,40px)] h-[clamp(28px,3vw,40px)]  ">
                          <Image
                            src={crypto.image || TokenIcon}
                            fill
                            alt=" "
                            className=" rounded-full   "
                          />
                          <Image
                            src={Sol}
                            width={14}
                            height={14}
                            className="absolute bottom-0 right-0 w-[14px] h-[14px]  "
                            alt=""
                          />
                        </div>

                        <div className=" flex flex-col justify-start items-start py-[2px]  gap-1.5 ">
                          <div className=" flex items-center space-x-3 ">
                            <span className=" truncate leading-[clamp(10px,3vw,10px)] ">
                              {crypto?.symbol
                                ? crypto.symbol.split(" ")[0]
                                : crypto?.symbol}
                            </span>
                            {crypto.source === "pump_dot_fun" && (
                              <Image
                                src={PumpFunLogo}
                                alt=""
                                className=" w-[clamp(9px,3vw,12px)] min-w-[clamp(9px,3vw,12px)] h-[clamp(11px,3vw,15px)] "
                              />
                            )}
                          </div>
                          {/* <div className="flex items-center justify-start  space-x-1  text-[10px] leading-[clamp(10px,3vw,12px)] tracking-[-2%] ">
                            <TokenStringShortener
                              originalString={crypto.tokenAddress}
                            />
                            <CopyButton
                              text={crypto.tokenAddress}
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
                          </div> */}
                          {/* Social Links Container */}
                          <div className=" flex items-center justify-start gap-1.5 ">
                            {/* X/Twitter Button */}
                            {crypto.links.twitter && (
                              <Link href={crypto.links.twitter} className="">
                                <div className="w-[clamp(6px,2.5vw,16px)] h-[clamp(6px,2.5vw,16px)] relative">
                                  <Image
                                    src={x}
                                    alt="X/Twitter Icon"
                                    fill
                                    sizes="(max-width: 768px) 16px, 16px"
                                    className="object-contain"
                                  />
                                </div>
                              </Link>
                            )}

                            {/* Telegram Link */}
                            {crypto.links.telegram && (
                              <Link href={crypto.links.telegram} className="">
                                <div className="w-[clamp(6px,2.5vw,16px)] h-[clamp(6px,2.5vw,16px)] relative">
                                  <Image
                                    src={telegram}
                                    alt="Telegram Icon"
                                    fill
                                    sizes="(max-width: 768px) 16px, 16px"
                                    className="object-contain"
                                  />
                                </div>
                              </Link>
                            )}

                            {/* Globe Link */}
                            {crypto.links.website && (
                              <Link href={crypto.links.website} className="">
                                <div className="w-[clamp(6px,2.5vw,16px)] h-[clamp(6px,2.5vw,16px)] relative">
                                  <Image
                                    src={globe}
                                    alt="Globe Icon"
                                    fill
                                    sizes="(max-width: 768px) 16px, 16px"
                                    className="object-contain"
                                  />
                                </div>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="w-[clamp(60px,12vw,120px)] text-center">
                      <TimeAgoCell dateTime={crypto.dateTime} />
                    </TableCell>
                    <TableCell className="w-[clamp(60px,12vw,120px)] text-center">
                      ${formatNumber(crypto.liquidity)}
                    </TableCell>
                    <TableCell className="w-[clamp(60px,12vw,120px)] text-center">
                      ${formatNumber(crypto.marketCap)}
                    </TableCell>
                    <TableCell className="w-[clamp(60px,12vw,120px)] text-center">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          className={`${
                            crypto.buySell_Percentages.percent1m.match("B")
                              ? "text-[#00FFA3]"
                              : "text-[#E1414A]"
                          }`}
                        >
                          {crypto.buySell_Percentages.percent1m}
                        </div>

                        {/* {(() => {
                          // Get buy and sell volumes
                          const buyVolume = Number(crypto.volBuy30mUsd);
                          const sellVolume = Number(crypto.volSell30mUsd);

                          // Calculate total volume
                          const totalVolume = buyVolume + sellVolume;

                          // Calculate percentages
                          const buyPercent =
                            totalVolume > 0
                              ? (buyVolume / totalVolume) * 100
                              : 0;
                          const sellPercent =
                            totalVolume > 0
                              ? (sellVolume / totalVolume) * 100
                              : 0;

                          // Return appropriate JSX based on which percentage is higher
                          return buyPercent >= 56 ? (
                            <div className="text-[#00FFA3]">
                              B:{buyPercent.toFixed(2)}%
                            </div>
                          ) : (
                            <div className="text-[#E1414A]">
                              S:{sellPercent.toFixed(2)}%
                            </div>
                          );
                        })()} */}
                      </div>
                      ${formatNumber(crypto.timeData.txvol1m)}
                    </TableCell>
                    <TableCell className="w-[clamp(60px,12vw,120px)] text-center">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          className={`${
                            crypto.buySell_Percentages.percent5m.match("B")
                              ? "text-[#00FFA3]"
                              : "text-[#E1414A]"
                          }`}
                        >
                          {crypto.buySell_Percentages.percent1h}
                        </div>
                      </div>
                      ${formatNumber(crypto.timeData.txvol5m)}
                    </TableCell>
                    <TableCell className="w-[clamp(60px,12vw,120px)] text-center">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          className={`${
                            crypto.buySell_Percentages.percent1h.match("B")
                              ? "text-[#00FFA3]"
                              : "text-[#E1414A]"
                          }`}
                        >
                          {crypto.buySell_Percentages.percent1h}
                        </div>
                      </div>
                      ${formatNumber(crypto.timeData.txvol1h)}
                    </TableCell>
                    <TableCell className="w-[clamp(60px,12vw,120px)] text-center">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          className={`${
                            crypto.buySell_Percentages.percent6h.match("B")
                              ? "text-[#00FFA3]"
                              : "text-[#E1414A]"
                          }`}
                        >
                          {crypto.buySell_Percentages.percent6h}
                        </div>
                      </div>
                      ${formatNumber(crypto.timeData.txvol6h)}
                    </TableCell>
                    <TableCell className="w-[clamp(60px,12vw,120px)] text-center">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          className={`${
                            crypto.buySell_Percentages.percent24h.match("B")
                              ? "text-[#00FFA3]"
                              : "text-[#E1414A]"
                          }`}
                        >
                          {crypto.buySell_Percentages.percent24h}
                        </div>
                      </div>
                      ${formatNumber(crypto.timeData.txvol24h)}
                    </TableCell>

                    <TableCell className="w-[clamp(60px,12vw,120px)] text-center">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          className={`${
                            crypto.buySell_Percentages.percent24h.match("B")
                              ? "text-[#00FFA3]"
                              : "text-[#E1414A]"
                          }`}
                        >
                          {crypto.buySell_Percentages.percent24h}
                        </div>
                      </div>
                      ${formatNumber(crypto.timeData.txvol24h)}
                    </TableCell>

                    <TableCell className="w-[clamp(60px,12vw,120px)] text-center">
                      {crypto.holders}
                    </TableCell>

                    <TableCell className="w-[clamp(60px,12vw,120px)] text-center">
                      {crypto.price === null
                        ? 0
                        : formatSmallNumber(crypto.price)}
                    </TableCell>
                    {/* this one is for portfolio */}
                    <TableCell className="w-[clamp(60px,12vw,120px)] text-center">
                      0
                    </TableCell>
                    {/* this one is for portfolio */}
                    <TableCell className="w-[clamp(60px,12vw,120px)] text-center end-col sticky-col ">
                      <MainTableQuickBuyButton
                        tokenAddress={crypto.tokenAddress}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className=" border-none bg-transparent h-[0.4rem] w-full " />
                </React.Fragment>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default memo(Page);
