import mongoose from "mongoose";
const { Schema } = mongoose;

interface IUser {
    username: string;
    password: string;
}

const userSchema = new Schema<IUser>({
    username: String,
    password: String,
});

const User =
    (mongoose.models.User as mongoose.Model<IUser>) ||
    mongoose.model<IUser>("User", userSchema);

export default User;
