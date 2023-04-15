// Imports
import fastifySocketIO from "./fastifyPlugins/socketio.ts";

import fastify, { FastifyInstance, FastifyPluginCallback } from "fastify";
import { existsSync, mkdirSync } from "fs";
import { dirname } from "path";
import fastifySensible from "@fastify/sensible";

// Reading the environment variable
const ENVIRONMENT = process.env.NODE_ENV || "development";

// Pulgins interface
interface Plugins {
  [key: string]: {
    function: FastifyPluginCallback;
    options: object;
  };
}

// Plugins object
const PLUGINS: Plugins = {
  socketio: {
    function: fastifySocketIO,
    options: {},
  },
  sensible: {
    function: fastifySensible,
    options: {},
  },
};

// Format date
function formatDateAndTime(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;
}

// Options for the server
export interface CreateServerOptions {
  port: number;
  host: string;
  environment?: string;
}

// Logging setup for different environments
const LOGGING = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
    level: "debug",
    file: `./logs/${formatDateAndTime(new Date())}-dev.log`,
  },
  production: {
    level: "info",
    file: `./logs/${formatDateAndTime(new Date())}-prod.log`,
  },
  test: {
    level: "silent",
  },
};

// Creating the server and exporting it
function createServer(options: CreateServerOptions): FastifyInstance {
  // Setting up the logging
  const loggingOptions = LOGGING[options.environment || ENVIRONMENT] ?? true;

  // Creating the logs folder if it doesn't exist
  if (typeof loggingOptions === "object" && loggingOptions.file) {
    const logPath = dirname(loggingOptions.file);
    if (!existsSync(logPath)) {
      mkdirSync(logPath, { recursive: true });
    }
  }

  // Creating the server
  const app = fastify({
    logger: LOGGING[options.environment || ENVIRONMENT] ?? true,
  });
  app.log.debug("Server created");

  // Registering the plugins by joining the default plugins with the ones passed in the options
  for (const plugin in PLUGINS) {
    app.register(PLUGINS[plugin].function, PLUGINS[plugin].options);
    app.log.debug(`Registered plugin: ${plugin}`);
  }
  app.log.debug("Registered all plugins");

  // Closing the server on exit
  process.on("beforeExit", async () => {
    await app.close();
  });
  app.log.debug("Registered process exit handler");

  // Starting the server
  app
    .listen(options)
    .then(() => {
      app.log.debug("Server started");
    })
    .catch((err) => {
      app.log.error(err);
      process.exit(1);
    });

  // Returning the server
  return app;
}

// Exporting the function
export default createServer;
