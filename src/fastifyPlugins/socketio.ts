import fastifyPlugin from "fastify-plugin";
import { Server } from "socket.io";

export default fastifyPlugin(async (app, opts) => {
    const io: Server = new Server(app.server, opts);

    app.decorate("io", io);
    app.addHook("onClose", (_, done) => {
        io.close();
        done();
    });
}, {
    fastify: ">=4.x",
    name: "fastifySocketio",
});