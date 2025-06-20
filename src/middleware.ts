import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/profile",
  "/wallet-managment",
  "/holdings",
  "/watchlist",
];

interface SolanaAuthData {
  solpublicKey: string;
  getTradePublicKey: string;
  key: string;
  timestamp: number;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Only log the data in non-production environments
  console.log("Middleware running for path:", pathname);

  if (!protectedRoutes.some((route) => pathname.startsWith(route))) {
    // Only log the data in non-production environments
    console.log("Not a protected route, continuing...");

    return NextResponse.next();
  }

  try {
    // Get auth data from cookies instead of headers
    const authCookie = request.cookies.get("gettrade-auth");
    // Only log the data in non-production environments

    if (!authCookie?.value) {
      // Only log the data in non-production environments
      console.log("No auth cookie value");
      throw new Error("No authentication data found");
    }

    const authData: SolanaAuthData = JSON.parse(authCookie.value);
    // Only log the data in non-production environments
    console.log("Auth data parsed:", {
      hasPublicKey: !!authData.solpublicKey,
      timestamp: authData.timestamp,
    });

    // Verify timestamp (5 minute window)
    const now = Date.now();
    const timeDiff = now - authData.timestamp;
    // Only log the data in non-production environments
    console.log("Time difference:", timeDiff);

    if (now - authData.timestamp > 1000 * 60 * 60 * 24) {
      // Only log the data in non-production environments
      console.log("Cookie expired");

      // Clear expired cookie
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("gettrade-auth");
      return response;
    }
    // Only log the data in non-production environments
    console.log("Auth successful, continuing...");

    return NextResponse.next();
  } catch (error) {
    // Clear auth cookie on error
    console.log("Error in middleware:", error);
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("gettrade-auth");
    return response;
  }
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/wallet-managment/:path*",
    "/holdings/:path*",
    "/watchlist/:path*",
  ],
};
