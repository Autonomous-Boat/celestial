import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { Server, ServerOptions } from "socket.io";

export interface FastifySocketIOOptions extends ServerOptions {};

declare module "fastify" {
    interface FastifyInstance {
        io: Server;
    }
}

const plugin: FastifyPluginAsync<FastifySocketIOOptions> = async (fastify, options) => {
  const io: Server = new Server(fastify.server, options);

  fastify.decorate("io", io);
  fastify.addHook("onClose", (_, done) => {
    io.close();
    done();
  });
};

export default fastifyPlugin(plugin, {
    fastify: "4.x",
    name: "fastify-socketio",
});