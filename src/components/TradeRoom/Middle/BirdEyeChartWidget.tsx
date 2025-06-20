"use client";
import React, { memo, useMemo } from "react";

interface BirdeyeChartWidgetProps {
  tokenAddress: string;
  interval?: "1m" | "5m" | "15m" | "30m" | "1h" | "4h" | "1D";
  theme?: "dark" | "light";
  timezone?: string;
  showToolbar?: boolean;
  aspectRatio?: string;
}

function BirdeyeChartWidget({
  tokenAddress,
  interval = "1m",
  theme = "dark",
  timezone = "Asia/Singapore",
  showToolbar = true,
  aspectRatio = "22/9",
}: BirdeyeChartWidgetProps) {
  const iframeSrc = useMemo(() => {
    return `https://birdeye.so/tv-widget/${tokenAddress}?chain=solana&viewMode=pair&chartInterval=${interval}&chartType=CANDLE&chartTimezone=${encodeURIComponent(
      timezone
    )}&chartLeftToolbar=${showToolbar ? "show" : "hide"}&theme=${theme}`;
  }, [tokenAddress, interval, timezone, showToolbar, theme]);

  return (
    <div
      className="overflow-hidden h-full  "
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: aspectRatio,
        overflow: "hidden",
      }}
    >
      <iframe
        title="Birdeye Chart"
        loading="lazy"
        src={iframeSrc}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
        }}
        allowFullScreen
      />
    </div>
  );
}

export default memo(BirdeyeChartWidget);
