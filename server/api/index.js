import dotenv from "dotenv";
import app from "../app.js"; // ✅ use ES import with .js extension

dotenv.config();

// Vercel treats this file as a serverless function.
// Exporting the Express app directly lets @vercel/node handle requests.
export default app; // ✅ ES Module export
