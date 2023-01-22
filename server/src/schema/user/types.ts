// Grahpql types, queries and mutations
// use "extend type" notation in the schema query and mutation type

export const UserTypes = `#graphql
    type User {
        _id: ID!
        username: String!
        discriminator: String!
        avatar: String
        email: String!
        verified: Boolean!
        guilds: [Guild]
    }

    extend type Query {
        user(id: ID!): User
        currentUser: User
    }

    extend type Mutation {
        registerUser(username: String!, email: String!, password: String!): User
        loginUser(email: String!, password: String!): Token
    }
`;
