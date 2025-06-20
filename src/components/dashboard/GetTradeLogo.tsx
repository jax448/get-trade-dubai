import Image, { StaticImageData } from "next/image";
import React from "react";

export const GetTradeLogo = ({ Logo }: { Logo: StaticImageData }) => (
  <Image
    src={Logo}
    alt="Logo"
    width={49}
    height={49}
    className="w-[clamp(28px,6vw,49px)] h-[clamp(28px,6vw,49px)] rounded-full object-cover min-w-[clamp(28px,6vw,49px)]"
  />
);
