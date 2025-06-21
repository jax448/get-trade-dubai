import faviIcon from "@public/icons/apple-icon.png";
import faviIconsite from "@public/icons/favicon.ico";
import faviIconShort from "@public/icons/icon1.png";

const metaData = {
  metadataBase: new URL("https://gettrade.vercel.app"),
  keywords: [""],
  title: {
    template: "%s | GetTrade",
    default: "GetTrade",
  },
  openGraph: {
    title: {
      template: "%s | GetTrade",
      default: "GetTrade",
    },
    description: "GetTrade",
    images: [
      {
        url: faviIconsite.src, // Replace with your actual image URL
        width: 1200,
        height: 630,
        alt: "",
      },
    ],
    url: "https://gettrade.vercel.app", // Replace with your actual URL
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GetTrade",
    description: "GetTrade",
    images: [faviIconsite.src], // Replace with your image URL
    creator: "@gettrade", // Optional: your Twitter handle
  },
  description: "GetTrade",
  icons: {
    icon: [
      {
        url: faviIconsite.src,
        sizes: "32x32",
        type: "image/png",
      },
    ],
    shortcut: [faviIconShort.src],
    apple: [
      {
        url: faviIcon.src,
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default metaData;
