"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMutation = void 0;
// Mutation resolvers
const errors_1 = require("../../utils/errors");
const user_1 = require("../../utils/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("./db");
exports.UserMutation = {
    registerUser: async (_root, args) => {
        const { username, email, password } = args;
        if (password.length < 8 || password.length > 20) {
            throw new errors_1.UserInputError("Password must be between 8 and 20 characters");
        }
        const user = await (0, db_1.addUser)(username, email, password);
        return user;
    },
    loginUser: async (_root, args) => {
        const { email, password } = args;
        const user = await (0, db_1.getUserByEmail)(email).catch(() => {
            throw new errors_1.UserInputError("Wrong credentials");
        });
        if (!user) {
            throw new errors_1.UserInputError("Wrong credentials");
        }
        if (!bcrypt_1.default.compareSync(password, user.password)) {
            throw new errors_1.UserInputError("Wrong credentials");
        }
        return {
            tokenValue: (0, user_1.createToken)(user),
        };
    },
};
