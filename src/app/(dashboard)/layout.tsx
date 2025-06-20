import Header from "@/components/dashboard/Header";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className=" !relative w-full mx-auto  "
      style={{
        maxWidth: "1920px",
      }}
    >
      {/* simple cha ges */}
      <div className=" min-h-screen flex flex-col ">
        <Header />
        {children}
        <div className=" px-6 mx-auto py-[2rem] mt-auto max-w-[339px] w-full flex items-center md:justify-between justify-center gap-[clamp(1rem,1.25rem,1.5rem)] ">
          <Link
            href={""}
            className=" font-medium text-[clamp(10px,0.9vw+0.5rem,14px)] leading-[100%] tracking-[0%] text-right "
          >
            Privacy Policy
          </Link>
          <Link
            href={""}
            className=" font-medium text-[clamp(10px,0.9vw+0.5rem,14px)] leading-[100%] tracking-[0%] text-right "
          >
            Terms of Service
          </Link>
          <Link
            href={""}
            className=" font-medium text-[clamp(10px,0.9vw+0.5rem,14px)] leading-[100%] tracking-[0%] text-right "
          >
            Firebase
          </Link>
        </div>
      </div>
    </div>
  );
}
