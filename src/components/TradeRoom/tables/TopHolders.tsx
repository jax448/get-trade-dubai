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
import { useGetTokenHolders } from "@/api-lib/api-hooks/useAccountsApiHook";
import {
  TokenTopHoldersType,
  TokenTransactionType,
} from "@/trade-functions/types";
import { formatNumber } from "@/helpers/TImeLeftSlotHelpers";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function TopHoldersTable({ tokenAddress }: { tokenAddress: string }) {
  const { data, isLoading, isError } = useGetTokenHolders(tokenAddress);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof TokenTopHoldersType | null;
    direction: "ascending" | "descending";
  }>({ key: null, direction: "ascending" });

  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<
    TokenTransactionType[] | null
  >(null);
  const [showTransactions, setShowTransactions] = useState<boolean>(false);

  // Handle sorting
  const handleSort = (key: keyof TokenTopHoldersType) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Format wallet address
  const formatWalletAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.substring(0, 4)}...${address.substring(
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

  // Toggle wallet filter
  const handleTXNS = (wallet: string) => {
    if (selectedWallet === wallet) {
      setSelectedWallet(null);
      setSelectedTransaction(null);
      setShowTransactions(false);
    } else {
      setSelectedWallet(wallet);
      const holder = data?.data?.find((h) => h.wallet === wallet);
      if (holder && holder.transactions && holder.transactions.length > 0) {
        setSelectedTransaction(holder.transactions);
        setShowTransactions(true);
      } else {
        setSelectedTransaction(null);
        setShowTransactions(false);
      }
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedWallet(null);
    setSelectedTransaction(null);
    setShowTransactions(false);
  };

  // Sort and filter holders
  const filteredAndSortedHolders = useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) return [];

    // First filter by selected transaction if any
    let filteredItems = [...data.data];

    // if (selectedTransaction) {
    //   filteredItems = filteredItems.filter(
    //     (holder) =>
    //       holder.transactions &&
    //       selectedTransaction.some((tx) => holder.transactions.includes(tx))
    //   );
    // } else
    if (selectedWallet) {
      // If no transaction is selected but a wallet is, filter by wallet
      filteredItems = filteredItems.filter(
        (holder) => holder.wallet === selectedWallet
      );
    }

    return filteredItems;
  }, [data, selectedWallet]);

  // Get transactions for selected wallet
  const walletTransactions = useMemo(() => {
    if (!selectedWallet || !data?.data) return [];

    const holder = data.data.find((h) => h.wallet === selectedWallet);
    return holder?.transactions || [];
  }, [selectedWallet, data]);

  // Table headers configuration based on the image
  const headers = [
    { label: "Wallet", key: "wallet" as keyof TokenTopHoldersType },
    { label: "% Owned", key: "owned" as keyof TokenTopHoldersType },
    { label: "Amount", key: "amount" as keyof TokenTopHoldersType },
    { label: "Value", key: "value" as keyof TokenTopHoldersType },
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
              {Array.from({ length: 5 }).map((_, i) => (
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
          Failed to load top holders. Please try again later.
        </p>
      </div>
    );
  }

  if (!filteredAndSortedHolders.length) {
    return (
      <div className="w-full bg-[#F1F2FF0D] p-8 text-center">
        <p className="text-[#9B9B9B] capitalize   ">
          {selectedTransaction
            ? "No holders found for this transaction."
            : selectedWallet
            ? "No transactions found for this wallet."
            : "No top holders found."}
          {(selectedWallet || selectedTransaction) && (
            <Button
              onClick={clearAllFilters}
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
    <div className="w-full bg-[#F1F2FF0D] relative overflow-y-auto overflow-x-auto max-h-[clamp(21rem,40vh,27rem)]">
      {(selectedWallet || selectedTransaction) && (
        <div className="px-4 py-2 flex justify-between items-center border-b border-[#FFFFFF1A]">
          <span className="text-[#9B9B9B] capitalize text-sm">
            <>
              Filtering by wallet:{" "}
              <span className="text-[#00FFA3]">
                {formatWalletAddress(selectedWallet!)}
              </span>
            </>
          </span>
          <Button
            onClick={clearAllFilters}
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

      {/* Holders Table */}
      <div className="  [&>div]:max-h-[clamp(21rem,40vh,27rem)]  ">
        <Table className="border-collapse relative min-w-[600px]   border-spacing-y-[clamp(0.5rem,1vh,1rem)]">
          <TableHeader className="sticky z-10 top-[-2px] left-0 bg-[#1d1d23] ">
            <TableRow className="h-[clamp(20px,3vh,24px)] border border-[#FFFFFF1A] hover:bg-transparent">
              {headers.map((header, index) => (
                <TableHead
                  key={index}
                  className="text-[#9B9B9B] capitalize font-bold text-[clamp(10px,1vw,12.47px)] leading-[100%] tracking-[0%] text-center py-2 px-4"
                  onClick={() => (header.key ? handleSort(header.key) : null)}
                >
                  <div className="flex flex-nowrap justify-center text-nowrap items-center cursor-pointer">
                    {header.label}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedHolders.map((holder, index) => {
              // Check if this holder has the selected transaction
              const hasSelectedTransaction =
                selectedTransaction &&
                holder.transactions &&
                selectedTransaction.some((tx) =>
                  holder.transactions.includes(tx)
                );
              return (
                <TableRow
                  key={index}
                  className="border h-[clamp(35px,5vh,41px)] border-[#FFFFFF1A] [&>td]:font-medium [&>td]:text-[clamp(12px,1vw,14px)] [&>td]:leading-[100%] [&>td]:tracking-[0%] [&>td]:text-center [&>td]:text-nowrap [&>td]:py-2 [&>td]:px-4"
                >
                  <TableCell className="font-medium text-[#00FFA3]">
                    {formatWalletAddress(holder.wallet)}
                  </TableCell>
                  <TableCell>{holder.owned.toFixed(2)}%</TableCell>
                  <TableCell>{formatNumber(holder.amount)}</TableCell>
                  <TableCell>${formatNumber(holder.value)}</TableCell>
                  <TableCell>
                    <Button
                      className=" !p-2 bg-transparent h-[unset] mx-auto flex items-center justify-center "
                      onClick={() => handleTXNS(holder.wallet)}
                    >
                      {selectedWallet === holder.wallet ||
                      hasSelectedTransaction ? (
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

      {/* Transaction Details Table (only visible when a wallet is selected and has transactions) */}
      {showTransactions && selectedWallet && walletTransactions.length > 0 && (
        <div className="mt-4 border-t border-[#FFFFFF1A] pt-4">
          <div className="px-4 py-2 flex justify-between items-center">
            <span className="text-[#00FFA3] capitalize font-bold text-[clamp(12px,1vw,14px)]">
              Transactions for {formatWalletAddress(selectedWallet)}
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
              {walletTransactions.map((transaction, index) => (
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

      {/* Show "No transactions" message if wallet is selected but has no transactions */}
      {showTransactions &&
        selectedWallet &&
        walletTransactions.length === 0 && (
          <div className="mt-4 border-t border-[#FFFFFF1A] pt-4 px-4 py-2 text-center">
            <p className="text-[#9B9B9B] capitalize">
              No transactions found for this wallet.
            </p>
          </div>
        )}
    </div>
  );
}

export default TopHoldersTable;
