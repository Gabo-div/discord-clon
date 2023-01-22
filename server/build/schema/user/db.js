"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = exports.getUserByToken = exports.getUserByEmail = exports.getUserById = exports.UserModel = void 0;
// Database scheme and helper functions
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const isEmail_1 = __importDefault(require("validator/lib/isEmail"));
const user_1 = require("../../utils/user");
const errors_1 = require("../../utils/errors");
const UserSchema = new mongoose_1.Schema({
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        minlength: 2,
        maxlength: 32,
        required: true,
    },
    discriminator: {
        type: String,
        length: 4,
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        validate: [isEmail_1.default, "Email address is invalid"],
    },
    avatar: {
        type: String,
        required: false,
    },
    verified: {
        type: Boolean,
        default: false,
    },
});
UserSchema.plugin(mongoose_unique_validator_1.default);
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
const getUserById = async (id) => {
    return await exports.UserModel.findOne({ _id: id });
};
exports.getUserById = getUserById;
const getUserByEmail = async (email) => {
    return await exports.UserModel.findOne({ email });
};
exports.getUserByEmail = getUserByEmail;
const getUserByToken = async (token) => {
    try {
        const dToken = await (0, user_1.verifyToken)(token);
        if (typeof dToken === "string" || !(dToken === null || dToken === void 0 ? void 0 : dToken._id))
            return null;
        const user = await (0, exports.getUserById)(dToken._id);
        if (!user)
            return null;
        return user;
    }
    catch (error) {
        return null;
    }
};
exports.getUserByToken = getUserByToken;
const addUser = async (username, email, password) => {
    const hashedPassword = await (0, user_1.cryptPassword)(password).catch((error) => {
        throw new errors_1.InternalServerError("An error has ocurred with your password");
    });
    const usersWithSameUsername = await exports.UserModel.find({ username });
    const discriminator = (0, user_1.createDiscriminator)(usersWithSameUsername.length);
    if (!discriminator) {
        throw new errors_1.UserInputError("Too many users with this username");
    }
    const newUser = new exports.UserModel({
        username,
        email,
        password: hashedPassword,
        discriminator,
    });
    return await newUser.save().catch((error) => {
        throw new errors_1.UserInputError(error.message);
    });
};
exports.addUser = addUser;
