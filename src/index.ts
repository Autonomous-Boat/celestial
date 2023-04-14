import fastify from "fastify";
import fastifySocketIO from "./fastifyPlugins/socketio.ts";
import dotenv from "dotenv";

dotenv.config();

const LOGGING = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  production: true,
  test: false,
};
const PORT = Number(process.env.PORT) || 3000;
const ADDRESS = process.env.ADDRESS || "0.0.0.0";

const app = fastify({
  logger: LOGGING[process.env.ENVIRONMENT] ?? true,
});

app.register(fastifySocketIO);

process.on("beforeExit", async () => {
  await app.close();
})

app.listen({ port: PORT, host: ADDRESS, exclusive: true }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});

// https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
// https://www.fastify.io/docs/latest/Reference/TypeScript/
