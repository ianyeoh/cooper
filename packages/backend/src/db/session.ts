import mongoose, { Schema, InferSchemaType } from "mongoose";

const sessionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    ip: {
        type: String,
        required: true,
    },
    userAgent: {
        type: String,
        required: true,
    },
    started: {
        type: Date,
        required: true,
    },
    expires: {
        type: Date,
        required: true,
    },
});

export type SessionType = InferSchemaType<typeof sessionSchema>;
const Session =
    (mongoose.models.Session as mongoose.Model<SessionType>) ||
    mongoose.model<SessionType>("Session", sessionSchema);
export default Session;
