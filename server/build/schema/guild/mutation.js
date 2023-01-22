"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildMutation = void 0;
const errors_1 = require("../../utils/errors");
const db_1 = require("./db");
exports.GuildMutation = {
    createGuild: async (root, args, context) => {
        if (!context.user) {
            throw new errors_1.AuthenticationError("Unauthorized");
        }
        return await (0, db_1.addGuild)(args.name, context.user);
    },
};
