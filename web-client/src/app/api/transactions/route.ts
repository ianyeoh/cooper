import BudgetTransaction from "../../../../../schemas/db/budgetTransaction";
import { transactionsSchema } from "@/lib/schemas/post/transactions";
import { NextRequest, NextResponse } from "next/server";

// GET /api/transactions
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const totalRecords = await BudgetTransaction.countDocuments({}).exec();
    let query = BudgetTransaction.find();

    const limit = searchParams.get("limit");
    if (limit != null && !Number.isNaN(Number(limit)))
        query = query.limit(Number(limit));

    const skip = searchParams.get("skip");
    if (skip != null && !Number.isNaN(Number(skip)))
        query = query.skip(Number(skip));

    const records = await query.exec();

    return NextResponse.json(
        {
            records,
            totalRecords,
        },
        { status: 200 }
    );
}

// POST /api/transactions
export async function POST(request: NextRequest) {
    const body = await request.json();

    const parseResult = transactionsSchema.safeParse(body);
    if (!parseResult.success) {
        return NextResponse.json({ error: parseResult.error }, { status: 400 });
    }

    await BudgetTransaction.create(parseResult.data);

    return NextResponse.json(
        {
            ...parseResult,
        },
        { status: 200 }
    );
}
