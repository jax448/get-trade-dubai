import { useAlertsDeleteMutate } from "@/api-lib/api-hooks/useWatchListApiHook";
import { GetAlertsType } from "@/api-lib/services/WatchListService";
import CustomToast from "@/components/CustomToast";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/Context/React-Query-Provider";
import { useSolanaAuthStore } from "@/store/auth";
import { Bell, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

function AlertList({ alert }: { alert: GetAlertsType }) {
  const key = useSolanaAuthStore((state) => state.key);
  const { mutate } = useAlertsDeleteMutate(key || "");
  const HandleDeleteAlert = (id: number) => {
    // Delete alert logic here
    mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["alerts"] });
        toast.custom((t) => {
          return (
            <CustomToast
              type="success"
              title=" Deleted Alert!  "
              description=" Alert has been Deleted successfully"
              t={t}
              onClose={() => toast.dismiss(t.id)}
            />
          );
        });
        // Handle success case
      },
      onError: (error) => {
        toast.custom((t) => {
          return (
            <CustomToast
              type="error"
              title={error.message}
              description=" Error updating watchlist"
              t={t}
              onClose={() => toast.dismiss(t.id)}
            />
          );
        });
      },
    });
  };

  

  function getNotificationMessage(price: number, liquidity: number) {
    const showPrice = price > 0;
    const showLiquidity = liquidity > 0;

    if (showPrice && showLiquidity) {
      return `Alert set! You'll be notified when the price is $${price.toLocaleString()} and liquidity is $${liquidity.toLocaleString()}.`;
    } else if (showPrice) {
      return `Alert set! You'll be notified when the price reaches $${price.toLocaleString()}.`;
    } else if (showLiquidity) {
      return `Alert set! You'll be notified when the liquidity reaches $${liquidity.toLocaleString()}.`;
    } else {
      return `Alert set! You'll be notified when new data is available.`;
    }
  }

  return (
    <div className="text-white  w-full backdrop-blur-[14.96px]">
      <div className="font-bold text-[clamp(10px,2.8vw,12.2px)] leading-[clamp(16px,4vw,19px)] tracking-[-0.02em] text-left text-[#FEFEFF] py-[clamp(1rem,2.5vw,1.2rem)] px-[clamp(1.2rem,5vw,2rem)] bg-[#F1F2FF0D] border border-[#FFFFFF1A]">
        {alert.name}/{alert.symbol}
      </div>

      <div className="flex md:items-end items-center px-[clamp(1.2rem,5vw,2rem)] py-[clamp(0.8rem,2vw,1rem)] justify-between bg-[#F1F2FF03] border border-[#FFFFFF0D] ">
        <div className="flex flex-col min-w-[200px]">
          <div className="mb-[clamp(1rem,3vw,1.6rem)] flex items-center gap-[clamp(0.3rem,1vw,0.5rem)]">
            <Bell className="text-[#00FFA3] mt-[0.125rem]" size={18} />
            <span className="text-[#00FFA3] font-medium text-[clamp(10px,3vw,13.7px)] leading-[100%]">
              Active
            </span>
          </div>
          <div className="font-normal text-[clamp(10px,4vw,16px)] leading-[clamp(20px,5vw,24px)] tracking-[-0.02em] text-start mt-1">
            {/* Alert me when price goes under{" "}
            <span className="text-[#E1414A] font-bold">$0.0007172</span> */}
            {getNotificationMessage(alert.price, alert.liquidity)}
          </div>
          {/* <div className="font-normal text-[clamp(10px,3vw,12px)] leading-[clamp(16px,4vw,18px)] tracking-[-0.02em] text-[#FFFFFF66] mt-1">
            Created 15 minutes ago
            {}
            {alert.}
          </div> */}
        </div>
        <Button
          onClick={() => HandleDeleteAlert(alert.id)}
          className=" group bg-transparent md:mb-[clamp(0.5rem,2vw,1rem)] md:mr-[clamp(0.5rem,2vw,1rem)] "
        >
          <Trash2
            className="text-[#FFFFFF99] group-hover:text-[#E1414A] cursor-pointer"
            size={18}
          />
        </Button>
      </div>
    </div>
  );
}

export default AlertList;
