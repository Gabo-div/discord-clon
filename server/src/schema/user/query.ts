import { IContext } from "@models/Resolvers";
import { getGuildsWithMember } from "schema/guild/db";
import { getUserById } from "./db";

// Query resolvers
export const UserQuery = {
	user: async (_root: any, args: { id: string }) => {
		const { id } = args;

		return await getUserById(id);
	},

	currentUser: async (_root: any, args: null, context: IContext) => {
		return context?.user;
	},
};
