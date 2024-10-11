import Session from "@/lib/schemas/db/sessions";
import { NextRequest, NextResponse } from "next/server";

// POST /api/user
export async function GET(request: NextRequest) {
    const cookies = request.cookies;

    const sessionId = cookies.get("id");
    if (!sessionId) {
        return NextResponse.json(
            { error: "Invalid sessionId." },
            { status: 400 }
        );
    }

    const session = await Session.findOne({ _id: sessionId.value });
    if (!session) {
        return NextResponse.json(
            { error: "Invalid sessionId." },
            { status: 400 }
        );
    }

    return NextResponse.json({ username: session.username }, { status: 200 });
}
