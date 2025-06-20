"use client";
import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FunnalFilter from "@public/pics/FunnelFilterImg.png";
import Export from "@public/pics/ShareExportImage2.png";
import Image from "next/image";
import SOlWithout from "@public/pics/WithoutCircleSolanaPic.png";
import { useGetTokenTransaction } from "@/api-lib/api-hooks/useAccountsApiHook";
import { TokenTransactionType } from "@/trade-functions/types";
import { formatNumber, formatSmallNumber } from "@/helpers/TImeLeftSlotHelpers";
import { Skeleton } from "@/components/ui/skeleton";

function TransactionTable({ tokenAddress }: { tokenAddress: string }) {
  const { data, isLoading, isError } = useGetTokenTransaction(tokenAddress);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TokenTransactionType | null;
    direction: "ascending" | "descending";
  }>({ key: "dateTime", direction: "descending" });

  // Format date for display
  const formatDate = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${month} ${day} ${hours}:${minutes}:${seconds}`;
  };

  // Handle sorting
  const handleSort = (key: keyof TokenTransactionType) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Sort and filter transactions
  const sortedTransactions = useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) return [];

    const sortableItems = [...data.data];

    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  // Table headers configuration
  const headers = [
    { label: "Date", key: "dateTime" as keyof TokenTransactionType },
    { label: "Type", key: "type" as keyof TokenTransactionType },
    { label: "Price USD", key: "priceUSD" as keyof TokenTransactionType },
    { label: "Total USD", key: "totalUSD" as keyof TokenTransactionType },
    { label: "Price SOL", key: "priceSol" as keyof TokenTransactionType },
    { label: "Amount", key: "amount" as keyof TokenTransactionType },
    { label: "Total SOL", key: "totalSol" as keyof TokenTransactionType },
    { label: "", key: null },
  ];

  if (isLoading) {
    return (
      <Table>
        <TableBody>
          {Array.from({ length: 4 }).map((_, index) => (
            <TableRow
              key={`skeleton-${index}`}
              className=" border-none h-[clamp(20px,6vw,30px)] w-full hover:bg-transparent bg-transparent"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <TableCell key={i} className="text-center">
                  <Skeleton className="mx-auto h-[14px] w-[70px]" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (isError) {
    return (
      <div className="w-full bg-[#F1F2FF0D] p-8 text-center">
        <p className="text-[#E1414A] capitalize">
          Failed to load transactions. Please try again later.
        </p>
      </div>
    );
  }

  if (!sortedTransactions.length) {
    return (
      <div className="w-full bg-[#F1F2FF0D] p-8 text-center">
        <p className="text-[#9B9B9B] capitalize">No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F1F2FF0D] relative  overflow-x-auto [&>div]:max-h-[clamp(21rem,40vh,27rem)] ">
      <Table className="border-collapse min-w-[600px] border-spacing-y-[clamp(0.5rem,1vh,1rem)] ">
        <TableHeader className="sticky z-10 top-[-2px] left-0 bg-[#1d1d23]  ">
          <TableRow className="h-[clamp(20px,3vh,24px)] border border-[#FFFFFF1A] hover:bg-transparent">
            {headers.map((header, index) => (
              <TableHead
                key={index}
                className="text-[#9B9B9B] capitalize font-bold text-[clamp(10px,1vw,12.47px)] leading-[100%] tracking-[0%] text-center py-2 px-4"
                onClick={() => (header.key ? handleSort(header.key) : null)}
              >
                <div className="flex flex-nowrap justify-center text-nowrap items-center cursor-pointer">
                  {header.label}
                  {header.key && (
                    <Image
                      src={FunnalFilter}
                      width={11}
                      height={11}
                      className="w-[clamp(8px,0.7vw,11px)] h-[clamp(8px,0.7vw,11px)] min-w-[8px,0.7vw,11px)]"
                      alt="Filter"
                    />
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTransactions.map((transaction, index) => (
            <TableRow
              key={index}
              className={`border h-[clamp(35px,5vh,41px)] border-[#FFFFFF1A] [&>td]:font-medium [&>td]:text-[clamp(12px,1vw,14px)] [&>td]:leading-[100%] [&>td]:tracking-[0%] [&>td]:text-center [&>td]:text-nowrap [&>td]:py-2 [&>td]:px-4
                ${
                  transaction.type === "buy"
                    ? "text-[#00FFA3]"
                    : "text-[#E1414A]"
                }
              `}
            >
              <TableCell>{formatDate(transaction.dateTime)}</TableCell>
              <TableCell>
                {transaction.type === "buy" ? "Buy" : "Sell"}
              </TableCell>
              <TableCell>{formatSmallNumber(transaction.priceUSD)}</TableCell>
              <TableCell>{formatNumber(transaction.totalUSD)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1 justify-center">
                  <Image
                    src={SOlWithout}
                    alt="SOL"
                    className="w-[clamp(12px,1vw,15px)] h-[clamp(10px,0.8vw,12px)] min-w-[clamp(12px,1vw,15px)]"
                  />
                  <span>{formatSmallNumber(Number(transaction.priceSol))}</span>
                </div>
              </TableCell>
              <TableCell>{formatNumber(transaction.amount)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1 justify-center">
                  <Image
                    src={SOlWithout}
                    alt="SOL"
                    className="w-[clamp(12px,1vw,15px)] h-[clamp(10px,0.8vw,12px)] min-w-[clamp(12px,1vw,15px)]"
                  />
                  <span>{transaction.totalSol.toFixed(5)}</span>
                </div>
              </TableCell>
              <TableCell>
                <button
                  className=""
                  onClick={() =>
                    window.open(
                      `https://solscan.io/tx/${transaction.txid}`,
                      "_blank"
                    )
                  }
                >
                  <Image
                    src={Export}
                    alt="View Transaction"
                    className="w-[clamp(18px,1.5vw,22px)] h-[clamp(18px,1.5vw,22px)] min-w-[clamp(18px,1.5vw,22px)] object-contain"
                  />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default TransactionTable;
