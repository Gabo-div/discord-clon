"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addGuildChannel = exports.addGuildChannelToCategory = exports.getChannelById = exports.ChannelModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const guild_1 = require("../../schema/guild");
const errors_1 = require("../../utils/errors");
const ChannelSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    position: {
        type: Number,
        required: true,
    },
    icon: {
        type: String,
        required: false,
    },
    recipients: [
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
    guild_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
    },
    subchannel: {
        type: Boolean,
        required: false,
    },
});
ChannelSchema.plugin(mongoose_unique_validator_1.default);
exports.ChannelModel = (0, mongoose_1.model)("Channel", ChannelSchema);
const getChannelById = async (id) => {
    return await exports.ChannelModel.findOne({ _id: id })
        .populate("recipients")
        .populate({
        path: "channels",
        populate: "channels",
    });
};
exports.getChannelById = getChannelById;
const addGuildChannelToCategory = async (name, type, guildId, categoryId, user) => {
    const guild = await guild_1.GuildModel.findOne({ _id: guildId }).catch((error) => {
        throw new errors_1.NotFoundError("Guild not found");
    });
    const category = await (0, exports.getChannelById)(categoryId).catch((error) => {
        throw new errors_1.NotFoundError("Category not found");
    });
    if (!guild)
        throw new errors_1.NotFoundError("Guild not found");
    if (!category)
        throw new errors_1.NotFoundError("Category not found");
    if (guild.owner_id.toString() !== user._id.toString())
        throw new errors_1.ForbiddenError("You are not the guild owner");
    if (type !== "GUILD_TEXT" /* ChannelType.GUILD_TEXT */ && type !== "GUILD_VOICE" /* ChannelType.GUILD_VOICE */) {
        throw new errors_1.UserInputError("Channel type is not allowed");
    }
    const newChannel = new exports.ChannelModel({
        name,
        type,
        position: 0,
        recipients: type === "GUILD_VOICE" /* ChannelType.GUILD_VOICE */ ? [] : guild.members,
        owner_id: guild.owner_id,
        guild_id: guild._id,
        subchannel: true,
    });
    const savedChannel = await newChannel.save();
    const populatedChannel = await savedChannel
        .populate("recipients")
        .then((ch) => ch.populate({
        path: "channels",
        populate: "channels",
    }));
    guild.channels = [...guild.channels, newChannel];
    guild.save();
    category.channels = [...(category.channels || []), newChannel];
    category.save();
    return populatedChannel;
};
exports.addGuildChannelToCategory = addGuildChannelToCategory;
const addGuildChannel = async (name, type, guildId, user) => {
    const guild = await guild_1.GuildModel.findOne({ _id: guildId }).catch((error) => {
        throw new errors_1.NotFoundError("Guild not found");
    });
    if (!guild)
        throw new errors_1.NotFoundError("Guild not found");
    if (guild.owner_id.toString() !== user._id.toString())
        throw new errors_1.ForbiddenError("You are not the guild owner");
    if (type !== "GUILD_TEXT" /* ChannelType.GUILD_TEXT */ &&
        type !== "GUILD_CATEGORY" /* ChannelType.GUILD_CATEGORY */ &&
        type !== "GUILD_VOICE" /* ChannelType.GUILD_VOICE */) {
        throw new errors_1.UserInputError("Channel type is not allowed");
    }
    const newChannel = new exports.ChannelModel({
        name,
        type,
        position: 0,
        recipients: type === "GUILD_VOICE" /* ChannelType.GUILD_VOICE */ ? [] : guild.members,
        owner_id: guild.owner_id,
        guild_id: guild._id,
    });
    const savedChannel = await newChannel.save();
    const populatedChannel = await savedChannel
        .populate("recipients")
        .then((ch) => ch.populate({
        path: "channels",
        populate: "channels",
    }));
    guild.channels = [...guild.channels, newChannel];
    guild.save();
    return populatedChannel;
};
exports.addGuildChannel = addGuildChannel;
