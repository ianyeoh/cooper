import { NextResponse, type NextRequest } from "next/server";
import { fetch } from "./lib/tsr";

async function authenticated() {
    const response = await fetch.auth.session();
    return response.status === 200;
}

// Protect authenticated routes, and automatically
// redirect to the dashboard if already logged in
export async function middleware(request: NextRequest) {
    const url = request.nextUrl.pathname;
    const isRootUrl = url === "/";
    const protectedPrefixes = ["/dashboard"]; // paths that require user to be logged in
    const unauthenticatedPrefixes = ["/login", "/signup"]; // paths that require user to be logged out
    const isAuthenticated = await authenticated();

    if (isAuthenticated) {
        if (
            isRootUrl ||
            unauthenticatedPrefixes.some((prefix) => url.startsWith(prefix))
        ) {
            return NextResponse.redirect(
                new URL("/dashboard", request.nextUrl.origin)
            );
        }
    } else {
        if (
            isRootUrl ||
            protectedPrefixes.some((prefix) => url.startsWith(prefix))
        ) {
            return NextResponse.redirect(
                new URL("/login", request.nextUrl.origin)
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth
         * - api/ping
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        {
            source: "/((?!api/auth|api/ping|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
            missing: [
                { type: "header", key: "next-router-prefetch" },
                { type: "header", key: "purpose", value: "prefetch" },
            ],
        },

        {
            source: "/((?!api/auth|api/ping|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
            has: [
                { type: "header", key: "next-router-prefetch" },
                { type: "header", key: "purpose", value: "prefetch" },
            ],
        },

        {
            source: "/((?!api/auth|api/ping|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
            has: [{ type: "header", key: "x-present" }],
            missing: [{ type: "header", key: "x-missing", value: "prefetch" }],
        },
    ],
};
