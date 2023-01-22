"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSubscription = void 0;
const PubSub_1 = require("../../models/PubSub");
const errors_1 = require("../../utils/errors");
const pubsub_1 = require("../../utils/pubsub");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const db_1 = require("../../schema/channel/db");
exports.MessageSubscription = {
    newMessage: {
        subscribe: (0, graphql_subscriptions_1.withFilter)(() => pubsub_1.pubsub.asyncIterator(PubSub_1.PubSubType.MESSAGE_SENT), async (root, args, context) => {
            try {
                const channel = await (0, db_1.getChannelById)(args.channel_id);
                if (!channel) {
                    throw new errors_1.NotFoundError("Channel not found");
                }
                const isUserAuth = Boolean(context.user);
                const isUserRecipient = channel.recipients.findIndex((user) => {
                    var _a;
                    return ((_a = context.user) === null || _a === void 0 ? void 0 : _a._id.toString()) ===
                        user._id.toString();
                }) !== -1;
                const isMessageSameChannel = root.newMessage.channel_id.toString() ===
                    args.channel_id.toString();
                return (isUserAuth && isUserRecipient && isMessageSameChannel);
            }
            catch (error) {
                console.log(error);
                return false;
            }
        }),
    },
};
