import connectToDb from "@/lib/db";
import mongoose from "mongoose";
const { Schema } = mongoose;

interface IAccount {
    name: string;
}

const accountSchema = new Schema<IAccount>({
    name: String,
});

const Account =
    (mongoose.models.Account as mongoose.Model<IAccount>) ||
    mongoose.model<IAccount>("Account", accountSchema);

connectToDb().then((success) => {
    if (!success) throw new Error("Failed to connect to database.");
});

export default Account;
