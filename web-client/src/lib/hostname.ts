let hostname: string = "";

if (process.env.HOSTNAME != null) {
    hostname = process.env.HOSTNAME;
} else if (process.env.NODE_ENV === "development") {
    // default to localhost:3000 if in development mode
    hostname = "http://localhost:3000";
} else {
    throw new Error(
        "No hostname configured and server is running in production mode. Please add value for HOSTNAME to dotenv file."
    );
}

export default hostname;
