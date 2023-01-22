"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteQuery = void 0;
const db_1 = require("./db");
exports.InviteQuery = {
    invite: async (root, args) => {
        return await (0, db_1.getInviteById)(args.id);
    },
};
