import fastify from "fastify";
import fastifySocketio from "fastify-socket.io";
import dotenv from "dotenv";

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

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

app.register(fastifySocketio);

process.on("beforeExit", async () => {
  await app.close();
})

app.listen({ port: PORT, host: ADDRESS, exclusive: true }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});

// https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
