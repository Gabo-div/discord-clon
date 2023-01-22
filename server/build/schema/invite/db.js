"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addGuildInvitation = exports.joinGuild = exports.getInviteById = exports.InviteModel = void 0;
const mongoose_1 = require("mongoose");
const db_1 = require("../../schema/channel/db");
const db_2 = require("../../schema/guild/db");
const errors_1 = require("../../utils/errors");
const InviteSchema = new mongoose_1.Schema({
    guild: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Guild",
    },
    channel: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Channel",
    },
    inviter: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
});
exports.InviteModel = (0, mongoose_1.model)("Invite", InviteSchema);
const getInviteById = async (id) => {
    return await exports.InviteModel.findOne({ _id: id })
        .populate("guild")
        .populate("channel")
        .populate("inviter");
};
exports.getInviteById = getInviteById;
const joinGuild = async (user, invite_id) => {
    const invite = await (0, exports.getInviteById)(invite_id);
    if (!invite)
        throw new errors_1.NotFoundError("Invite not found");
    const pupulatedGuildMember = await invite.populate({
        path: "guild",
        populate: { path: "members" },
    });
    const isUserMember = pupulatedGuildMember.guild.members.findIndex((member) => member._id.toString() === user._id.toString()) !== -1;
    if (isUserMember)
        throw new errors_1.ForbiddenError("You are already a member of this guild");
    return await db_2.GuildModel.findOneAndUpdate({ _id: invite.guild._id }, { $push: { members: user._id } }, { new: true }).populate({
        path: "channels",
        populate: [
            { path: "recipients" },
            { path: "channels", populate: "recipients" },
        ],
    });
};
exports.joinGuild = joinGuild;
const addGuildInvitation = async (user, channel_id, guild_id) => {
    const channel = await (0, db_1.getChannelById)(channel_id);
    const guild = await (0, db_2.getGuildById)(guild_id);
    if (!channel)
        throw new errors_1.NotFoundError("Channel not found");
    if (!guild)
        throw new errors_1.NotFoundError("Guild not found");
    if (guild.owner_id.toString() !== user._id.toString())
        throw new errors_1.ForbiddenError("You not are owner of the guild");
    let isChannelFromGuild = guild.channels.findIndex((ch) => ch._id.toString() === channel._id.toString()) !== -1;
    if (!isChannelFromGuild) {
        guild.channels.forEach((ct) => {
            if (ct.type === "GUILD_CATEGORY" /* ChannelType.GUILD_CATEGORY */ && ct.channels) {
                isChannelFromGuild =
                    ct.channels.findIndex((ch) => ch._id.toString() === channel._id.toString()) !== -1;
            }
        });
    }
    if (!isChannelFromGuild)
        throw new errors_1.UserInputError("The channel is not from the guild");
    const invite = new exports.InviteModel({
        guild: guild_id,
        channel: channel_id,
        inviter: user._id,
    });
    return await invite.save();
};
exports.addGuildInvitation = addGuildInvitation;
