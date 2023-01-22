import { IContext } from "@models/Resolvers";
import {
	AuthenticationError,
	ForbiddenError,
	NotFoundError,
} from "@utils/errors";
import { getChannelById } from "schema/channel/db";
import {
	getChannelMessages,
	getMessageById,
	getNextChannelMessage,
} from "./db";

// Query resolvers
export const MessageQuery = {
	message: async (_root: any, args: { id: string }) => {
		const { id } = args;

		return await getMessageById(id);
	},
	channelMessages: async (
		_root: any,
		args: {
			limit: number | null;
			cursor: string | null;
			channel_id: string;
		},
		context: IContext
	) => {
		const { limit, cursor, channel_id } = args;

		const channel = await getChannelById(args.channel_id);

		if (!channel) {
			throw new NotFoundError("Channel not found");
		}

		if (!context.user) {
			throw new AuthenticationError("Unauthorized");
		}

		const isUserRecipient =
			channel.recipients.findIndex(
				(user) => context.user?._id.toString() === user._id.toString()
			) !== -1;

		if (!isUserRecipient) {
			throw new ForbiddenError("Unauthorized");
		}

		const defaultLimit = 50;

		const messages = await getChannelMessages(
			channel_id,
			limit || defaultLimit,
			cursor
		);

		const nextMessage = await getNextChannelMessage(
			channel_id,
			messages[messages.length - 1]._id,
			messages[messages.length - 1].created_at
		);

		return { messages, nextPage: Boolean(nextMessage) };
	},
};
