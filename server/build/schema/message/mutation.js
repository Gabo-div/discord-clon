"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageMutation = void 0;
const PubSub_1 = require("../../models/PubSub");
const errors_1 = require("../../utils/errors");
const pubsub_1 = require("../../utils/pubsub");
const db_1 = require("../../schema/channel/db");
const db_2 = require("./db");
exports.MessageMutation = {
    sendMessage: async (_root, args, context) => {
        const { channel_id, content } = args;
        if (!context.user) {
            throw new errors_1.AuthenticationError("Unauthorized");
        }
        const channel = await (0, db_1.getChannelById)(channel_id);
        if (!channel) {
            throw new errors_1.NotFoundError("Channel not found");
        }
        const isRecipient = channel.recipients.findIndex((user) => { var _a; return ((_a = context.user) === null || _a === void 0 ? void 0 : _a._id.toString()) === user._id.toString(); }) !== -1;
        if (!isRecipient) {
            throw new errors_1.ForbiddenError("You not are recipient of this channel");
        }
        if (content.length === 0) {
            throw new errors_1.UserInputError("Invalid message content");
        }
        const message = await (0, db_2.sendMessage)(context.user._id, content, channel_id);
        const pulatedMessage = await message.populate("author");
        pubsub_1.pubsub.publish(PubSub_1.PubSubType.MESSAGE_SENT, {
            newMessage: pulatedMessage,
        });
        return pulatedMessage;
    },
};
