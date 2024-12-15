import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const walletConnected = request.cookies.get("walletConnected");

  if (!walletConnected) {
    // Redirect ke halaman awal jika wallet tidak terkoneksi
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Tentukan halaman yang dilindungi middleware
export const config = {
  matcher: "/dashboard/:path*",
};
