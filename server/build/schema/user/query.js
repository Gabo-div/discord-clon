"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserQuery = void 0;
const db_1 = require("./db");
// Query resolvers
exports.UserQuery = {
    user: async (_root, args) => {
        const { id } = args;
        return await (0, db_1.getUserById)(id);
    },
    currentUser: async (_root, args, context) => {
        return context === null || context === void 0 ? void 0 : context.user;
    },
};
