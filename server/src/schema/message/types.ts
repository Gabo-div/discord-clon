export const MessageTypes = `#graphql
    type Message {
        _id: ID!
        author: User!
        content: String!
        channel_id: ID!
        created_at: String!
    }

    type ChannelMessagesRes {
        messages: [Message]!
        nextPage: Boolean!
    }

    extend type Query {
        message(id: ID!): Message
        channelMessages(channel_id: ID!, limit: Int, cursor: String): ChannelMessagesRes
    }

    extend type Mutation {
        sendMessage(content: String!, channel_id: ID!): Message
    }

    extend type Subscription {
        newMessage(channel_id: ID!): Message
    }
`;
