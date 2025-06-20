import React from "react";
import DepositForm from "./DepositForm";
import DepositTable from "./DepositTable";

function Page() {
  return (
    <div
      style={{ maxWidth: "clamp(1200px,90vw,1700px)" }}
      className=" w-full bg-[#F1F2FF0D] border border-[#FFFFFF1A]  lg:mt-12 mt-4 "
    >
      {/* Total Amount Section */}
      <DepositForm />
      <div className=" rounded-lg  text-white">
        <DepositTable />
      </div>
    </div>
  );
}

export default Page;
