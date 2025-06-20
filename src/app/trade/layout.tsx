import React from "react";
import TradeHeader from "../../components/TradeRoom/TradeHeader";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" mx-auto ">
      <TradeHeader />
      {children}
    </div>
  );
}

export default layout;
