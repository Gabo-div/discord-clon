"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildQuery = void 0;
const db_1 = require("./db");
exports.GuildQuery = {
    guild: async (root, args) => {
        return await (0, db_1.getGuildById)(args.id);
    },
};
