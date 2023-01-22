"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelQuery = void 0;
const db_1 = require("./db");
exports.ChannelQuery = {
    channel: async (_root, args) => {
        const { id } = args;
        return await (0, db_1.getChannelById)(id);
    },
};
