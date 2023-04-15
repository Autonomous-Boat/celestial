// Imports
import createServer from "./server.ts";
import dotenv from "dotenv";

// Reading the .env file
dotenv.config();

// Getting the port and host from the .env file or environment variables
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.ADDRESS || "0.0.0.0";

// Creating the server
const app = createServer({ host: HOST, port: PORT });
