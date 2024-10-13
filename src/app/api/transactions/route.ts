import { NextRequest, NextResponse } from "next/server";

// GET /api/transactions
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    


    return NextResponse.json(searchParams, { status: 200 });
}
