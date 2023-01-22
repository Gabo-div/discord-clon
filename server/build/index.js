"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("./utils/db");
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const express_1 = __importDefault(require("express"));
const schema_1 = require("./schema");
const body_parser_1 = require("body-parser");
const db_1 = require("./schema/user/db");
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const schema_2 = require("@graphql-tools/schema");
const ws_1 = require("ws");
const ws_2 = require("graphql-ws/lib/use/ws");
const socket_io_1 = require("socket.io");
const sockets_1 = require("./sockets");
const startServer = async () => {
    const app = (0, express_1.default)();
    const schema = (0, schema_2.makeExecutableSchema)({ typeDefs: schema_1.typeDefs, resolvers: schema_1.resolvers });
    const httpServer = (0, http_1.createServer)(app);
    const subscriptionsServer = new ws_1.WebSocketServer({
        server: httpServer,
        path: "/graphql",
    });
    const io = new socket_io_1.Server(httpServer, {
        path: "/voice",
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    (0, sockets_1.startSocketServer)(io);
    const serverCleanup = (0, ws_2.useServer)({
        schema,
        context: async (ctx) => {
            const token = ctx.connectionParams
                ? ctx.connectionParams.authorization
                : "";
            const user = await (0, db_1.getUserByToken)(token);
            return { user };
        },
    }, subscriptionsServer);
    const server = new server_1.ApolloServer({
        schema,
        formatError: (formattedError) => {
            var _a;
            return {
                message: formattedError.message,
                extensions: Object.assign(Object.assign({}, formattedError.extensions), { stacktrace: process.env.NODE_ENV === "production"
                        ? undefined
                        : (_a = formattedError.extensions) === null || _a === void 0 ? void 0 : _a.stacktrace }),
            };
        },
        plugins: [
            (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });
    await server.start();
    app.use("/graphql", (0, cors_1.default)(), (0, body_parser_1.json)(), (0, express4_1.expressMiddleware)(server, {
        context: async ({ req }) => {
            const token = req.headers.authorization || "";
            const user = await (0, db_1.getUserByToken)(token);
            return { user };
        },
    }));
    httpServer.listen(process.env.PORT, () => {
        console.log(`Server runing in http://localhost:${process.env.PORT}`);
    });
};
startServer();
