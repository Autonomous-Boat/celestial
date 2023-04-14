import createServer from "./server.ts";
import dotenv from "dotenv";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.ADDRESS || "0.0.0.0";

const app = createServer({host: HOST, port: PORT});