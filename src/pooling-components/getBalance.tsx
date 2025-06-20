"use client";
import { useGetBalance } from "@/api-lib/api-hooks/useAccountsApiHook";
import { useSolanaAuthStore } from "@/store/auth";
import React, { useState, useEffect } from "react";

function GetBalancePolling() {
  const key = useSolanaAuthStore().key;
  const address = useSolanaAuthStore().getTradePublicKey;

  const [displayValue, setDisplayValue] = useState<string>("");

  const { data, isLoading, isError } = useGetBalance(
    address || "",
    key || "",
    10000
  );

  useEffect(() => {
    if (data?.isSuccessfull && data.data) {
      setDisplayValue(data.data.balance);
    }
  }, [data]);

  if (isLoading && !displayValue) {
    return <></>;
  }

  if (isError) {
    return <>{displayValue}</>;
  }

  return <>{displayValue}</>;
}

export default GetBalancePolling;
