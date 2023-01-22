import { getInviteById } from "./db";

export const InviteQuery = {
	invite: async (root: any, args: { id: string }) => {
		return await getInviteById(args.id);
	},
};
