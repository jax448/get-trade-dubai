"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const WalletHeader = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/wallet-managment", label: "My Wallet" },
    { href: "/wallet-managment/deposit", label: "Deposit" },
    { href: "/wallet-managment/withdraw", label: "Withdraw" },
    // { href: "/wallet-managment/archived", label: "Archived Wallet" },
  ];

  return (
    <nav className=" w-full md:mt-[2rem] mt-[1rem] md:overflow-x-[unset] overflow-x-auto  ">
      <div className=" min-w-[320px] flex items-center w-full space-x-[clamp(20px,4vw,80px)] h-[clamp(30px,6vw,43px)] border-b-[2px] border-b-[#D9D9D933] ">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center justify-center text-nowrap
                transition-colors 
              duration-300 
               h-full
               first:pl-0
               md:pr-[4rem] md:pl-[4rem]
               pr-[1rem] pl-[1rem]
              md:pb-4
              font-bold text-[16px] leading-[100%] tracking-[0%] text-center
              relative z-10
              after:[content('')] after:absolute after:w-full after:h-[2px] after:z-10 after:bottom-[-1px] after:left-0 
              ${pathname === item.href ? " after:bg-white" : ""}
            `}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default WalletHeader;
