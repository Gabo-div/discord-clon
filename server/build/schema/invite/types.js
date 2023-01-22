"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteTypes = void 0;
exports.InviteTypes = `#graphql
    type Invite {
        _id: ID!
        inviter: User!
        channel: Channel!
        guild: Guild
    }

    extend type Query {
        invite(id: ID!): Invite
    }

    extend type Mutation {
        createGuildInvite(channel_id: String!, guild_id: String!): Invite
        joinGuild(invite_id: String!): Guild
    }
`;
