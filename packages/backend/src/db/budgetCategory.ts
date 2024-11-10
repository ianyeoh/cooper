import mongoose, { Schema, InferSchemaType } from "mongoose";

const budgetCategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
});

export type BudgetCategoryType = InferSchemaType<typeof budgetCategorySchema>;
const BudgetCategory =
    (mongoose.models.BudgetCategory as mongoose.Model<BudgetCategoryType>) ||
    mongoose.model<BudgetCategoryType>("BudgetCategory", budgetCategorySchema);

export default BudgetCategory;
