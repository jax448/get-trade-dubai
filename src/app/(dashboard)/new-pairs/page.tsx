import Dashboard2Header from "@/components/dashboard/DashboardSecondHeader";
import dynamic from "next/dynamic";

const NewPairsTable = dynamic(
  () => import("@/components/dashboard/new-pairs/NewPairTable"),
  {
    ssr: false,
  }
);

function page() {
  return (
    <>
      <Dashboard2Header />
      <NewPairsTable />
    </>
  );
}

export default page;
