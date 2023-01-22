import { getGuildById } from "./db";

export const GuildQuery = {
	guild: async (root: any, args: { id: string }) => {
		return await getGuildById(args.id);
	},
};
