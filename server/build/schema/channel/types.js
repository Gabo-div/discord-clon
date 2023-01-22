"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelTypes = void 0;
exports.ChannelTypes = `#graphql
    enum ChannelType{
        DM
        GROUP_DM

        GUILD_TEXT
        GUILD_VOICE
        GUILD_CATEGORY
    }

    type Channel {
       name: String!
       type: ChannelType!
       position: Int!
       recipients: [User]!
       icon: String
       owner_id: ID!
       guild_id: ID
       channels: [Channel]
       _id: ID!
    }

    extend type Query {
        channel(id: ID!): Channel
    }

    extend type Mutation {
        createGuildChannelInCategory(name: String!,type: ChannelType!, guildId: ID!, category: ID!): Channel
        createGuildChannel(name: String!,type: ChannelType!, guildId: ID!): Channel
    }
`;
