"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageQuery = void 0;
const errors_1 = require("../../utils/errors");
const db_1 = require("../../schema/channel/db");
const db_2 = require("./db");
// Query resolvers
exports.MessageQuery = {
    message: async (_root, args) => {
        const { id } = args;
        return await (0, db_2.getMessageById)(id);
    },
    channelMessages: async (_root, args, context) => {
        const { limit, cursor, channel_id } = args;
        const channel = await (0, db_1.getChannelById)(args.channel_id);
        if (!channel) {
            throw new errors_1.NotFoundError("Channel not found");
        }
        if (!context.user) {
            throw new errors_1.AuthenticationError("Unauthorized");
        }
        const isUserRecipient = channel.recipients.findIndex((user) => { var _a; return ((_a = context.user) === null || _a === void 0 ? void 0 : _a._id.toString()) === user._id.toString(); }) !== -1;
        if (!isUserRecipient) {
            throw new errors_1.ForbiddenError("Unauthorized");
        }
        const defaultLimit = 50;
        const messages = await (0, db_2.getChannelMessages)(channel_id, limit || defaultLimit, cursor);
        const nextMessage = await (0, db_2.getNextChannelMessage)(channel_id, messages[messages.length - 1]._id, messages[messages.length - 1].created_at);
        return { messages, nextPage: Boolean(nextMessage) };
    },
};
