import { NextResponse, type NextRequest } from "next/server";
import { fetch } from "./lib/ts-rest-server";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

/**
 * Returns true the session is authenticated - sessions are tracked
 * based on a http cookie with key "id" which are set/deleted by the
 * backend server.
 */
async function authenticated(sessionId: RequestCookie | undefined) {
    if (!sessionId) return false;

    const response = await fetch.auth.session({});

    return response.status === 200;
}

/**
 * Middleware for every request to the Next.js server (excluding requests to /api/*)
 *
 * Ensures that protected routes (/dashboard/*) cannot be accessed unless authenticated,
 * by automatically redirecting to the /login page.
 */
export async function middleware(request: NextRequest) {
    const url = request.nextUrl.pathname;
    const isRootUrl = url === "/";
    const protectedPrefixes = ["/app"]; // paths that require user to be logged in
    const unauthenticatedPrefixes = ["/login", "/signup"]; // paths that require user to be logged out

    const sessionId = request.cookies.get("id");
    const isAuthenticated = await authenticated(sessionId);

    if (isAuthenticated) {
        if (
            isRootUrl ||
            unauthenticatedPrefixes.some((prefix) => url.startsWith(prefix))
        ) {
            return NextResponse.redirect(
                new URL("/app", request.nextUrl.origin)
            );
        }
    } else {
        if (
            isRootUrl ||
            protectedPrefixes.some((prefix) => url.startsWith(prefix))
        ) {
            if (sessionId !== null) {
                // Session has expired
                return NextResponse.redirect(
                    new URL(
                        "/login?redirect=expiredSession",
                        request.nextUrl.origin
                    )
                );
            } else {
                // Not a valid session (unauthenticated access from URL)

                return NextResponse.redirect(
                    new URL("/login", request.nextUrl.origin)
                );
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/
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
