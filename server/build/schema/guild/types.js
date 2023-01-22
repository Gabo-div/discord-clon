"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildTypes = void 0;
exports.GuildTypes = `#graphql
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
