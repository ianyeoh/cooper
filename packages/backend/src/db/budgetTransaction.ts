import mongoose, { Schema, InferSchemaType } from "mongoose";

const budgetTransactionSchema = new Schema(
    {
        account: {
            type: Schema.Types.ObjectId,
            ref: "BudgetAccount",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "BudgetCategory",
            required: true,
        },
        amount: {
            // Stored as cents
            type: Number,
            required: true,
        },
        comments: {
            // User added comments, not required
            type: String,
            required: false,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false, // if missing = system-generated
        },
    },
    { timestamps: true }
);

export type BudgetTransactionType = InferSchemaType<
    typeof budgetTransactionSchema
>;
const BudgetTransaction =
    (mongoose.models
        .BudgetTransaction as mongoose.Model<BudgetTransactionType>) ||
    mongoose.model<BudgetTransactionType>(
        "BudgetTransaction",
        budgetTransactionSchema
    );
export default BudgetTransaction;
