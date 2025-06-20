import image1 from "@public/assests/MarketTableImages (1).png"
import image2 from "@public/assests/MarketTableImages (2).png"
import image3 from "@public/assests/MarketTableImages (3).png"
import image4 from "@public/assests/MarketTableImages (4).png"
import image5 from "@public/assests/MarketTableImages (5).png"

export const cryptoData = [
  {
    name: "Popcat", // Name of the cryptocurrency
   
    icon: image1, // URL or path to the cryptocurrency's icon
    marketCap: 31684673310, // Market capitalization as a number
    liquidity: "323.77/$89k", // Liquidity as a string
    liquidityChange: -0.21, // Percentage change in liquidity as a number
    initialLiquidity: "323.77/$89k", // Initial liquidity as a string
    tenMinChange: -1.44, // 10-minute percentage change as a number
    auditResults: [
      { passed: true, auditest: "Mint Auth" },
      { passed: true, auditest: "Freeze Auth" },
      { passed: false, auditest: "LP Burned" },
      { passed: true, auditest: "Top 10 Holders" },
    ],
  },
  {
    name: "Ponke",
   
    icon: image2,
    marketCap: 29226059792,
    liquidity: "323.77/$89k",
    liquidityChange: -2.54,
    initialLiquidity: "323.77/$89k",
    tenMinChange: -2.54,
    auditResults: [
      { passed: true, auditest: "Mint Auth" },
      { passed: true, auditest: "Freeze Auth" },
      { passed: false, auditest: "LP Burned" },
      { passed: true, auditest: "Top 10 Holders" },
    ],
  },
  {
    name: "Bank",
   
    icon: image3,
    marketCap: 29226059792,
    liquidity: "323.77/$89k",
    liquidityChange: -2.54,
    initialLiquidity: "323.77/$89k",
    tenMinChange: -2.54,
    auditResults: [
      { passed: true, auditest: "Mint Auth" },
      { passed: true, auditest: "Freeze Auth" },
      { passed: false, auditest: "LP Burned" },
      { passed: true, auditest: "Top 10 Holders" },
    ],
  },
  {
    name: "Book of meme",
  
    icon: image4,
    marketCap: 29226059792,
    liquidity: "323.77/$89k",
    liquidityChange: -2.54,
    initialLiquidity: "323.77/$89k",
    tenMinChange: -2.54,
    auditResults: [
      { passed: true, auditest: "Mint Auth" },
      { passed: true, auditest: "Freeze Auth" },
      { passed: false, auditest: "LP Burned" },
      { passed: true, auditest: "Top 10 Holders" },
    ],
  },
  {
    name: "Dogwifhat",
  
    icon: image5,
    marketCap: 29226059792,
    liquidity: "323.77/$89k",
    liquidityChange: -2.54,
    initialLiquidity: "323.77/$89k",
    tenMinChange: -2.54,
    auditResults: [
      { passed: true, auditest: "Mint Auth" },
      { passed: true, auditest: "Freeze Auth" },
      { passed: false, auditest: "LP Burned" },
      { passed: true, auditest: "Top 10 Holders" },
    ],
  },
  {
    name: "michi",
  
    icon: image1,
    marketCap: 29226059792,
    liquidity: "323.77/$89k",
    liquidityChange: -2.54,
    initialLiquidity: "323.77/$89k",
    tenMinChange: -2.54,
    auditResults: [
      { passed: true, auditest: "Mint Auth" },
      { passed: true, auditest: "Freeze Auth" },
      { passed: false, auditest: "LP Burned" },
      { passed: true, auditest: "Top 10 Holders" },
    ],
  },
];
