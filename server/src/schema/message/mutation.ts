import { PubSubType } from "@models/PubSub";
import { IContext } from "@models/Resolvers";
import {
	AuthenticationError,
	ForbiddenError,
	NotFoundError,
	UserInputError,
} from "@utils/errors";
import { pubsub } from "@utils/pubsub";
import { ObjectId } from "mongoose";
import { getChannelById } from "schema/channel/db";
import { MessageModel, sendMessage } from "./db";

export const MessageMutation = {
	sendMessage: async (
		_root: any,
		args: { content: string; channel_id: ObjectId },
		context: IContext
	) => {
		const { channel_id, content } = args;

		if (!context.user) {
			throw new AuthenticationError("Unauthorized");
		}

		const channel = await getChannelById(channel_id);

		if (!channel) {
			throw new NotFoundError("Channel not found");
		}

		const isRecipient =
			channel.recipients.findIndex(
				(user) => context.user?._id.toString() === user._id.toString()
			) !== -1;

		if (!isRecipient) {
			throw new ForbiddenError("You not are recipient of this channel");
		}

		if (content.length === 0) {
			throw new UserInputError("Invalid message content");
		}

		const message = await sendMessage(
			context.user._id,
			content,
			channel_id
		);

		const pulatedMessage = await message.populate("author");

		pubsub.publish(PubSubType.MESSAGE_SENT, {
			newMessage: pulatedMessage,
		});

		return pulatedMessage;
	},
};
