export const GuildTypes = `#graphql
    type Guild {
        _id: ID!
        name: String!
        icon: String
        owner_id: ID!
        members: [User]!
        channels: [Channel]!
    }

     extend type Query {
        guild(id: ID!): Guild
    }

    extend type Mutation {
        createGuild(name: String!): Guild
    }
`;
