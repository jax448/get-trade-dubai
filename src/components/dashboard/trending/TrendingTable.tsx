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
import { useGetTrendingTokenData } from "@/api-lib/api-hooks/useAccountsApiHook";
import { Skeleton } from "../../ui/skeleton";
import { formatNumber, formatSmallNumber } from "@/helpers/TImeLeftSlotHelpers";
import MainTableQuickBuyButton from "../MainTableQuickBuyButton";
import TimeAgoCell from "../TimeAgoCell";
// import TokenStringShortener from "@/helpers/TokenStringShortener";
// import { CopyButton } from "../CopyButton";
// import copy from "@public/pics/Pink-document-copy.png";
import DashBoardTableImages from "../DashBoardTableImages";
import { useSolanaAuthStore } from "@/store/auth";
// import { DashBoardTableStore } from "@/store/DashBoardTableStore";
import TrendingTableHeader from "./TrendingTableHeader";
// import { TrendingTableStore } from "@/store/TrendingTableStore";
// import { TrendingTimeInteval } from "@/trade-functions/types";
import useTrendingFilterString from "@/components/useTrendingFilterString";

type SortableField =
  | "dateTime"
  | "liquidity"
  | "marketCap"
  | "holders"
  | "price"
  // for volumes
  | "txvol1m"
  | "txvol5m"
  | "txvol1h"
  | "txvol6h"
  | "txvol24h"
  // Add more fields as needed
  | "percent1m"
  | "percent5m"
  | "percent1h"
  | "percent6h"
  | "percent24h"
  // percentage chagen on price i think
  | "priceChange1min"
  | "priceChange5min"
  | "priceChange1h"
  | "priceChange6h"
  | "priceChange24h";

function Page() {
  const router = useRouter();

  // const timeIntervale = TrendingTableStore((s) => s.timeIntervale);

  // const getFilterString = DashBoardTableStore((s) => s.getFilterString);
  const filterString = useTrendingFilterString();

  const key = useSolanaAuthStore((state) => state.key);

  const fetchKey = key || "";

  // Use the appropriate query hook based on the title
  const useDataHook = useGetTrendingTokenData;

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
      const percentageFields = [
        "percent1m",
        "percent5m",
        "percent1h",
        "percent6h",
        "percent24h",
      ];
      // change this one for other percentage values
      const transactionFields = [
        "transactions1m",
        "transactions5m",
        "transactions1h",
        "transactions6h",
        "transactions24h",
      ];

      if (percentageFields.includes(sortField)) {
        const aPercentStr = a.dataRate[sortField as keyof typeof a.dataRate];
        const bPercentStr = b.dataRate[sortField as keyof typeof b.dataRate];

        const aValue = parseFloat(
          String(aPercentStr ?? "")
            .replace(/^[BS]:/, "")
            .replace("%", "")
        );
        const bValue = parseFloat(
          String(bPercentStr ?? "")
            .replace(/^[BS]:/, "")
            .replace("%", "")
        );

        return sortDirection === "asc"
          ? (Number(aValue) || 0) - (Number(bValue) || 0)
          : (Number(bValue) || 0) - (Number(aValue) || 0);
      } else if (transactionFields.includes(sortField)) {
        const aValue = a[sortField as keyof typeof a] ?? 0;
        const bValue = b[sortField as keyof typeof b] ?? 0;

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }
        return 0; // Ensure a fallback return value
      } else {
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
        return 0; // Ensure a fallback return value
      }
    });
  }, [tokenList, sortField, sortDirection]);

  const intervals = useMemo(() => ["1m", "5m", "1h", "6h", "24h"], []);
  const PercentageInterval = useMemo(
    () => ["1min", "5min", "1h", "6h", "24h"],
    []
  );

  const renderSkeletonRows = useCallback(
    (count = 5) => {
      return Array.from({ length: count }).map((_, index) => (
        <React.Fragment key={`skeleton-${index}`}>
          <TableRow className="cursor-pointer hover:bg-[#1E1E1E] bg-[#F1F2FF0D] border-b-[#FFFFFF1A] font-semibold text-[clamp(8px,1.5vw,14px)] leading-[clamp(12px,3vw,18px)] tracking-[0%] h-[clamp(36px,6vw,90px)]">
            {/* Star/Favorite Column */}
            <TableCell className="w-[clamp(40px,6vw,60px)] text-center sticky-col first-col">
              <div className="w-full flex md:flex-row flex-col items-center justify-center gap-2">
                <Skeleton className="h-[clamp(14px,2vw,20px)] w-[clamp(14px,2vw,20px)] rounded-full" />
                <Skeleton className="h-[clamp(14px,2vw,20px)] w-[clamp(14px,2vw,20px)] rounded-full" />
              </div>
            </TableCell>

            {/* Token Info Column */}
            <TableCell className="w-[clamp(100px,12vw,120px)]">
              <div className="flex items-center justify-start gap-3">
                <div className="relative w-[clamp(28px,3vw,40px)] min-w-[clamp(28px,3vw,40px)] h-[clamp(28px,3vw,40px)]">
                  <Skeleton className="absolute inset-0 rounded-full" />
                  <Skeleton className="absolute bottom-0 right-0 w-[14px] h-[14px] rounded-full" />
                </div>
                <div className="flex flex-col justify-start items-start py-[2px] gap-1.5">
                  <Skeleton className="w-[clamp(30px,5vw,50px)] h-[clamp(10px,1.5vw,12px)]" />
                  <div className="flex items-center justify-start gap-1.5">
                    <Skeleton className="w-[clamp(6px,2.5vw,16px)] h-[clamp(6px,2.5vw,16px)] rounded-full" />
                    <Skeleton className="w-[clamp(6px,2.5vw,16px)] h-[clamp(6px,2.5vw,16px)] rounded-full" />
                    <Skeleton className="w-[clamp(6px,2.5vw,16px)] h-[clamp(6px,2.5vw,16px)] rounded-full" />
                  </div>
                </div>
              </div>
            </TableCell>

            {/* Time Ago Column */}
            <TableCell className="w-[clamp(60px,12vw,120px)] text-center">
              <Skeleton className="mx-auto h-[clamp(10px,1.5vw,14px)] w-[clamp(40px,8vw,70px)]" />
            </TableCell>

            {/* Liquidity Column */}
            <TableCell className="w-[clamp(60px,12vw,120px)] text-center">
              <Skeleton className="mx-auto h-[clamp(10px,1.5vw,14px)] w-[clamp(40px,8vw,70px)]" />
            </TableCell>

            {/* Market Cap Column */}
            <TableCell className="w-[clamp(60px,12vw,120px)] text-center">
              <Skeleton className="mx-auto h-[clamp(10px,1.5vw,14px)] w-[clamp(40px,8vw,70px)]" />
            </TableCell>

            {Array.from({ length: intervals.length }).map((_, idx) => (
              <TableCell
                key={`interval-${idx}`}
                className="w-[clamp(60px,12vw,120px)] text-center"
              >
                <div className="flex justify-center">
                  <Skeleton className="h-[14px] w-[50px] mb-1" />
                </div>
                <Skeleton className="mx-auto h-[12px] w-[60px]" />
              </TableCell>
            ))}

            {/* Create multiple percentage interval columns to match the real content */}
            {Array.from({ length: PercentageInterval.length }).map((_, idx) => (
              <TableCell
                key={`percentage-${idx}`}
                className="w-[clamp(60px,12vw,120px)] text-center"
              >
                <Skeleton className="mx-auto h-[14px] w-[70px]" />
              </TableCell>
            ))}

            {/* Transactions 24h Column */}
            <TableCell className="w-[clamp(60px,12vw,120px)] text-center">
              <Skeleton className="mx-auto h-[14px] w-[50px]" />
            </TableCell>

            {/* Holders Column */}
            <TableCell className="w-[clamp(60px,12vw,120px)] text-center">
              <Skeleton className="mx-auto h-[clamp(10px,1.5vw,14px)] w-[clamp(30px,6vw,50px)]" />
            </TableCell>

            {/* Price Column */}
            <TableCell className="w-[clamp(60px,12vw,120px)] text-center">
              <Skeleton className="mx-auto h-[clamp(10px,1.5vw,14px)] w-[clamp(40px,8vw,70px)]" />
            </TableCell>

            {/* Portfolio Column */}
            <TableCell className="w-[clamp(60px,12vw,120px)] text-center">
              <Skeleton className="mx-auto h-[clamp(10px,1.5vw,14px)] w-[clamp(10px,3vw,30px)]" />
            </TableCell>

            {/* Buy Button Column */}
            <TableCell className="w-[clamp(40px,12vw,100px)] text-center end-col sticky-col">
              <Skeleton className="mx-auto md:h-[clamp(25px,4vw,30px)] md:w-[clamp(25px,10vw,80px)] h-[22px] w-[22px] md:rounded-md rounded-full " />
            </TableCell>
          </TableRow>
          <TableRow className="border-none bg-transparent h-[0.4rem] w-full" />
        </React.Fragment>
      ));
    },
    [intervals, PercentageInterval]
  );

  // function getShortTimeInterval(timeInterval: TrendingTimeInteval): string {
  //   switch (timeInterval) {
  //     case "1 Minute Ago":
  //       return "1m";
  //     case "5 Minutes Ago":
  //       return "5m";
  //     case "1 Hour Ago":
  //       return "1h";
  //     case "6 Hours Ago":
  //       return "6h";
  //     case "24 Hours Ago":
  //       return "24h";
  //     default:
  //       return ""; // fallback in case of unexpected value
  //   }
  // }

  return (
    <div className=" wrapper w-full h-full [&>div]:md:max-h-[calc(100vh-215px)] [&>div]:max-h-[calc(100vh-170px)] lg:mt-6 mt-2 text-white rounded-lg">
      <Table>
        <TrendingTableHeader
          sortField={sortField ? sortField : null}
          sortDirection={sortDirection}
          toggleSort={toggleSort}
        />
        <TableBody className=" ">
          {isLoading || sortingloading ? (
            renderSkeletonRows()
          ) : isError || !data?.isSuccessfull || !data?.data?.length ? (
            <TableRow className="hover:bg-transparent bg-transparent h-full">
              <TableCell
                colSpan={17}
                className="text-center py-6 text-4xl text-red-500"
              >
                <div className="flex items-center justify-center">
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
                    {/* for transaction */}
                    {intervals.map((intv) => {
                      // Helper to get matching keys
                      const getVolumeKey = (interval: string) =>
                        `txvol${interval}`;
                      const getRateKey = (interval: string) =>
                        `percent${interval}`;

                      const volume =
                        crypto.volumes[
                          getVolumeKey(intv) as keyof typeof crypto.volumes
                        ];
                      const rate =
                        crypto.dataRate[
                          getRateKey(intv) as keyof typeof crypto.dataRate
                        ];

                      const isBuy =
                        typeof rate === "string" && rate.startsWith("B");
                      const textColor = isBuy
                        ? "text-[#00FFA3]"
                        : "text-[#E1414A]";

                      return (
                        <TableCell
                          key={intv}
                          className="w-[clamp(60px,12vw,120px)] text-center"
                        >
                          <div className="flex justify-center">
                            <div className={textColor}>{rate}</div>
                          </div>
                          {!volume
                            ? "--"
                            : typeof volume === "number" && (
                                <>${formatNumber(volume)}</>
                              )}
                        </TableCell>
                      );
                    })}

                    {PercentageInterval.map((intv) => {
                      // Helper to get matching keys
                      const getPricePercentageKey = (interval: string) =>
                        `priceChange${interval}`;

                      const PricePercentage =
                        crypto.pricePercentages[
                          getPricePercentageKey(
                            intv
                          ) as keyof typeof crypto.pricePercentages
                        ];

                      return (
                        <TableCell
                          key={intv}
                          className="w-[clamp(60px,12vw,120px)] text-center"
                        >
                          {!PricePercentage
                            ? "--"
                            : typeof PricePercentage === "number" && (
                                <>${formatNumber(PricePercentage)}</>
                              )}
                        </TableCell>
                      );
                    })}

                    {/* <TableCell className="w-[clamp(60px,12vw,120px)] text-center">
                      {(() => {
                        const shortInterval = getShortTimeInterval(
                          timeIntervale
                        ) as TimeInterval;

                        const TransactionsKey =
                          `transactions${shortInterval}` as keyof FlattenedTimeData;

                        const TransactionsValue =
                          crypto.timeData[TransactionsKey];

                        const volBuyKey =
                          `txvolBuy${shortInterval}` as keyof FlattenedTimeData;
                        const volumeBuy = crypto.timeData[volBuyKey];

                        const volSellKey =
                          `txvolSell${shortInterval}` as keyof FlattenedTimeData;
                        const volumeSell = crypto.timeData[volSellKey];

                        if (!TransactionsValue) return null;

                        return (
                          <>
                            <div className="flex justify-center">
                              <div>
                                {typeof TransactionsValue === "number" &&
                                  formatNumber(TransactionsValue)}
                              </div>
                            </div>
                            <div>
                              <span className=" text-[#00FFA3] ">
                                $
                                {typeof volumeBuy === "number" &&
                                  formatNumber(volumeBuy)}
                              </span>{" "}
                              /{" "}
                              <span className=" text-[#E1414A]  ">
                                $
                                {typeof volumeSell === "number" &&
                                  formatNumber(volumeSell)}
                              </span>
                            </div>
                          </>
                        );
                      })()}
                    </TableCell> */}

                    {/* for volume */}
                    {/* <TableCell className="w-[clamp(60px,12vw,120px)] text-center">
                      {(() => {
                        const shortInterval = getShortTimeInterval(
                          timeIntervale
                        ) as TimeInterval;
                        const percentKey =
                          `percent${shortInterval}` as keyof FlattenedTimeData;
                        const percentValue = crypto.timeData[percentKey];

                        const volKey =
                          `txvol${shortInterval}` as keyof FlattenedTimeData;
                        const volume = crypto.timeData[volKey];

                        if (!percentValue) return null;

                        const isBuy =
                          typeof percentValue === "string" &&
                          percentValue.startsWith("B");
                        const textColor = isBuy
                          ? "text-[#00FFA3]"
                          : "text-[#E1414A]";

                        return (
                          <>
                            <div className="flex justify-center">
                              <div className={textColor}>{percentValue}</div>
                            </div>
                            {!volume
                              ? "--"
                              : typeof volume === "number" && (
                                  <>${formatNumber(volume)}</>
                                )}
                          </>
                        );
                      })()}
                    </TableCell> */}

                    <TableCell className="w-[clamp(60px,12vw,120px)] text-center">
                      {crypto.transactions24h}
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
                    <TableCell className="w-[clamp(60px,12vw,100px)] text-center end-col sticky-col ">
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
