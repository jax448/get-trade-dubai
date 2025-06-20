"use client";
import React, { useEffect, useState, memo } from "react";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

// Define props
interface TradingViewWidgetProps {
  symbol?: string;
  interval?:
    | "1"
    | "D"
    | "3"
    | "5"
    | "15"
    | "30"
    | "60"
    | "120"
    | "180"
    | "240"
    | "W";
  theme?: "light" | "dark";
  timezone?: "Etc/UTC" | "America/New_York" | "Europe/London" | "Asia/Tokyo";
  tokenAddress?: string;
}
interface CoinGeckoTicker {
  market: {
    name: string;
  };
  base: string;
  target: string;
}

const getSymbolFromTokenAddress = async (address: string): Promise<string | null> => {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/solana/contract/${address.toLowerCase()}`
    );
    const data = await res.json();

    const symbol = data.symbol?.toUpperCase();

    const binanceTicker = (data.tickers as CoinGeckoTicker[]).find(
      (ticker) => ticker.market.name.toLowerCase().includes("binance")
    );

    if (binanceTicker && symbol) {
      return `BINANCE:${symbol}USDT`; // Format for TradingView
    }

    return null;
  } catch (error) {
    console.error("Error fetching symbol from token address:", error);
    return null;
  }
};

function TradingViewWidget({
  symbol = "CRYPTOCAP:BTC",
  interval = "180",
  theme = "dark",
  timezone = "Etc/UTC",
  tokenAddress,
}: TradingViewWidgetProps) {
  const [resolvedSymbol, setResolvedSymbol] = useState<string>(symbol);

  useEffect(() => {
    const resolveSymbol = async () => {
      if (tokenAddress) {
        const fetchedSymbol = await getSymbolFromTokenAddress(tokenAddress);
        if (fetchedSymbol) {
          setResolvedSymbol(fetchedSymbol);
        }
      }
    };
    resolveSymbol();
  }, [tokenAddress]);

  return (
    <AdvancedRealTimeChart
      enabled_features={["symbol_info"]}
      disabled_features={["adaptive_logo", "volume_force_overlay"]}
      width={"100%"}
      interval={interval}
      timezone={timezone}
      theme={theme}
      symbol={resolvedSymbol}
      autosize
      style={"1"}
      locale={"en"}
      withdateranges={true}
      hide_side_toolbar={false}
      allow_symbol_change={true}
      calendar={false}
    />
  );
}

export default memo(TradingViewWidget);
