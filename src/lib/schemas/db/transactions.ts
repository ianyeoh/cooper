import connectToDb from "@/lib/db";
import mongoose from "mongoose";
const { Schema } = mongoose;

export interface ITransaction {
    account: string;
    date: Date;
    description: string;
    category: string;
    amount: number; // in cents!
    comments?: string;
}

const transactionSchema = new Schema<ITransaction>(
    {
        account: String,
        date: Date,
        description: String,
        category: String,
        amount: Number,
        comments: String,
    },
    { timestamps: true }
);

const Transaction =
    (mongoose.models.Transaction as mongoose.Model<ITransaction>) ||
    mongoose.model<ITransaction>("Transaction", transactionSchema);

connectToDb().then((success) => {
    if (!success) throw new Error("Failed to connect to database.");
});

export default Transaction;
