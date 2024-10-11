import { NextResponse } from "next/server";

// GET /api/ping
export async function GET() {
    return NextResponse.json({ status: 200 });
}
