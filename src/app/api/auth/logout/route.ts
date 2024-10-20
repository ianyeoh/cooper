import { NextRequest, NextResponse } from "next/server";
import Session from "@/lib/schemas/db/sessions";

// POST /api/auth/logout
export async function GET(request: NextRequest) {
    const cookies = request.cookies;

    const sessionId = cookies.get("id");
    if (!sessionId) {
        return NextResponse.json(
            { error: "Invalid sessionId." },
            { status: 400 }
        );
    }

    const validSession = await Session.findByIdAndDelete(sessionId.value);
    if (!validSession) {
        return NextResponse.json(
            { error: "Invalid sessionId." },
            { status: 400 }
        );
    }

    const response = NextResponse.json(
        { message: "Logged out successfully." },
        { status: 200 }
    );
    response.cookies.delete("id");
    return response;
}
