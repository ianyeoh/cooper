import mongoose from "mongoose";
const { Schema } = mongoose;

interface IBudgetCategory {
    name: string;
}

const budgetCategorySchema = new Schema<IBudgetCategory>({
    name: String,
});

const BudgetCategory =
    (mongoose.models.BudgetCategory as mongoose.Model<IBudgetCategory>) ||
    mongoose.model<IBudgetCategory>("BudgetCategory", budgetCategorySchema);

export default BudgetCategory;
