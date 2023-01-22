"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolvers = void 0;
const db_1 = require("../../schema/guild/db");
// Type fields resolvers
exports.UserResolvers = {
    guilds: async (root) => {
        return await (0, db_1.getGuildsWithMember)(root._id);
    },
};
