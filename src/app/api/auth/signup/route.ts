import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/schemas/post/auth";
import connectToDb from "@/lib/db";
import User from "@/lib/schemas/db/users";
import { saltedHash } from "@/lib/hashing";

// POST /api/auth/signup
export async function POST(request: NextRequest) {
    const body = await request.json();
    const parseResult = loginSchema.safeParse(body);
    if (!parseResult.success) {
        return NextResponse.json({ error: parseResult.error }, { status: 400 });
    }

    const dbConnection = await connectToDb();
    if (!dbConnection.success) {
        return NextResponse.json(
            { error: dbConnection.error },
            { status: 500 }
        );
    }

    const existingUser = await User.findOne({
        username: parseResult.data.username,
    }).exec();
    if (existingUser) {
        return NextResponse.json(
            { error: "User with username already exists." },
            { status: 400 }
        );
    }

    await User.create({
        username: parseResult.data.username,
        password: saltedHash(parseResult.data.password),
    });

    return NextResponse.json(
        { messmage: "Successfully created new user." },
        { status: 200 }
    );
}
