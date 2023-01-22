"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addGuild = exports.getGuildById = exports.getGuildsWithMember = exports.GuildModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const errors_1 = require("../../utils/errors");
const GuildSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    icon: {
        type: String,
        required: false,
    },
    members: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    channels: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Channel",
        },
    ],
    owner_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
});
GuildSchema.plugin(mongoose_unique_validator_1.default);
exports.GuildModel = (0, mongoose_1.model)("Guild", GuildSchema);
const getGuildsWithMember = async (memberId) => {
    try {
        const guilds = await exports.GuildModel.find({ members: memberId })
            .populate("members")
            .populate({
            path: "channels",
            populate: [
                { path: "recipients" },
                { path: "channels", populate: "recipients" },
            ],
        });
        return guilds;
    }
    catch (error) {
        return [];
    }
};
exports.getGuildsWithMember = getGuildsWithMember;
const getGuildById = async (id) => {
    return await exports.GuildModel.findOne({ _id: id })
        .populate("members")
        .populate({
        path: "channels",
        populate: [
            { path: "recipients" },
            { path: "channels", populate: "recipients" },
        ],
    });
};
exports.getGuildById = getGuildById;
const addGuild = async (name, creator) => {
    const guildWithSameName = await exports.GuildModel.findOne({ name });
    if (guildWithSameName) {
        throw new errors_1.UserInputError("Already exists a guild with this name");
    }
    try {
        const newGuild = new exports.GuildModel({
            name,
            owner_id: creator._id,
            channels: [],
            members: [creator._id],
        });
        const saveGuild = await newGuild.save();
        const populatedGuild = await saveGuild.populate("members").then((g) => g.populate({
            path: "channels",
            populate: [
                { path: "recipients" },
                { path: "channels", populate: "recipients" },
            ],
        }));
        return populatedGuild;
    }
    catch (error) {
        throw new errors_1.InternalServerError("An error has ocurred");
    }
};
exports.addGuild = addGuild;
