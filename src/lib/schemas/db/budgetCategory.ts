import connectToDb from "@/lib/db";
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

connectToDb().then((success) => {
    if (!success) throw new Error("Failed to connect to database.");
});

export default BudgetCategory;
