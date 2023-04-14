// import fastify and set up socket.io
import fastify from "fastify";
import fastifySocketio from "fastify-socket.io";
const PORT = Number(process.env.PORT) || 3000;
const ADDRESS = process.env.ADDRESS || "0.0.0.0";
const app = fastify();
app.register(fastifySocketio);
const start = async () => {
    try {
        await app.listen({ port: PORT, host: ADDRESS });
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=index.js.map