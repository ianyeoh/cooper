import Session from "../../../../../../schemas/db/sessions";
import { sessionSchema } from "@/lib/schemas/post/auth";
import { NextRequest, NextResponse } from "next/server";

// POST /api/auth/session
export async function POST(request: NextRequest) {
    const body = await request.json();
    const parseResult = sessionSchema.safeParse(body);
    if (!parseResult.success) {
        return NextResponse.json({ error: parseResult.error }, { status: 400 });
    }

    const validSession = Session.findById(parseResult.data.sessionId);
    if (!validSession) {
        return NextResponse.json(
            { error: "Invalid sessionId." },
            { status: 401 }
        );
    }

    return NextResponse.json({ message: "Session is valid." }, { status: 200 });
}
