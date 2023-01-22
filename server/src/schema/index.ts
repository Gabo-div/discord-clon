import { GraphQLDateTime } from "graphql-iso-date";
import { UserTypes, UserQuery, UserMutation, UserResolvers } from "./user";
import { ChannelTypes, ChannelMutation, ChannelQuery } from "./channel";
import { GuildTypes, GuildQuery, GuildMutation } from "./guild";
import { InviteTypes, InviteQuery, InviteMutation } from "./invite";
import {
	MessageTypes,
	MessageMutation,
	MessageQuery,
	MessageSubscription,
} from "./message";

// Wrap all schemas and export it
export const typeDefs = `#graphql
    scalar Date

    type Token {
        tokenValue: String!
    }

    type Query
    type Mutation
    type Subscription
    
    ${UserTypes}
    ${ChannelTypes}
    ${GuildTypes}
    ${MessageTypes}
    ${InviteTypes}
`;

export const resolvers = {
	Date: GraphQLDateTime,

	Query: {
		...UserQuery,
		...GuildQuery,
		...ChannelQuery,
		...MessageQuery,
		...InviteQuery,
	},

	Mutation: {
		...UserMutation,
		...GuildMutation,
		...ChannelMutation,
		...MessageMutation,
		...InviteMutation,
	},

	Subscription: {
		...MessageSubscription,
	},

	User: UserResolvers,
};
