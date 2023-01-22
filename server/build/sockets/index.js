"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSocketServer = void 0;
const voiceChannel_1 = require("./voiceChannel");
const startSocketServer = (io) => {
    io.on("connection", (socket) => {
        console.log("conectado");
        (0, voiceChannel_1.voiceChannelController)(socket);
    });
};
exports.startSocketServer = startSocketServer;
