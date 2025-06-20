// import MillionLint from "@million/lint";
/** @type {import('next').NextConfig} */
const nextConfig = {
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  images: {
    unoptimized: true, // Allows loading images from any source
  },

  compiler: {
    removeConsole: true,
  },
};

// export default MillionLint.next({
//   rsc: true,
//   filter: {
//     exclude: ["/src/components/ui/**/*.{mtsx,mjsx,tsx,jsx}"],
//   },
// })(nextConfig);

export default nextConfig;
