import { IMessage } from "@models/Message";
import { PubSubType } from "@models/PubSub";
import { IContext } from "@models/Resolvers";
import { NotFoundError } from "@utils/errors";
import { pubsub } from "@utils/pubsub";
import { withFilter } from "graphql-subscriptions";
import { ObjectId } from "mongoose";
import { getChannelById } from "schema/channel/db";

export const MessageSubscription = {
	newMessage: {
		subscribe: withFilter(
			() => pubsub.asyncIterator(PubSubType.MESSAGE_SENT),
			async (
				root: {
					newMessage: IMessage;
				},
				args: { channel_id: ObjectId },
				context: IContext
			) => {
				try {
					const channel = await getChannelById(args.channel_id);

					if (!channel) {
						throw new NotFoundError("Channel not found");
					}

					const isUserAuth = Boolean(context.user);
					const isUserRecipient =
						channel.recipients.findIndex(
							(user) =>
								context.user?._id.toString() ===
								user._id.toString()
						) !== -1;

					const isMessageSameChannel =
						root.newMessage.channel_id.toString() ===
						args.channel_id.toString();

					return (
						isUserAuth && isUserRecipient && isMessageSameChannel
					);
				} catch (error) {
					console.log(error);
					return false;
				}
			}
		),
	},
};
