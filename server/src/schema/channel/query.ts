import { getChannelById } from "./db";

export const ChannelQuery = {
	channel: async (_root: any, args: { id: string }) => {
		const { id } = args;

		return await getChannelById(id);
	},
};
