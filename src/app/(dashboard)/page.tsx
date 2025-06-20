import Dashboard2Header from "@/components/dashboard/DashboardSecondHeader";
import dynamic from "next/dynamic";

const TrendingTable = dynamic(
  () => import("@/components/dashboard/trending/TrendingTable"),
  {
    ssr: false,
  }
);

function Home() {
  return (
    <>
      <Dashboard2Header />
      <TrendingTable />
    </>
  );
}

export default Home;
