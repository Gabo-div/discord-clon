export const InviteTypes = `#graphql
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
        createGuildInvite(channel_id: ID!, guild_id: ID!): Invite
        joinGuild(invite_id: ID!): Guild
    }
`;
