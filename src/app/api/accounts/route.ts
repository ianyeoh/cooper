import { NextRequest, NextResponse } from "next/server";
import Account from "@/lib/schemas/db/accounts";

// GET /api/accounts
export async function GET(request: NextRequest) {
    const accounts = await Account.find();
    return NextResponse.json(accounts, { status: 200 });
}

// POST /api/accounts
export async function POST(request: NextRequest) {}
