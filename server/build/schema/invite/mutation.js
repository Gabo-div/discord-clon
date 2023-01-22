"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteMutation = void 0;
const errors_1 = require("../../utils/errors");
const db_1 = require("./db");
exports.InviteMutation = {
    createGuildInvite: async (root, args, context) => {
        if (!context.user) {
            throw new errors_1.AuthenticationError("Unauthorized");
        }
        return await (0, db_1.addGuildInvitation)(context.user, args.channel_id, args.guild_id);
    },
    joinGuild: async (root, args, context) => {
        if (!context.user) {
            throw new errors_1.AuthenticationError("Unauthorized");
        }
        return await (0, db_1.joinGuild)(context.user, args.invite_id);
    },
};
