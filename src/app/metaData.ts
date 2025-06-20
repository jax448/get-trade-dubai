import faviIcon from "@public/icons/apple-icon.png";
import faviIconsite from "@public/icons/favicon.ico";
import faviIconShort from "@public/icons/icon1.png";

const metaData = {
  metadataBase: new URL("https://get-trade-app.vercel.app"),
  keywords: [""],
  title: {
    template: "%s | Get.Trade",
    default: "Get.Trade",
  },
  openGraph: {
    title: {
      template: "%s | Get.Trade",
      default: "Get.Trade",
    },
    description: "Get.Trade",
    images: [
      {
        url: faviIconsite.src, // Replace with your actual image URL
        width: 1200,
        height: 630,
        alt: "",
      },
    ],
    url: "https://get-trade-app.vercel.app", // Replace with your actual URL
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Get.Trade",
    description: "Get.Trade",
    images: [faviIconsite.src], // Replace with your image URL
    creator: "@gettrade", // Optional: your Twitter handle
  },
  description: "Get Trade",
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
