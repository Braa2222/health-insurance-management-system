import { NextResponse } from "next/server";

import { auth } from "@/auth";

const publicRoutes = ["/", "/services", "/sign-in", "/sign-up"];

const isPublicRoute = (pathname: string) => {
  return (
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/sign-up/")
  );
};

export default auth((request) => {
  const { pathname } = request.nextUrl;

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  if (!request.auth?.user) {
    const signInUrl = new URL("/sign-in", request.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(signInUrl);
  }

  const role = request.auth.user.role;

  if (pathname.startsWith("/admin") && role !== "SYSTEM_ADMIN") {
    return NextResponse.redirect(new URL("/", request.nextUrl.origin));
  }

  if (pathname.startsWith("/provider") && role !== "MEDICAL_SERVICE_PROVIDER") {
    return NextResponse.redirect(new URL("/", request.nextUrl.origin));
  }

  if (pathname.startsWith("/subscriber") && role !== "SUBSCRIBER") {
    return NextResponse.redirect(new URL("/", request.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
