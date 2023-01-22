import { Server as IoServer } from "socket.io";
import { voiceChannelController } from "./voiceChannel";

export const startSocketServer = (io: IoServer) => {
	io.on("connection", (socket) => {
		console.log("conectado");
		voiceChannelController(socket);
	});
};
