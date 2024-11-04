import mongoose from "mongoose";
const { Schema } = mongoose;

export interface IBudgetTransaction {
    account: string;
    date: Date;
    description: string;
    category: string;
    amount: number; // in cents!
    comments?: string;
}

const budgetTransactionSchema = new Schema<IBudgetTransaction>(
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

const BudgetTransaction =
    (mongoose.models.BudgetTransaction as mongoose.Model<IBudgetTransaction>) ||
    mongoose.model<IBudgetTransaction>(
        "BudgetTransaction",
        budgetTransactionSchema
    );

export default BudgetTransaction;
