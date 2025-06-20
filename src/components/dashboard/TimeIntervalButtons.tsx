import { TrendingTimeInteval } from "@/trade-functions/types";
import React, { memo, useCallback } from "react";
import { Button } from "../ui/button";
import { TrendingTableStore } from "@/store/TrendingTableStore";
import { queryClient } from "@/Context/React-Query-Provider";
import { usePathname } from "next/navigation";

const TimeIntervaliesList: { name: TrendingTimeInteval; label: string }[] = [
  { name: "1 Minute Ago", label: "1M" },
  { name: "5 Minutes Ago", label: "5M" },
  { name: "1 Hour Ago", label: "1H" },
  { name: "6 Hours Ago", label: "6H" },
  { name: "24 Hours Ago", label: "24H" },
];

function TimeIntervalButtons() {
  const setTimeIntervale = TrendingTableStore((s) => s.setTimeIntervale);
  const timeIntervale = TrendingTableStore((s) => s.timeIntervale);
  const resetAllFilters = TrendingTableStore((s) => s.resetAllFilters);
  // const title = TrendingTableStore((s) => s.title);
  const pathname = usePathname();

  const handleTimeIntervaleShit = useCallback(
    (i: TrendingTimeInteval) => {
      setTimeIntervale(i);
      resetAllFilters();
      queryClient.removeQueries({
        queryKey: ["publicTrendingTokenData"],
      });
    },
    [setTimeIntervale, resetAllFilters]
  );

  return (
    <>
      {pathname.match(/^\/$/) ? (
        <div className="flex flex-row gap-[clamp(4px,6px,8px)] items-center bg-[#202020] w-fit p-[clamp(4px,6px,10px)]  rounded-[6px] ">
          {TimeIntervaliesList.map((i, idx) => {
            return (
              <Button
                onClick={() => handleTimeIntervaleShit(i.name)}
                key={idx}
                className={` w-[clamp(24px,28px,33px)] rounded-[6px] !h-[clamp(18px,22px,26px)] text-[#FFFFFF99]  hover:bg-transparent !text-[clamp(10px,2.5vw,14px)] !leading-[100%] !tracking-[0%]  font-semibold transition-all duration-300 ease-linear   ${
                  i.name === timeIntervale
                    ? " !bg-[#DC1FFF] text-white "
                    : "bg-[#2F2F2F]  "
                }`}
              >
                {i.label}
              </Button>
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default memo(TimeIntervalButtons);
