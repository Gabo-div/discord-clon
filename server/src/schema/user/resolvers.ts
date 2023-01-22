import { IDBUser } from "@models/User";
import { getGuildsWithMember } from "schema/guild/db";

// Type fields resolvers
export const UserResolvers = {
	guilds: async (root: IDBUser) => {
		return await getGuildsWithMember(root._id);
	},
};
