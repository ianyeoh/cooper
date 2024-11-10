import mongoose, { Schema, InferSchemaType } from "mongoose";

/**
 * This model is intentionally separated from the User model
 * to prevent accidentally fetching password data when accessing
 * user data.
 */
const authSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

export type AuthType = InferSchemaType<typeof authSchema>;
const Authentication =
    (mongoose.models.Authentication as mongoose.Model<AuthType>) ||
    mongoose.model<AuthType>("Authentication", authSchema);
export default Authentication;
