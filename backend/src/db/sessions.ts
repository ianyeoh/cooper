import mongoose from "mongoose";
const { Schema } = mongoose;

interface ISession {
    username: string;
    ip: string;
    userAgent: string;
    started: Date;
    expires: Date;
}

const sessionSchema = new Schema<ISession>({
    username: String,
    ip: String,
    userAgent: String,
    started: Date,
    expires: Date,
});

const Session =
    (mongoose.models.Session as mongoose.Model<ISession>) ||
    mongoose.model<ISession>("Session", sessionSchema);

export default Session;
