import mongoose, { Schema, InferSchemaType } from "mongoose";

const budgetAccount = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    bank: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

export type BudgetAccountType = InferSchemaType<typeof budgetAccount>;
const BudgetAccount =
    (mongoose.models.BudgetAccount as mongoose.Model<BudgetAccountType>) ||
    mongoose.model<BudgetAccountType>("BudgetAccount", budgetAccount);
export default BudgetAccount;
