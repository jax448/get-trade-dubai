"use client";

import React from "react";

interface StringShortenerProps {
  originalString: string;
}

const TokenStringShortener: React.FC<StringShortenerProps> = ({
  originalString,
}) => {
  const shortenString = (str: string): string => {
    if (str.length <= 8) {
      return str;
    }

    const firstFour = str.substring(0, 4);
    const lastFour = str.substring(str.length - 4);

    return `${firstFour}....${lastFour}`;
  };

  return shortenString(originalString);
};

export default TokenStringShortener;
