import fastifySocketIO from "./fastifyPlugins/socketio.ts";

import fastify, { FastifyInstance } from "fastify";
import fastifySensible from "@fastify/sensible";

const ENVIRONMENT = process.env.NODE_ENV || "development";

export interface CreateServerOptions {
    port: number;
    host: string;
    environment?: string;
}

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

function createServer(options: CreateServerOptions): FastifyInstance {
  const app = fastify({
    logger: LOGGING[options.environment || ENVIRONMENT] ?? true,
  });

  app.register(fastifySocketIO);
  app.register(fastifySensible);

  process.on("beforeExit", async () => {
    await app.close();
  });

  app.listen(options).catch((err) => {
    app.log.error(err);
    process.exit(1);
  });

  return app;
}

export default createServer;