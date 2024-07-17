import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config({
    path: "./env"
});

connectDB()

.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`\n Server is running on port ${process.env.PORT}`);
    });
    console.log("Connected to MongoDB");
})
.catch((error) => {
    console.error(error.message);
    process.exit(1);
});