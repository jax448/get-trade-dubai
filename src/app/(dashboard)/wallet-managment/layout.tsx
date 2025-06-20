import Link from "next/link";
import WalletHeader from "./WalletHeader";
import WalletsecondHeader from "./WalletsecondHeader";

export default function WalletManagmentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <WalletsecondHeader>
        <div className="flex items-center justify-between md:flex-nowrap flex-wrap md:gap-6 gap-2  ">
          <p className="font-semibold text-[clamp(14px,4vw,26px)] leading-[clamp(18px,5vw,32px)] tracking-[0%] text-white whitespace-nowrap">
            Wallet Management
          </p>
          <div className="flex  items-center space-x-1 bg-[linear-gradient(90deg,_rgba(220,_31,_255,_0.4)_0%,_rgba(76,_243,_123,_0.4)_100%)] overflow-hidden p-[1px] max-w-[clamp(80px,18vw,137px)] h-[clamp(24px,4vw,39px)] min-w-[clamp(80px,18vw,137px)] rounded-[clamp(3px,1vw,6px)]">
            <Link
              href={"/holdings"}
              className="flex items-center justify-center font-medium text-[clamp(10px,1.8vw,16px)] leading-[100%] tracking-[0%] bg-[linear-gradient(90deg,_#030303_0%,_#1E1E1E_100%)] rounded-[clamp(3px,1vw,6px)] w-full h-full text-white"
            >
              Portfolio
            </Link>
          </div>
        </div>
      </WalletsecondHeader>
      <div
        style={{ maxWidth: "clamp(1200px,90vw,1700px)" }}
        className=" md:pl-[3rem] md:pr-0 px-4    "
      >
        <WalletHeader />
        {children}
      </div>
    </div>
  );
}
