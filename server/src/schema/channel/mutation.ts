import { ChannelType } from "@models/Channel";
import { IContext } from "@models/Resolvers";
import { AuthenticationError } from "@utils/errors";
import { EditGuildChannelInput } from "../../models/Channel";
import {
	addGuildChannel,
	addGuildChannelToCategory,
	removeGuildChannel,
	updateGuildChannel,
} from "./db";

export const ChannelMutation = {
	editGuildChannel: async (
		_root: any,
		args: { channelId: string; input: EditGuildChannelInput },
		context: IContext
	) => {
		const { channelId, input } = args;

		if (!context.user) {
			throw new AuthenticationError("Unauthorized");
		}

		return await updateGuildChannel(input, channelId, context.user);
	},
	deleteGuildChannel: async (
		_root: any,
		args: { channelId: string },
		context: IContext
	) => {
		const { channelId } = args;

		if (!context.user) {
			throw new AuthenticationError("Unauthorized");
		}

		return await removeGuildChannel(channelId, context.user);
	},
	createGuildChannel: async (
		_root: any,
		args: { name: string; type: ChannelType; guildId: string },
		context: IContext
	) => {
		const { name, type, guildId } = args;

		if (!context.user) {
			throw new AuthenticationError("Unauthorized");
		}

		return await addGuildChannel(name, type, guildId, context.user);
	},
	createGuildChannelInCategory: async (
		_root: any,
		args: {
			name: string;
			type: ChannelType;
			guildId: string;
			categoryId: string;
		},
		context: IContext
	) => {
		const { name, type, guildId, categoryId } = args;

		if (!context.user) {
			throw new AuthenticationError("Unauthorized");
		}

		return await addGuildChannelToCategory(
			name,
			type,
			guildId,
			categoryId,
			context.user
		);
	},
};
