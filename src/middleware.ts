import { NextResponse, type NextRequest } from "next/server";
import axios from "@/lib/axios";
import { SessionType } from "@/lib/schemas/post/auth";

async function authenticated(request: NextRequest) {
    const cookies = request.cookies;
    const sessionId = cookies.get("id");
    if (!sessionId) {
        return false;
    }

    try {
        const result = await axios.post(
            `${request.nextUrl.origin}/api/auth/session`,
            {
                sessionId: sessionId.value,
            } as SessionType
        );

        if (result.status !== 200) {
            throw new Error("Session not found.");
        }
    } catch (error) {
        return false;
    }

    return true;
}

// Protect authenticated routes, and automatically
// redirect to the dashboard if already logged in
export async function middleware(request: NextRequest) {
    const url = request.nextUrl.pathname;
    const isRootUrl = url === "/";
    const protectedPrefixes = ["/dashboard"]; // paths that require user to be logged in
    const unauthenticatedPrefixes = ["/login", "/signup"]; // paths that require user to be logged out
    const isAuthenticated = await authenticated(request);

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
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        {
            source: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
            missing: [
                { type: "header", key: "next-router-prefetch" },
                { type: "header", key: "purpose", value: "prefetch" },
            ],
        },

        {
            source: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
            has: [
                { type: "header", key: "next-router-prefetch" },
                { type: "header", key: "purpose", value: "prefetch" },
            ],
        },

        {
            source: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
            has: [{ type: "header", key: "x-present" }],
            missing: [{ type: "header", key: "x-missing", value: "prefetch" }],
        },
    ],
};
