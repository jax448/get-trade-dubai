import "./globals.css";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import localFont from "next/font/local";
import dynamic from "next/dynamic";
import metaData from "./metaData";
import { Metadata } from "next";
import { SignalRProvider } from "@/Sockets/context/SignalRContext";
import AlertNotification from "@/components/AlertSocketComponent";

const ShareModal = dynamic(() => import("@/components/ShareModal"), {
  ssr: false,
});
const AlertModal = dynamic(
  () => import("@/components/dashboard/Alerts/AlertModal"),
  {
    ssr: false,
  }
);
const WachListModal = dynamic(
  () => import("@/components/dashboard/WachListModal"),
  {
    ssr: false,
  }
);
const WalletConnectModal = dynamic(
  () => import("@/components/GenerateWalletModal"),
  {
    ssr: false,
  }
);
const ReactQueryClientProviders = dynamic(
  () => import("@/Context/React-Query-Provider"),
  {
    ssr: false,
  }
);

export const metadata: Metadata = metaData;

const gilroy = localFont({
  src: [
    {
      path: "./fonts/gilroy/Gilroy-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/gilroy/Gilroy-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/gilroy/Gilroy-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/gilroy/Gilroy-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/gilroy/Gilroy-Heavy.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-gilroy",
  display: "swap",
});

const poppins_fonts = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  subsets: ["latin"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        /> */}
        <meta name="apple-mobile-web-app-title" content="GetTrade" />
        <link rel="preconnect" href="https://birdeye.so" />
        <link rel="dns-prefetch" href="https://birdeye.so" />
      </head>
      <body
        className={` ${gilroy.variable} ${gilroy.className} ${poppins_fonts.variable}  antialiased  `}
      >
        <SignalRProvider>
          <ReactQueryClientProviders>
            {children}

            <WalletConnectModal />
            <AlertModal />
            <WachListModal />
            <ShareModal />

            <Toaster position="top-center" toastOptions={{ duration: 5000 }} />
          </ReactQueryClientProviders>
          <AlertNotification />
        </SignalRProvider>
      </body>
    </html>
  );
}
