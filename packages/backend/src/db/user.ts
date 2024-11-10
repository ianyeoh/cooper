import mongoose, { Schema, InferSchemaType } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    roles: [
        {
            type: String,
            required: true,
        },
    ],
});

export type UserType = InferSchemaType<typeof userSchema>;
const User =
    (mongoose.models.User as mongoose.Model<UserType>) ||
    mongoose.model<UserType>("User", userSchema);
export default User;
