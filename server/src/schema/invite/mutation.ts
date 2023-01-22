import { IContext } from "@models/Resolvers";
import { AuthenticationError } from "@utils/errors";
import { addGuildInvitation, joinGuild } from "./db";

export const InviteMutation = {
	createGuildInvite: async (
		root: any,
		args: { channel_id: string; guild_id: string },
		context: IContext
	) => {
		if (!context.user) {
			throw new AuthenticationError("Unauthorized");
		}

		return await addGuildInvitation(
			context.user,
			args.channel_id,
			args.guild_id
		);
	},

	joinGuild: async (
		root: any,
		args: { invite_id: string },
		context: IContext
	) => {
		if (!context.user) {
			throw new AuthenticationError("Unauthorized");
		}

		return await joinGuild(context.user, args.invite_id);
	},
};
