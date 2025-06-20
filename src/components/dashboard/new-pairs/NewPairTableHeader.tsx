import React, { memo, useCallback } from "react";
import { TableHead, TableHeader, TableRow } from "../../ui/table";

import sortingIcon from "@public/pics/SortingTableIcons.png";
import sortingUpIcon from "@public/pics/SortingUpTableIcon.png";
import sortingDownIcon from "@public/pics/SortingDonwTableIcon.png";
import Image from "next/image";
import FunnelImage from "@public/pics/FunnelFilterImg.png";
import { DashBoardTableStore } from "@/store/NewPairTableStore";
import FilteringModal from "./NewPairsFilteringModal";
import { X } from "lucide-react";
import { Button } from "./../../ui/button";

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

type filterType =
  // | "token"
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
  | "price";

function NewPairTableHeader({
  toggleSort,
  sortField,
  sortDirection,
}: {
  toggleSort: (field: SortableField) => void;
  sortField: string | null;
  sortDirection: "asc" | "desc" | "none";
}) {
  console.log("direction right noow: ", sortDirection);

  //
  // Function to handle filter button click
  // This function is called when the filter button is clicked
  // It prevents the default behavior of the button and shows an alert with the field name

  const setIsModalOpen = DashBoardTableStore((s) => s.setIsModalOpen);
  const setSelectedFilter = DashBoardTableStore((s) => s.setSelectedFilter);
  const filteringStringObject = DashBoardTableStore(
    (s) => s.filteringStringObject
  );

  const resetFilter = DashBoardTableStore((s) => s.resetFilter);

  const handleFilterClick = (field: filterType, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the sort when clicking filter
    // setFilterString(field);
    setIsModalOpen(true);
    setSelectedFilter(field); // Set the selected filter in the store
  };

  const handleRemoveFilter = (field: filterType, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the sort when clicking filter
    resetFilter(field); // Use the resetFilter function from the store
  };

  const isFilterActive = useCallback(
    (filterType: filterType): boolean => {
      const filterValues = filteringStringObject[filterType];
      return filterValues.min !== null || filterValues.max !== null;
    },
    [filteringStringObject]
  );

  return (
    <>
      <TableHeader className="bg-[#1d1d23] sticky top-0 z-[5] border-b-[#FFFFFF1A]    ">
        <TableRow
          className={`
            font-medium 
            text-[clamp(10px,1.4vw,14px)] 
            leading-[clamp(14px,1.6vw,16.05px)] 
            tracking-[-2%] 
            h-[clamp(40px,6vw,50px)] 
            hover:bg-transparent 
            border-b-[#FFFFFF1A] 
            border-b-[0.5px] 
            text-[#9B9B9B]
            text-nowrap
          `}
        >
          <TableHead className=" text-center sticky-col first-col "></TableHead>
          <TableHead className=" text-center  ">
            <div className="flex items-center justify-start pl-4 gap-2 ">
              <span>Token</span>
              {/* <button className="relative" onClick={(e) => handleFilterClick("token", e)}>
                <Image
                  src={FunnelImage}
                  alt="Filter"
                  className="ml-2 min-w-[12px] "
                />
              </button> */}
            </div>
          </TableHead>
          <TableHead className="text-center cursor-pointer select-none  ">
            <div className="flex items-center justify-center gap-2 ">
              <button
                className="flex items-center justify-center gap-2 "
                onClick={() => toggleSort("dateTime")}
              >
                <span>Age</span>
                {sortField === "dateTime" ? (
                  sortDirection === "none" ? (
                    <Image
                      src={sortingIcon}
                      alt="No sorting"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : sortDirection === "asc" ? (
                    <Image
                      src={sortingUpIcon}
                      alt="Sort ascending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : (
                    <Image
                      src={sortingDownIcon}
                      alt="Sort descending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  )
                ) : (
                  <Image
                    src={sortingIcon}
                    alt="No sorting"
                    className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                  />
                )}
              </button>

              <button
                className="relative"
                onClick={(e) =>
                  isFilterActive("dateTime")
                    ? handleRemoveFilter("dateTime", e)
                    : handleFilterClick("dateTime", e)
                }
              >
                {isFilterActive("dateTime") && (
                  <Button
                    className="absolute !h-[unset] top-[-10px] right-[-10px] p-0 bg-transparent border-none cursor-pointer"
                    type="button"
                  >
                    <X className=" text-red-500" />
                  </Button>
                )}

                <Image
                  src={FunnelImage}
                  alt="Filter"
                  className="min-w-[clamp(10px,2vw,12px)]"
                />
              </button>
            </div>
          </TableHead>
          <TableHead className="text-center cursor-pointer select-none">
            <div className="flex items-center justify-center gap-2 ">
              <button
                className="flex items-center justify-center gap-2 "
                onClick={() => toggleSort("liquidity")}
              >
                Liq{" "}
                {sortField === "liquidity" ? (
                  sortDirection === "none" ? (
                    <Image
                      src={sortingIcon}
                      alt="No sorting"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : sortDirection === "asc" ? (
                    <Image
                      src={sortingUpIcon}
                      alt="Sort ascending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : (
                    <Image
                      src={sortingDownIcon}
                      alt="Sort descending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  )
                ) : (
                  <Image
                    src={sortingIcon}
                    alt="No sorting"
                    className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                  />
                )}
              </button>
              <button
                className="relative"
                onClick={(e) =>
                  isFilterActive("liquidity")
                    ? handleRemoveFilter("liquidity", e)
                    : handleFilterClick("liquidity", e)
                }
              >
                {isFilterActive("liquidity") && (
                  <Button
                    className="absolute !h-[unset] top-[-10px] right-[-10px] p-0 bg-transparent border-none cursor-pointer"
                    type="button"
                  >
                    <X className=" text-red-500" />
                  </Button>
                )}

                <Image
                  src={FunnelImage}
                  alt="Filter"
                  className="min-w-[clamp(10px,2vw,12px)]"
                />
              </button>
            </div>
          </TableHead>
          <TableHead className="text-center cursor-pointer select-none">
            <div className="flex items-center justify-center gap-2 ">
              <button
                className="flex items-center justify-center gap-2 "
                onClick={() => toggleSort("marketCap")}
              >
                MC{" "}
                {sortField === "marketCap" ? (
                  sortDirection === "none" ? (
                    <Image
                      src={sortingIcon}
                      alt="No sorting"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : sortDirection === "asc" ? (
                    <Image
                      src={sortingUpIcon}
                      alt="Sort ascending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : (
                    <Image
                      src={sortingDownIcon}
                      alt="Sort descending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  )
                ) : (
                  <Image
                    src={sortingIcon}
                    alt="No sorting"
                    className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                  />
                )}
              </button>
              <button
                className="relative"
                onClick={(e) =>
                  isFilterActive("marketCap")
                    ? handleRemoveFilter("marketCap", e)
                    : handleFilterClick("marketCap", e)
                }
              >
                {isFilterActive("marketCap") && (
                  <Button
                    className="absolute !h-[unset] top-[-10px] right-[-10px] p-0 bg-transparent border-none cursor-pointer"
                    type="button"
                  >
                    <X className=" text-red-500" />
                  </Button>
                )}

                <Image
                  src={FunnelImage}
                  alt="Filter"
                  className="min-w-[clamp(10px,2vw,12px)]"
                />
              </button>
            </div>
          </TableHead>
          <TableHead className="text-center cursor-pointer select-none">
            <div className="flex items-center justify-center gap-2 ">
              <button
                className="flex items-center justify-center gap-2 "
                onClick={() => toggleSort("percent1m")}
              >
                Vol 1m{" "}
                {sortField === "percent30m" ? (
                  sortDirection === "none" ? (
                    <Image
                      src={sortingIcon}
                      alt="No sorting"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : sortDirection === "asc" ? (
                    <Image
                      src={sortingUpIcon}
                      alt="Sort ascending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : (
                    <Image
                      src={sortingDownIcon}
                      alt="Sort descending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  )
                ) : (
                  <Image
                    src={sortingIcon}
                    alt="No sorting"
                    className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                  />
                )}
              </button>
              <button
                className="relative"
                onClick={(e) =>
                  isFilterActive("vol30m")
                    ? handleRemoveFilter("vol30m", e)
                    : handleFilterClick("vol30m", e)
                }
              >
                {isFilterActive("vol30m") && (
                  <Button
                    className="absolute !h-[unset] top-[-10px] right-[-10px] p-0 bg-transparent border-none cursor-pointer"
                    type="button"
                  >
                    <X className=" text-red-500" />
                  </Button>
                )}

                <Image
                  src={FunnelImage}
                  alt="Filter"
                  className="min-w-[clamp(10px,2vw,12px)]"
                />
              </button>
            </div>{" "}
          </TableHead>
          <TableHead className="text-center cursor-pointer select-none">
            <div className="flex items-center justify-center gap-2 ">
              <button
                className="flex items-center justify-center gap-2 "
                onClick={() => toggleSort("percent1h")}
              >
                Vol 1 H{" "}
                {sortField === "percent1h" ? (
                  sortDirection === "none" ? (
                    <Image
                      src={sortingIcon}
                      alt="No sorting"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : sortDirection === "asc" ? (
                    <Image
                      src={sortingUpIcon}
                      alt="Sort ascending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : (
                    <Image
                      src={sortingDownIcon}
                      alt="Sort descending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  )
                ) : (
                  <Image
                    src={sortingIcon}
                    alt="No sorting"
                    className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                  />
                )}
              </button>
              <button
                className="relative"
                onClick={(e) =>
                  isFilterActive("vol1h")
                    ? handleRemoveFilter("vol1h", e)
                    : handleFilterClick("vol1h", e)
                }
              >
                {isFilterActive("vol1h") && (
                  <Button
                    className="absolute !h-[unset] top-[-10px] right-[-10px] p-0 bg-transparent border-none cursor-pointer"
                    type="button"
                  >
                    <X className=" text-red-500" />
                  </Button>
                )}

                <Image
                  src={FunnelImage}
                  alt="Filter"
                  className="min-w-[clamp(10px,2vw,12px)]"
                />
              </button>
            </div>{" "}
          </TableHead>
          <TableHead className="text-center cursor-pointer select-none">
            <div className="flex items-center justify-center gap-2 ">
              <button
                className="flex items-center justify-center gap-2 "
                onClick={() => toggleSort("percent1h")}
              >
                Vol 2 H{" "}
                {sortField === "percent1h" ? (
                  sortDirection === "none" ? (
                    <Image
                      src={sortingIcon}
                      alt="No sorting"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : sortDirection === "asc" ? (
                    <Image
                      src={sortingUpIcon}
                      alt="Sort ascending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : (
                    <Image
                      src={sortingDownIcon}
                      alt="Sort descending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  )
                ) : (
                  <Image
                    src={sortingIcon}
                    alt="No sorting"
                    className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                  />
                )}
              </button>
              <button
                className="relative"
                onClick={(e) =>
                  isFilterActive("vol2h")
                    ? handleRemoveFilter("vol2h", e)
                    : handleFilterClick("vol2h", e)
                }
              >
                {isFilterActive("vol2h") && (
                  <Button
                    className="absolute !h-[unset] top-[-10px] right-[-10px] p-0 bg-transparent border-none cursor-pointer"
                    type="button"
                  >
                    <X className=" text-red-500" />
                  </Button>
                )}

                <Image
                  src={FunnelImage}
                  alt="Filter"
                  className="min-w-[clamp(10px,2vw,12px)]"
                />
              </button>
            </div>{" "}
          </TableHead>
          <TableHead className="text-center cursor-pointer select-none">
            <div className="flex items-center justify-center gap-2 ">
              <button
                className="flex items-center justify-center gap-2 "
                onClick={() => toggleSort("percent1m")}
              >
                Vol 4 H{" "}
                {sortField === "percent1m" ? (
                  sortDirection === "none" ? (
                    <Image
                      src={sortingIcon}
                      alt="No sorting"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : sortDirection === "asc" ? (
                    <Image
                      src={sortingUpIcon}
                      alt="Sort ascending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : (
                    <Image
                      src={sortingDownIcon}
                      alt="Sort descending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  )
                ) : (
                  <Image
                    src={sortingIcon}
                    alt="No sorting"
                    className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                  />
                )}
              </button>
              <button
                className="relative"
                onClick={(e) =>
                  isFilterActive("vol4h")
                    ? handleRemoveFilter("vol4h", e)
                    : handleFilterClick("vol4h", e)
                }
              >
                {isFilterActive("vol4h") && (
                  <Button
                    className="absolute !h-[unset] top-[-10px] right-[-10px] p-0 bg-transparent border-none cursor-pointer"
                    type="button"
                  >
                    <X className=" text-red-500" />
                  </Button>
                )}

                <Image
                  src={FunnelImage}
                  alt="Filter"
                  className="min-w-[clamp(10px,2vw,12px)]"
                />
              </button>
            </div>{" "}
          </TableHead>
          <TableHead className="text-center cursor-pointer select-none">
            <div className="flex items-center justify-center gap-2 ">
              <button
                className="flex items-center justify-center gap-2 "
                onClick={() => toggleSort("percent6h")}
              >
                Vol 8 H{" "}
                {sortField === "percent6h" ? (
                  sortDirection === "none" ? (
                    <Image
                      src={sortingIcon}
                      alt="No sorting"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : sortDirection === "asc" ? (
                    <Image
                      src={sortingUpIcon}
                      alt="Sort ascending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : (
                    <Image
                      src={sortingDownIcon}
                      alt="Sort descending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  )
                ) : (
                  <Image
                    src={sortingIcon}
                    alt="No sorting"
                    className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                  />
                )}
              </button>
              <button
                className="relative"
                onClick={(e) =>
                  isFilterActive("vol8h")
                    ? handleRemoveFilter("vol8h", e)
                    : handleFilterClick("vol8h", e)
                }
              >
                {isFilterActive("vol8h") && (
                  <Button
                    className="absolute !h-[unset] top-[-10px] right-[-10px] p-0 bg-transparent border-none cursor-pointer"
                    type="button"
                  >
                    <X className=" text-red-500" />
                  </Button>
                )}

                <Image
                  src={FunnelImage}
                  alt="Filter"
                  className="min-w-[clamp(10px,2vw,12px)]"
                />
              </button>
            </div>
          </TableHead>
          <TableHead className="text-center cursor-pointer select-none">
            <div className="flex items-center justify-center gap-2 ">
              <button
                className="flex items-center justify-center gap-2 "
                onClick={() => toggleSort("percent24h")}
              >
                Vol 24 H{" "}
                {sortField === "percent24h" ? (
                  sortDirection === "none" ? (
                    <Image
                      src={sortingIcon}
                      alt="No sorting"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : sortDirection === "asc" ? (
                    <Image
                      src={sortingUpIcon}
                      alt="Sort ascending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : (
                    <Image
                      src={sortingDownIcon}
                      alt="Sort descending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  )
                ) : (
                  <Image
                    src={sortingIcon}
                    alt="No sorting"
                    className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                  />
                )}
              </button>
              <button
                className="relative"
                onClick={(e) =>
                  isFilterActive("vol24h")
                    ? handleRemoveFilter("vol24h", e)
                    : handleFilterClick("vol24h", e)
                }
              >
                {isFilterActive("vol24h") && (
                  <Button
                    className="absolute !h-[unset] top-[-10px] right-[-10px] p-0 bg-transparent border-none cursor-pointer"
                    type="button"
                  >
                    <X className=" text-red-500" />
                  </Button>
                )}

                <Image
                  src={FunnelImage}
                  alt="Filter"
                  className="min-w-[clamp(10px,2vw,12px)]"
                />
              </button>
            </div>
          </TableHead>
          <TableHead className="text-center cursor-pointer select-none">
            <div className="flex items-center justify-center gap-2 ">
              <button
                className="flex items-center justify-center gap-2 "
                onClick={() => toggleSort("holders")}
              >
                Holders{" "}
                {sortField === "holders" ? (
                  sortDirection === "none" ? (
                    <Image
                      src={sortingIcon}
                      alt="No sorting"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : sortDirection === "asc" ? (
                    <Image
                      src={sortingUpIcon}
                      alt="Sort ascending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : (
                    <Image
                      src={sortingDownIcon}
                      alt="Sort descending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  )
                ) : (
                  <Image
                    src={sortingIcon}
                    alt="No sorting"
                    className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                  />
                )}
              </button>
              <button
                className="relative"
                onClick={(e) =>
                  isFilterActive("holders")
                    ? handleRemoveFilter("holders", e)
                    : handleFilterClick("holders", e)
                }
              >
                {isFilterActive("holders") && (
                  <Button
                    className="absolute !h-[unset] top-[-10px] right-[-10px] p-0 bg-transparent border-none cursor-pointer"
                    type="button"
                  >
                    <X className=" text-red-500" />
                  </Button>
                )}

                <Image
                  src={FunnelImage}
                  alt="Filter"
                  className="min-w-[clamp(10px,2vw,12px)]"
                />
              </button>
            </div>{" "}
          </TableHead>
          <TableHead className="w-[clamp(80px,10vw,120px)] text-center cursor-pointer select-none">
            <div className="flex items-center justify-center gap-2 ">
              <button
                className="flex items-center justify-center gap-2 "
                onClick={() => toggleSort("price")}
              >
                Price{" "}
                {sortField === "price" ? (
                  sortDirection === "none" ? (
                    <Image
                      src={sortingIcon}
                      alt="No sorting"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : sortDirection === "asc" ? (
                    <Image
                      src={sortingUpIcon}
                      alt="Sort ascending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : (
                    <Image
                      src={sortingDownIcon}
                      alt="Sort descending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  )
                ) : (
                  <Image
                    src={sortingIcon}
                    alt="No sorting"
                    className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                  />
                )}
              </button>
              <button
                className="relative"
                onClick={(e) =>
                  isFilterActive("price")
                    ? handleRemoveFilter("price", e)
                    : handleFilterClick("price", e)
                }
              >
                {isFilterActive("price") && (
                  <Button
                    className="absolute !h-[unset] top-[-10px] right-[-10px] p-0 bg-transparent border-none cursor-pointer"
                    type="button"
                  >
                    <X className=" text-red-500" />
                  </Button>
                )}
                <Image
                  src={FunnelImage}
                  alt="Filter"
                  className="min-w-[clamp(10px,2vw,12px)]"
                />
              </button>
            </div>{" "}
          </TableHead>
          {/* update the portfolio logic and design */}
          <TableHead className="w-[clamp(80px,10vw,120px)] text-center cursor-pointer select-none">
            <div className="flex items-center justify-center gap-2 ">
              <button
                className="flex items-center justify-center gap-2 "
                onClick={() => toggleSort("price")}
              >
                Portfolio{" "}
                {sortField === "price" ? (
                  sortDirection === "none" ? (
                    <Image
                      src={sortingIcon}
                      alt="No sorting"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : sortDirection === "asc" ? (
                    <Image
                      src={sortingUpIcon}
                      alt="Sort ascending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  ) : (
                    <Image
                      src={sortingDownIcon}
                      alt="Sort descending"
                      className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                    />
                  )
                ) : (
                  <Image
                    src={sortingIcon}
                    alt="No sorting"
                    className=" w-[clamp(5px,6px,6px)] h-[clamp(10px,12px,12px)]  "
                  />
                )}
              </button>
              <button
                className="relative"
                onClick={(e) =>
                  isFilterActive("price")
                    ? handleRemoveFilter("price", e)
                    : handleFilterClick("price", e)
                }
              >
                {isFilterActive("price") && (
                  <Button
                    className="absolute !h-[unset] top-[-10px] right-[-10px] p-0 bg-transparent border-none cursor-pointer"
                    type="button"
                  >
                    <X className=" text-red-500" />
                  </Button>
                )}
                <Image
                  src={FunnelImage}
                  alt="Filter"
                  className="min-w-[clamp(10px,2vw,12px)]"
                />
              </button>
            </div>{" "}
          </TableHead>
          {/* update the portfolio logic and design */}

          <TableHead className="w-[clamp(80px,10vw,120px)] text-center  end-col sticky-col  ">
            Buy<span className=" xl:inline-block hidden  ">/Sell</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <FilteringModal />
    </>
  );
}

export default memo(NewPairTableHeader);
