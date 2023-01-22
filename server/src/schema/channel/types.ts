export const ChannelTypes = `#graphql
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
       subchannel: Boolean
    }

    extend type Query {
        channel(id: ID!): Channel
    }

    input EditGuildChannelInput {
        name: String
        position: Int
    }


    extend type Mutation {
        createGuildChannelInCategory(name: String!,type: ChannelType!, guildId: ID!, categoryId: ID!): Channel
        createGuildChannel(name: String!,type: ChannelType!, guildId: ID!): Channel
        deleteGuildChannel( channelId: ID!): Channel
        editGuildChannel( channelId: ID!, input: EditGuildChannelInput!): Channel
    }
`;
