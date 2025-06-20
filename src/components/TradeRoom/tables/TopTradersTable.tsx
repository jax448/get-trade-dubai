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
import Image from "next/image";
import { useGetTokenTopTraders } from "@/api-lib/api-hooks/useAccountsApiHook";
import {
  TokenTopTraderstype,
  TokenTransactionType,
} from "@/trade-functions/types";
// import { formatNumber } from "@/helpers/TImeLeftSlotHelpers";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber, formatSmallNumber } from "@/helpers/TImeLeftSlotHelpers";
import { Progress } from "@/components/ui/progress";

function TopTradersTable({ tokenAddress }: { tokenAddress: string }) {
  const { data, isLoading, isError } = useGetTokenTopTraders(tokenAddress);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TokenTopTraderstype | null;
    direction: "ascending" | "descending";
  }>({ key: null, direction: "ascending" });
  const [selectedMaker, setSelectedMaker] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<
    TokenTransactionType[] | null
  >(null);

  const [showTransactions, setShowTransactions] = useState<boolean>(false);

  // Handle sorting
  const handleSort = (key: keyof TokenTopTraderstype) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Format wallet address
  const formatWalletAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Toggle maker filter
  const handleTXNS = (maker: string) => {
    if (selectedMaker === maker) {
      setSelectedMaker(null);
      setSelectedTransaction(null);
      setShowTransactions(false);
    } else {
      setSelectedMaker(maker);
      const trader = data?.data?.find((t) => t.maker === maker);
      if (trader && trader.transactions && trader.transactions.length > 0) {
        setSelectedTransaction(trader.transactions);
        setShowTransactions(true);
      } else {
        setShowTransactions(false);
        setSelectedTransaction(null);
      }
    }
  };

  // Clear maker filter
  const clearMakerFilter = () => {
    setSelectedMaker(null);
    setSelectedTransaction(null);
    setShowTransactions(false);
  };

  // Sort and filter traders
  const filteredAndSortedTraders = useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) return [];

    // First filter by selected maker if any
    let filteredItems = [...data.data];
    if (selectedMaker) {
      filteredItems = filteredItems.filter(
        (trader) => trader.maker === selectedMaker
      );
    }

    if (selectedMaker) {
      // If no transaction is selected but a wallet is, filter by wallet
      filteredItems = filteredItems.filter(
        (holder) => holder.maker === selectedMaker
      );
    }

    // Then apply sorting
    if (sortConfig.key) {
      filteredItems.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredItems;
  }, [data, sortConfig, selectedMaker]);

  // Get transactions for selected maker
  const makerTransactions = useMemo(() => {
    if (!selectedMaker || !data?.data) return [];

    const trader = data.data.find((t) => t.maker === selectedMaker);
    return trader?.transactions || [];
  }, [selectedMaker, data]);

  // Table headers configuration
  const headers = [
    { label: "No.", key: null },
    { label: "Makers", key: "maker" as keyof TokenTopTraderstype },
    { label: "Invested", key: "investedUSD" as keyof TokenTopTraderstype },
    { label: "Sold", key: "soldUSD" as keyof TokenTopTraderstype },
    { label: "PNL", key: "p_L" as keyof TokenTopTraderstype },
    { label: "Remaining", key: "investedVolume" as keyof TokenTopTraderstype },
    { label: "Balance", key: null },
    { label: "TXNS", key: null },
  ];

  // Transaction table headers
  const transactionHeaders = [
    { label: "Date" },
    { label: "Type" },
    { label: "Amount" },
    { label: "Price" },
    { label: "Total USD" },
    { label: "Total SOL" },
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
          Failed to load top traders. Please try again later.
        </p>
      </div>
    );
  }

  if (!filteredAndSortedTraders.length) {
    return (
      <div className="w-full bg-[#F1F2FF0D] p-8 text-center">
        <p className="text-[#9B9B9B] capitalize">
          {selectedMaker
            ? "No transactions found for this maker."
            : "No top traders found."}
          {selectedMaker && (
            <Button
              onClick={clearMakerFilter}
              className="ml-4 bg-transparent text-[#00FFA3] hover:bg-[#00FFA31A] border border-[#00FFA3]"
            >
              Clear filter
            </Button>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F1F2FF0D] relative overflow-y-auto overflow-x-auto ">
      {(selectedMaker || selectedTransaction) && (
        <div className="px-4 py-2 flex justify-between items-center border-b border-[#FFFFFF1A]">
          <span className="text-[#9B9B9B] capitalize text-sm">
            Filtering by maker:{" "}
            <span className="text-[#00FFA3]">
              {selectedMaker ? formatWalletAddress(selectedMaker) : ""}
            </span>
          </span>
          <Button
            onClick={clearMakerFilter}
            className="!p-2 bg-transparent h-[unset] flex items-center justify-center"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L11 11M1 11L11 1"
                stroke="#E1414A"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </Button>
        </div>
      )}

      {/* Traders Table */}
      <div className=" [&>div]:max-h-[clamp(21rem,40vh,27rem)] ">
        <Table className="border-collapse min-w-[600px] border-spacing-y-[clamp(0.5rem,1vh,1rem)]">
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
            {filteredAndSortedTraders.map((trader, index) => {
              // Calculate remaining tokens (invested - sold)
              const remainingTokens = trader.investedVolume - trader.soldVolume;
              // Determine if the trader has profit or loss
              const isProfitable = trader.p_L > 0;
              return (
                <TableRow
                  key={index}
                  className="border h-[clamp(35px,5vh,41px)] border-[#FFFFFF1A] [&>td]:font-medium [&>td]:text-[clamp(12px,1vw,14px)] [&>td]:leading-[100%] [&>td]:tracking-[0%] [&>td]:text-center [&>td]:text-nowrap [&>td]:py-2 [&>td]:px-4"
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium text-[#00FFA3]">
                    {formatWalletAddress(trader.maker)}
                  </TableCell>
                  <TableCell className="text-[#E1414A]">
                    <div className=" flex flex-col ">
                      <span>{formatNumber(trader.investedUSD)}</span>
                      <span className=" text-white ">
                        {formatNumber(trader.investedVolume)}/ {trader.tradeBuy}{" "}
                        txns
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className=" text-[#00FFA3] ">
                    <div className=" flex flex-col ">
                      <span>{formatNumber(trader.soldUSD)}</span>
                      <span className=" text-white ">
                        {formatNumber(trader.soldVolume)}/ {trader.tradeSell}{" "}
                        txns
                      </span>
                    </div>
                  </TableCell>
                  <TableCell
                    className={
                      isProfitable ? "text-[#00FFA3]" : "text-[#E1414A]"
                    }
                  >
                    {formatSmallNumber(trader.p_L)}
                  </TableCell>
                  <TableCell className="text-[#00FFA3]">
                    {formatSmallNumber(remainingTokens)}
                  </TableCell>
                  <TableCell>
                    <div className=" space-y-2 mx-auto flex flex-col items-center ">
                      <div>
                        {formatNumber(trader.investedVolume)} of{" "}
                        {formatNumber(trader.soldVolume)}
                      </div>
                      <Progress
                        className="h-[3px] w-[112px]  bg-[#9B9B9B] [&>div]:bg-[#C536F5]  "
                        value={trader.investedVolume - trader.soldVolume}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      className=" !p-2 bg-transparent h-[unset] mx-auto flex items-center justify-center "
                      onClick={() => handleTXNS(trader.maker)}
                    >
                      {selectedMaker === trader.maker ? (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 1L13 13M1 13L13 1"
                            stroke="#E1414A"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      ) : (
                        <Image
                          src={FunnalFilter}
                          width={11}
                          height={11}
                          className="w-[clamp(14px,0.7vw,18px)] h-[clamp(14px,0.7vw,18px)] min-w-[14px,0.7vw,18px)]"
                          alt="Filter"
                        />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Transaction Details Table (only visible when a maker is selected and has transactions) */}
      {showTransactions && selectedMaker && makerTransactions.length > 0 && (
        <div className="mt-4 border-t border-[#FFFFFF1A] pt-4">
          <div className="px-4 py-2 flex justify-between items-center">
            <span className="text-[#00FFA3] capitalize font-bold text-[clamp(12px,1vw,14px)]">
              Transactions for {formatWalletAddress(selectedMaker)}
            </span>
          </div>

          <Table className="border-collapse min-w-[600px] border-spacing-y-[clamp(0.5rem,1vh,1rem)]">
            <TableHeader className="sticky top-0 left-0">
              <TableRow className="h-[clamp(20px,3vh,24px)] border border-[#FFFFFF1A] hover:bg-transparent">
                {transactionHeaders.map((header, index) => (
                  <TableHead
                    key={index}
                    className="text-[#9B9B9B] capitalize font-bold text-[clamp(10px,1vw,12.47px)] leading-[100%] tracking-[0%] text-center py-2 px-4"
                  >
                    <div className="flex flex-nowrap justify-center text-nowrap items-center">
                      {header.label}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {makerTransactions.map((transaction, index) => (
                <TableRow
                  key={index}
                  className="border h-[clamp(35px,5vh,41px)] border-[#FFFFFF1A] [&>td]:font-medium [&>td]:text-[clamp(12px,1vw,14px)] [&>td]:leading-[100%] [&>td]:tracking-[0%] [&>td]:text-center [&>td]:text-nowrap [&>td]:py-2 [&>td]:px-4"
                >
                  <TableCell>{formatDate(transaction.dateTime)}</TableCell>
                  <TableCell
                    className={
                      transaction.type === "buy"
                        ? "text-[#00FFA3]"
                        : "text-[#E1414A]"
                    }
                  >
                    {transaction.type.toUpperCase()}
                  </TableCell>
                  <TableCell>{formatNumber(transaction.amount)}</TableCell>
                  <TableCell>${formatNumber(transaction.priceUSD)}</TableCell>
                  <TableCell>${formatNumber(transaction.totalUSD)}</TableCell>
                  <TableCell>
                    {formatNumber(transaction.totalSol)} SOL
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Show "No transactions" message if maker is selected but has no transactions */}
      {showTransactions && selectedMaker && makerTransactions.length === 0 && (
        <div className="mt-4 border-t border-[#FFFFFF1A] pt-4 px-4 py-2 text-center">
          <p className="text-[#9B9B9B] capitalize">
            No transactions found for this maker.
          </p>
        </div>
      )}
    </div>
  );
}

export default TopTradersTable;
