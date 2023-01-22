import { Schema, model, ObjectId } from "mongoose";
import { IInvite } from "@models/Invite";
import { IDBUser, IUser } from "@models/User";
import { getChannelById } from "schema/channel/db";
import { getGuildById, GuildModel } from "schema/guild/db";
import { ForbiddenError, NotFoundError, UserInputError } from "@utils/errors";
import { ChannelType } from "@models/Channel";

const InviteSchema = new Schema<IInvite>({
	guild: {
		type: Schema.Types.ObjectId,
		ref: "Guild",
	},
	channel: {
		type: Schema.Types.ObjectId,
		ref: "Channel",
	},
	inviter: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
});

export const InviteModel = model<IInvite>("Invite", InviteSchema);

export const getInviteById = async (id: string | ObjectId) => {
	return await InviteModel.findOne({ _id: id })
		.populate("guild")
		.populate("channel")
		.populate("inviter");
};

export const joinGuild = async (
	user: IUser | IDBUser,
	invite_id: ObjectId | string
) => {
	const invite = await getInviteById(invite_id);

	if (!invite) throw new NotFoundError("Invite not found");

	const pupulatedGuildMember = await invite.populate({
		path: "guild",
		populate: { path: "members" },
	});

	const isUserMember =
		pupulatedGuildMember.guild.members.findIndex(
			(member) => member._id.toString() === user._id.toString()
		) !== -1;

	if (isUserMember)
		throw new ForbiddenError("You are already a member of this guild");

	return await GuildModel.findOneAndUpdate(
		{ _id: invite.guild._id },
		{ $push: { members: user._id } },
		{ new: true }
	).populate({
		path: "channels",
		populate: [
			{ path: "recipients" },
			{ path: "channels", populate: "recipients" },
		],
	});
};

export const addGuildInvitation = async (
	user: IUser | IDBUser,
	channel_id: ObjectId | string,
	guild_id: ObjectId | string
) => {
	const channel = await getChannelById(channel_id);
	const guild = await getGuildById(guild_id);

	if (!channel) throw new NotFoundError("Channel not found");
	if (!guild) throw new NotFoundError("Guild not found");

	if (guild.owner_id.toString() !== user._id.toString())
		throw new ForbiddenError("You not are owner of the guild");

	let isChannelFromGuild =
		guild.channels.findIndex(
			(ch) => ch._id.toString() === channel._id.toString()
		) !== -1;

	if (!isChannelFromGuild) {
		guild.channels.forEach((ct) => {
			if (ct.type === ChannelType.GUILD_CATEGORY && ct.channels) {
				isChannelFromGuild =
					ct.channels.findIndex(
						(ch) => ch._id.toString() === channel._id.toString()
					) !== -1;
			}
		});
	}

	if (!isChannelFromGuild)
		throw new UserInputError("The channel is not from the guild");

	const invitationFromSameUser = await InviteModel.findOne({
		guild: guild_id,
		channel: channel_id,
		inviter: user._id,
	});

	if (invitationFromSameUser) {
		return await invitationFromSameUser.populate("guild").then((ch) => {
			ch.populate("channel").then((ch2) => {
				ch2.populate("inviter");
			});
		});
	}

	const invite = new InviteModel({
		guild: guild_id,
		channel: channel_id,
		inviter: user._id,
	});

	await invite.save();

	return await getInviteById(invite._id);
};
