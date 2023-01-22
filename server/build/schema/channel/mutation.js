"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelMutation = void 0;
const errors_1 = require("../../utils/errors");
const db_1 = require("./db");
exports.ChannelMutation = {
    createGuildChannel: async (_root, args, context) => {
        const { name, type, guildId } = args;
        if (!context.user) {
            throw new errors_1.AuthenticationError("Unauthorized");
        }
        return await (0, db_1.addGuildChannel)(name, type, guildId, context.user);
    },
    createGuildChannelInCategory: async (_root, args, context) => {
        const { name, type, guildId, categoryId } = args;
        if (!context.user) {
            throw new errors_1.AuthenticationError("Unauthorized");
        }
        return await (0, db_1.addGuildChannelToCategory)(name, type, guildId, categoryId, context.user);
    },
};
