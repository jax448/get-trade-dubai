import React from "react";
import WithdrawForm from "./WithdrawForm";
import WithdrawTable from "./WithdrawTable";

function page() {
  return (
    <div
      style={{ maxWidth: "clamp(1200px,90vw,1700px)" }}
      className=" w-full bg-[#F1F2FF0D] border border-[#FFFFFF1A]   "
    >
      <div className=" md:px-[4rem] px-[2rem] mt-[2rem] mb-[2rem]  ">
        {/* <h5 className=" text-[#D9D9D9]  ">
          Withdraw from Get. Trading wallet to your selected wallet. Please keep
          a balance of 0.0025SOL + priority fee for the withdraw to be
          successful.
        </h5> */}
        <WithdrawForm />
      </div>
      <div className=" rounded-lg  text-white">
        <WithdrawTable />
      </div>
    </div>
  );
}

export default page;
