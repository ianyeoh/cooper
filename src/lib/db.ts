import mongoose from "mongoose";
import "@/lib/envConfig";

async function connectToDb(): Promise<
    | {
          success: true;
      }
    | {
          success: false;
          error: string;
      }
> {
    /* Get connection from dotenv (.env) config file in project root. */
    const { MONGO_URL, MONGO_DB } = process.env;
    if (MONGO_URL == null || MONGO_DB == null) {
        return {
            success: false,
            error: "Missing either MONGO_URL or MONGO_DB in .env configuration file.",
        };
    }

    // If active connection already exists
    if (mongoose.connections[0].readyState) return { success: true };

    try {
        await mongoose.connect(MONGO_URL, {
            dbName: MONGO_DB,
        });
        return { success: true };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: "Failed to connect to MongoDB.",
        };
    }
}

export default connectToDb;
