import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

import shareExport from "@public/pics/DropDownShareIcon.png";

import dropwodnsetting from "@public/pics/DropdownSetting.png";
import dropwodnwallet from "@public/pics/Dropdownwallet.png";
import dropwodnlogout from "@public/pics/Dropdownlogout.png";
// import ProfileIcon from "@public/pics/DropdownProfileIcon.png";
import { useSolanaAuthStore } from "@/store/auth";
import { dropdownVariants } from "@/constants/FramerMotionVariations";
import { useGetBalanceWithoutPooling } from "@/api-lib/api-hooks/useAccountsApiHook";
import { Skeleton } from "../ui/skeleton";
import { Separator } from "@radix-ui/react-separator";

import alerIcon from "@public/pics/DropDownBellIcon.png";
import WatchList from "@public/pics/DropDownWatchlistIcon.png";
import x from "@public/pics/XTwitterIcon.svg";
import telegram from "@public/pics/telegramIcon.svg";
import globe from "@public/pics/GlobIcon.svg";
import { useWatchListAndAlertStore } from "@/store/WachListAndAlertModals";
import { usePathname } from "next/navigation";
import { useQuickBuyStore } from "@/store/QuickBuy";
import { useShareModal } from "@/store/ShareModal";

// UserMenu - Memoized
export const UserMenu = memo(function UserMenu() {
  const pathname = usePathname();
  const getTradePublicKey = useSolanaAuthStore(
    (state) => state.getTradePublicKey
  );
  const key = useSolanaAuthStore((state) => state.key);

  const setBalance = useSolanaAuthStore((state) => state.setBalance);

  const {
    data: BalanceData,
    isLoading,
    isError,
  } = useGetBalanceWithoutPooling(getTradePublicKey || "", key || "");

  useEffect(() => {
    setBalance(BalanceData?.data.balance || "0");
  }, [BalanceData?.data.balance, setBalance]);

  const disconnet = useSolanaAuthStore().disconnect;
  const removeQuickBuyState = useQuickBuyStore(
    (sta) => sta.removeQuickBuyState
  );
  const [showUser, setShowUser] = useState(false);
  const MotionButton = motion(Button);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const toggleAlertModal = useWatchListAndAlertStore(
    (state) => state.toggleAlertModal
  );
  const toggleWatchListModal = useWatchListAndAlertStore(
    (state) => state.toggleWatchListModal
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUser(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowUser]);

  const memoizedImages = useMemo(
    () => ({
      dropwodnsetting: <Image alt={""} src={dropwodnsetting} fill priority />,
      dropwodnwallet: <Image alt={""} src={dropwodnwallet} fill priority />,
      dropwodnlogout: <Image alt={""} src={dropwodnlogout} fill priority />,
      dropwodnalerIcon: <Image alt={""} src={alerIcon} fill priority />,
      dropwodnWatchList: <Image alt={""} src={WatchList} fill priority />,
      dropwodnshareExport: <Image alt={""} src={shareExport} fill priority />,
    }),
    []
  );

  const handleLogout = useCallback(() => {
    setShowUser(false);
    disconnet();
    removeQuickBuyState();
  }, [setShowUser, disconnet, removeQuickBuyState]);

  const toggleShareModal = useShareModal((state) => state.toggleShareModal);
  const setShareData = useShareModal((state) => state.setShareData);

  const handleShareExport = useCallback(() => {
    toggleShareModal();
    setShareData({
      url: `${process.env.NEXT_PUBLIC_FRONT_END_URL}`,
      text: "",
      title: "Check out my Solana wallet!",
      description:
        "Explore my Solana assets and transactions on Phantom wallet.",
      image: "",
    });
  }, [toggleShareModal, setShareData]);

  const userMenuItems = useMemo(
    () => (
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={dropdownVariants}
        className="absolute right-0 mt-2 md:w-[280px] w-[240px] bg-[#0D0D0D] border border-[#FFFFFF1A]   z-20 md:py-[1.6rem] md:px-[2rem] p-[1rem] shadow-[0_0_2px_0_rgba(255,255,255,0.2),-0_-0_2px_0_rgba(255,255,255,0.2)] rounded-[20px] "
      >
        <div className="md:pt-2 pt-1 md:space-y-[12px] space-y-[2px] ">
          <UserMenuItem
            icon={memoizedImages.dropwodnsetting}
            text="Settings"
            link={"/settings"}
            setShowUser={setShowUser}
            IconclassName="  w-[clamp(16px,1vw+0.5rem,20px)] h-[clamp(16px,1vw+0.5rem,20px)]"
          />
          <UserMenuItem
            icon={memoizedImages.dropwodnwallet}
            text="Wallet Managment"
            link={"/wallet-managment/"}
            setShowUser={setShowUser}
            IconclassName=" w-[clamp(18px,1.2vw+0.5rem,24px)] h-[clamp(18px,1.2vw+0.5rem,24px)] "
          />
          <UserMenuItem
            icon={memoizedImages.dropwodnalerIcon}
            text="Alerts"
            link={"#"}
            onClick={toggleAlertModal}
            setShowUser={setShowUser}
            className="lg:hidden flex  "
            IconclassName=" w-[clamp(18px,1.2vw+0.5rem,24px)] h-[clamp(18px,1.2vw+0.5rem,24px)] "
          />
          <UserMenuItem
            icon={memoizedImages.dropwodnWatchList}
            text="Watchlist"
            link={"#"}
            onClick={toggleWatchListModal}
            setShowUser={setShowUser}
            className="lg:hidden flex  "
            IconclassName=" w-[clamp(18px,1.2vw+0.5rem,24px)] h-[clamp(18px,1.2vw+0.5rem,24px)] "
          />
          <UserMenuItem
            icon={memoizedImages.dropwodnshareExport}
            text="Share"
            link={"#"}
            onClick={handleShareExport}
            setShowUser={setShowUser}
            className="lg:hidden flex  "
            IconclassName=" w-[clamp(18px,1.2vw+0.5rem,24px)] h-[clamp(18px,1.2vw+0.5rem,24px)] "
          />

          <UserMenuItem
            icon={memoizedImages.dropwodnlogout}
            setShowUser={setShowUser}
            text="Logout"
            link="#"
            onClick={handleLogout}
            className={"hover:bg-red-600 !bg-opacity-80"}
            IconclassName=" w-[clamp(18px,1.2vw+0.5rem,24px)] h-[clamp(18px,1.2vw+0.5rem,24px)] "
          />

          {pathname.includes("trade") && (
            <div className="flex md:hidden items-center space-x-1 bg-[linear-gradient(90deg,_rgba(220,_31,_255,_0.4)_0%,_rgba(76,_243,_123,_0.4)_100%)] overflow-hidden p-[1px] md:max-w-[clamp(80px,18vw,137px)] h-[clamp(24px,4vw,39px)] min-w-[clamp(80px,18vw,137px)] rounded-[clamp(3px,1vw,6px)]">
              <Link
                href={"/holdings"}
                className="flex items-center justify-center font-medium text-[clamp(10px,1.8vw,16px)] leading-[100%] tracking-[0%] bg-[linear-gradient(90deg,_#030303_0%,_#1E1E1E_100%)] rounded-[clamp(3px,1vw,6px)] w-full h-full text-white"
              >
                Portfolio
              </Link>
            </div>
          )}
        </div>
        {/* Social Links Container */}
        <div className="bg-[#202020] mt-[1rem] h-[34px] flex lg:hidden items-center justify-center gap-[clamp(0.5rem,3vw,0.75rem)] font-medium text-[clamp(14px,2.5vw,14px)] leading-[100%] tracking-[0%] text-[#C3C3C3] w-full lg:max-w-[clamp(100px,20vw,129px)] px-[clamp(8px,2vw,12px)] rounded-[6px]">
          {/* X/Twitter Button */}
          <Button className="h-full w-full px-0 bg-transparent py-[clamp(8px,2vw,11px)] hover:bg-transparent">
            <div className="w-[clamp(12px,2.5vw,15px)] h-[clamp(12px,2.5vw,15px)] relative">
              <Image
                src={x}
                alt="X/Twitter Icon"
                fill
                sizes="(max-width: 768px) 15px, 15px"
                className="object-contain"
              />
            </div>
          </Button>
          <Separator orientation="vertical" className="h-8 bg-gray-600" />
          {/* Telegram Button */}
          <Button className="h-full w-full px-0 bg-transparent py-[clamp(8px,2vw,11px)] hover:bg-transparent">
            <div className="w-[clamp(14px,2.5vw,16px)] h-[clamp(11px,2.5vw,13px)] relative">
              <Image
                src={telegram}
                alt="Telegram Icon"
                fill
                sizes="(max-width: 768px) 16px, 16px"
                className="object-contain"
              />
            </div>
          </Button>
          <Separator orientation="vertical" className="h-8 bg-gray-600" />
          {/* Globe Button */}
          <Button className="h-full w-full px-0 bg-transparent py-[clamp(8px,2vw,11px)] hover:bg-transparent">
            <div className="w-[clamp(14px,2.5vw,16px)] h-[clamp(14px,2.5vw,16px)] relative">
              <Image
                src={globe}
                alt="Globe Icon"
                fill
                sizes="(max-width: 768px) 16px, 16px"
                className="object-contain"
              />
            </div>
          </Button>
        </div>
      </motion.div>
    ),
    [
      setShowUser,
      pathname,
      handleLogout,
      memoizedImages,
      toggleAlertModal,
      toggleWatchListModal,
      handleShareExport,
    ]
  );

  return (
    <div className="relative" ref={userMenuRef}>
      <MotionButton
        name="user icon"
        aria-label="user icon"
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowUser(!showUser)}
        className={` max-w-[clamp(60px,20vw,140px)] w-full bg-[#202020] rounded-[clamp(4px,1vw,6px)] flex items-center justify-center gap-[clamp(2px,1vw,4px)] !p-[clamp(6px,2vw,12px)]  ${
          showUser && "bg-[#5a5a5a79]"
        }`}
      >
        {/* <div className=" md:block hidden relative w-[clamp(16px,5vw,30px)] min-w-[clamp(16px,5vw,30px)] h-[clamp(16px,5vw,30px)]  ">
          <Image
            alt={""}
            src={ProfileIcon}
            fill
            priority
            className="object-contain"
          />
        </div> */}
        <div className=" flex flex-col  gap-[clamp(2px,0.5vw,4px)] items-start ">
          <p className="text-white font-semibold text-[clamp(10px,1.4vw,14px)] leading-[100%] tracking-[0%] whitespace-nowrap overflow-hidden  max-w-[clamp(60px,10vw,90px)]">
            {isLoading ? (
              <Skeleton className=" ml-1  w-[clamp(25px,4vw,35px)] h-[clamp(12px,2vw,18px)] " />
            ) : isError ? (
              <span className=" text-red-400 ">error</span>
            ) : (
              <div className=" flex items-center justify-center gap-1 lg:flex-nowrap flex-wrap ">
                <span>SOL</span> <span>{BalanceData?.data.balance}</span>
              </div>
            )}
          </p>
          {/* <p className="font-medium text-[10px] leading-[100%] tracking-[0%] text-[#00FFA3]  ">
            +$0.16 +0.43%
          </p> */}
        </div>
      </MotionButton>
      <AnimatePresence>{showUser && userMenuItems}</AnimatePresence>
    </div>
  );
});

const UserMenuItem = memo(function UserMenuItem({
  icon,
  text,
  link = "#",
  className,
  IconclassName,
  setShowUser,
  onClick,
  ...props
}: {
  icon: React.ReactNode;
  text: string;
  link?: string;
  className?: string;
  IconclassName?: string;
  setShowUser: (show: boolean) => void;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) {
  const MotionLink = motion(Link);
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    setShowUser(false);
    if (onClick) onClick(event); // Call the passed onClick handler if provided
  };

  return (
    <MotionLink
      href={link}
      onClick={handleClick}
      whileHover={{ x: 4 }}
      {...props}
      className={cn(
        "flex items-center gap-6 w-full md:p-[1rem] px-[1rem] py-[0.6rem] text-[#CDD0E5] hover:text-white hover:bg-[#FFFFFF0F] transition-colors",
        className
      )}
    >
      <div className={cn("relative w-[22px] h-[22px]", IconclassName)}>
        {icon}
      </div>
      <span className=" text-[clamp(1.2rem,0.253vw_+_1.119rem,1.6rem)] font-bold leading-[19.81px] text-left [text-underline-position:from-font] [text-decoration-skip-ink:none]">
        {text}
      </span>
    </MotionLink>
  );
});
