"use client";
import { useGetWithdrawHistory } from "@/api-lib/api-hooks/useAccountsApiHook";
import { CopyButton } from "@/components/CopyButton";
import { Skeleton } from "@/components/ui/skeleton";
import TokenStringShortener from "@/helpers/TokenStringShortener";
import { useSolanaAuthStore } from "@/store/auth";
import React from "react";
import copy from "@public/pics/Pink-document-copy.png";
import Image from "next/image";
import useSearchStore from "@/store/WalletSearchFilterStore";

function WithdrawTable() {
  const gettradepublickey = useSolanaAuthStore(
    (state) => state.getTradePublicKey
  );

  const withdrawsearch = useSearchStore((state) => state.withdrawsearch);

  const key = useSolanaAuthStore((state) => state.key);
  const { data, isLoading, isError } = useGetWithdrawHistory(
    gettradepublickey || "",
    key || ""
  );

  const filteredData =
    data?.data?.filter((item) => {
      return (
        item.txId.toLowerCase().includes(withdrawsearch.toLowerCase()) ||
        item.amount.toString().includes(withdrawsearch)
      );
    }) ?? [];

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="h-[clamp(40px,5vw,50px)] bg-[#F1F2FF0D] border border-[#FFFFFF1A] font-medium text-[clamp(12px,1.4vw,14px)] leading-[clamp(16px,1.6vw,17.09px)] tracking-[-0.02em] text-[#9B9B9B]">
            <th className="text-left pl-[clamp(1rem,4vw,4rem)] lg:pb-2">
              Withdraw From
            </th>
            <th className="lg:pb-2">Withdraw To</th>
            <th className="lg:pb-2">Tx ID</th>
            <th className="lg:pb-2">Amount</th>
            <th className="lg:pb-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            // Show loading skeleton
            [...Array(3)].map((_, index) => (
              <tr key={index} className="h-[clamp(30px,5vw,90px)]">
                <td className="pl-[clamp(1rem,4vw,4rem)]">
                  <Skeleton className="h-[20px] w-[100px]" />
                </td>
                <td className="text-center">
                  <Skeleton className=" mx-auto h-[20px] w-[100px]" />
                </td>
                <td className="text-center">
                  <Skeleton className=" mx-auto h-[20px] w-[200px]" />
                </td>
                <td className="text-center">
                  <Skeleton className=" mx-auto h-[20px] w-[50px]" />
                </td>
                <td className="text-center">
                  <Skeleton className=" mx-auto h-[20px] w-[120px]" />
                </td>
              </tr>
            ))
          ) : isError || !data?.isSuccessfull || data?.data.length === 0 ? (
            // Show error or empty state
            <tr>
              <td
                colSpan={5}
                className="text-center capitalize p-4 h-[90px] text-red-500"
              >
                {isError
                  ? "Failed to load withdraw history."
                  : "No withdraw history available."}
              </td>
            </tr>
          ) : (
            // Map actual deposit history data
            filteredData
              .sort((a, b) => {
                return (
                  new Date(b.dateTime).getTime() -
                  new Date(a.dateTime).getTime()
                );
              })
              .map((entry, index) => (
                <tr key={index} className="h-[clamp(60px,6vw,90px)]">
                  <td className="pl-[clamp(1rem,4vw,4rem)] max-w-[80px] text-[clamp(10px,1.5vw,16px)] font-semibold">
                    <div className=" flex items-center justify-start gap-2 ">
                      <TokenStringShortener
                        originalString={entry.withdrawFrom}
                      />
                      <CopyButton
                        text={entry.withdrawFrom}
                        className="!p-[4px] rounded-[2px] bg-transparent"
                      >
                        <div className="relative w-[18px] h-[18px]">
                          <Image src={copy} fill alt="copy" className=" " />
                        </div>
                      </CopyButton>
                    </div>
                  </td>
                  <td className="text-[clamp(10px,1.5vw,16px)] font-semibold text-center">
                    <div className=" flex items-center justify-center gap-2 ">
                      <TokenStringShortener originalString={entry.withdrawTo} />
                      <CopyButton
                        text={entry.withdrawTo}
                        className="!p-[4px] rounded-[2px] bg-transparent"
                      >
                        <div className="relative w-[18px] h-[18px]">
                          <Image src={copy} fill alt="copy" className=" " />
                        </div>
                      </CopyButton>
                    </div>
                  </td>
                  <td className="text-[clamp(10px,1.5vw,16px)] font-semibold text-center">
                    <div className=" flex items-center justify-center gap-2 ">
                      <TokenStringShortener originalString={entry.txId} />
                      <CopyButton
                        text={entry.txId}
                        className="!p-[4px] rounded-[2px] bg-transparent"
                      >
                        <div className="relative w-[18px] h-[18px]">
                          <Image src={copy} fill alt="copy" className=" " />
                        </div>
                      </CopyButton>
                    </div>
                  </td>
                  <td className="text-[clamp(10px,1.5vw,16px)] font-semibold text-center">
                    {entry.amount}
                  </td>
                  <td className="text-[clamp(10px,1.5vw,16px)] font-semibold text-center">
                    {new Date(entry.dateTime).toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })}
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default WithdrawTable;
