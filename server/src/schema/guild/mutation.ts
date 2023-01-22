import { IContext } from "@models/Resolvers";
import { AuthenticationError } from "@utils/errors";
import { addGuild } from "./db";

export const GuildMutation = {
	createGuild: async (
		root: any,
		args: { name: string },
		context: IContext
	) => {
		if (!context.user) {
			throw new AuthenticationError("Unauthorized");
		}

		return await addGuild(args.name, context.user);
	},
};
