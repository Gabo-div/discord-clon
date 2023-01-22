import { Schema, model, ObjectId } from "mongoose";
import { ChannelType, EditGuildChannelInput, IChannel } from "@models/Channel";
import uniqueValidator from "mongoose-unique-validator";
import { IDBUser, IUser } from "@models/User";
import { UserModel } from "schema/user";
import { GuildModel } from "schema/guild";
import { ForbiddenError, NotFoundError, UserInputError } from "@utils/errors";

const ChannelSchema = new Schema<IChannel>({
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
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
	channels: [
		{
			type: Schema.Types.ObjectId,
			ref: "Channel",
		},
	],
	owner_id: {
		type: Schema.Types.ObjectId,
		required: true,
	},
	guild_id: {
		type: Schema.Types.ObjectId,
		required: false,
	},
	subchannel: {
		type: Boolean,
		required: false,
	},
});

ChannelSchema.plugin(uniqueValidator);

export const ChannelModel = model<IChannel>("Channel", ChannelSchema);

export const getChannelById = async (id: ObjectId | string) => {
	return await ChannelModel.findOne({ _id: id })
		.populate("recipients")
		.populate({
			path: "channels",
			populate: "channels",
		});
};

export const addGuildChannelToCategory = async (
	name: string,
	type: ChannelType,
	guildId: string,
	categoryId: string,
	user: IUser | IDBUser
) => {
	const guild = await GuildModel.findOne({ _id: guildId }).catch((error) => {
		throw new NotFoundError("Guild not found");
	});

	const category = await getChannelById(categoryId).catch((error) => {
		throw new NotFoundError("Category not found");
	});

	if (!guild) throw new NotFoundError("Guild not found");
	if (!category) throw new NotFoundError("Category not found");

	if (guild.owner_id.toString() !== user._id.toString())
		throw new ForbiddenError("You are not the guild owner");

	if (type !== ChannelType.GUILD_TEXT && type !== ChannelType.GUILD_VOICE) {
		throw new UserInputError("Channel type is not allowed");
	}

	const newChannel = new ChannelModel({
		name,
		type,
		position: 0,
		recipients: type === ChannelType.GUILD_VOICE ? [] : guild.members,
		owner_id: guild.owner_id,
		guild_id: guild._id,
		subchannel: true,
	});

	const savedChannel = await newChannel.save();
	const populatedChannel = await savedChannel
		.populate("recipients")
		.then((ch) =>
			ch.populate({
				path: "channels",
				populate: "channels",
			})
		);

	guild.channels = [...guild.channels, newChannel];
	guild.save();

	category.channels = [...(category.channels || []), newChannel];
	category.save();

	return populatedChannel;
};

export const addGuildChannel = async (
	name: string,
	type: ChannelType,
	guildId: string,
	user: IUser | IDBUser
) => {
	const guild = await GuildModel.findOne({ _id: guildId }).catch((error) => {
		throw new NotFoundError("Guild not found");
	});

	if (!guild) throw new NotFoundError("Guild not found");

	if (guild.owner_id.toString() !== user._id.toString())
		throw new ForbiddenError("You are not the guild owner");

	if (
		type !== ChannelType.GUILD_TEXT &&
		type !== ChannelType.GUILD_CATEGORY &&
		type !== ChannelType.GUILD_VOICE
	) {
		throw new UserInputError("Channel type is not allowed");
	}

	const newChannel = new ChannelModel({
		name,
		type,
		position: 0,
		recipients: type === ChannelType.GUILD_VOICE ? [] : guild.members,
		owner_id: guild.owner_id,
		guild_id: guild._id,
	});

	const savedChannel = await newChannel.save();
	const populatedChannel = await savedChannel
		.populate("recipients")
		.then((ch) =>
			ch.populate({
				path: "channels",
				populate: "channels",
			})
		);

	guild.channels = [...guild.channels, newChannel];
	guild.save();

	return populatedChannel;
};

export const removeGuildChannel = async (
	channelId: string,
	user: IUser | IDBUser
) => {
	const channel = await getChannelById(channelId).catch((error) => {
		throw new NotFoundError("Category not found");
	});
	if (!channel) throw new NotFoundError("Channel not found");

	if (channel.owner_id.toString() !== user._id.toString())
		throw new ForbiddenError("You are not the guild owner");

	if (channel.type !== ChannelType.GUILD_CATEGORY) {
		return await channel.delete();
	}

	channel.channels?.forEach(async (subchannel) => {
		await ChannelModel.deleteOne({ _id: subchannel._id.toString() });
	});

	return await channel.delete();
};

export const updateGuildChannel = async (
	input: EditGuildChannelInput,
	channelId: string,
	user: IUser | IDBUser
) => {
	const channel = await getChannelById(channelId).catch((error) => {
		throw new NotFoundError("Category not found");
	});
	if (!channel) throw new NotFoundError("Channel not found");

	if (channel.owner_id.toString() !== user._id.toString())
		throw new ForbiddenError("You are not the guild owner");

	channel.name = input.name || channel.name;
	channel.position = input.position || channel.position;

	const savedChannel = await channel.save();
	const populatedChannel = await savedChannel
		.populate("recipients")
		.then((ch) =>
			ch.populate({
				path: "channels",
				populate: "channels",
			})
		);

	return populatedChannel;
};
