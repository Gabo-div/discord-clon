"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = exports.typeDefs = void 0;
const graphql_iso_date_1 = require("graphql-iso-date");
const user_1 = require("./user");
const channel_1 = require("./channel");
const guild_1 = require("./guild");
const invite_1 = require("./invite");
const message_1 = require("./message");
// Wrap all schemas and export it
exports.typeDefs = `#graphql
    scalar Date

    type Token {
        tokenValue: String!
    }

    type Query
    type Mutation
    type Subscription
    
    ${user_1.UserTypes}
    ${channel_1.ChannelTypes}
    ${guild_1.GuildTypes}
    ${message_1.MessageTypes}
    ${invite_1.InviteTypes}
`;
exports.resolvers = {
    Date: graphql_iso_date_1.GraphQLDateTime,
    Query: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, user_1.UserQuery), guild_1.GuildQuery), channel_1.ChannelQuery), message_1.MessageQuery), invite_1.InviteQuery),
    Mutation: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, user_1.UserMutation), guild_1.GuildMutation), channel_1.ChannelMutation), message_1.MessageMutation), invite_1.InviteMutation),
    Subscription: Object.assign({}, message_1.MessageSubscription),
    User: user_1.UserResolvers,
};
