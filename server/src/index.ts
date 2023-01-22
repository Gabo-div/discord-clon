import dotenv from "dotenv";
dotenv.config();
import "@utils/db";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import { typeDefs, resolvers } from "./schema";
import { json } from "body-parser";
import { getUserByToken } from "schema/user/db";
import { IContext } from "@models/Resolvers";
import cors from "cors";
import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { Server as IoServer } from "socket.io";
import { startSocketServer } from "sockets";

const startServer = async () => {
	const app = express();

	const schema = makeExecutableSchema({ typeDefs, resolvers });
	const httpServer = createServer(app);

	const subscriptionsServer = new WebSocketServer({
		server: httpServer,
		path: "/graphql",
	});

	const io = new IoServer(httpServer, {
		path: "/voice",
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
		},
	});

	startSocketServer(io);

	const serverCleanup = useServer(
		{
			schema,
			context: async (ctx) => {
				const token = ctx.connectionParams
					? (ctx.connectionParams.authorization as string)
					: "";

				const user = await getUserByToken(token);

				return { user };
			},
		},
		subscriptionsServer
	);

	const server = new ApolloServer<IContext>({
		schema,
		formatError: (formattedError) => {
			return {
				message: formattedError.message,
				extensions: {
					...formattedError.extensions,
					stacktrace:
						process.env.NODE_ENV === "production"
							? undefined
							: formattedError.extensions?.stacktrace,
				},
			};
		},
		plugins: [
			ApolloServerPluginDrainHttpServer({ httpServer }),
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

	app.use(
		"/graphql",
		cors<cors.CorsRequest>(),
		json(),
		expressMiddleware(server, {
			context: async ({ req }) => {
				const token = req.headers.authorization || "";

				const user = await getUserByToken(token);

				return { user };
			},
		})
	);

	httpServer.listen(process.env.PORT, () => {
		console.log(`Server runing in http://localhost:${process.env.PORT}`);
	});
};

startServer();
