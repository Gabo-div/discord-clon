import { Schema, model, ObjectId } from "mongoose";
import { IGuild } from "@models/Guild";
import uniqueValidator from "mongoose-unique-validator";
import { IDBUser, IUser } from "@models/User";
import { InternalServerError, UserInputError } from "@utils/errors";

const GuildSchema = new Schema<IGuild>({
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
});

GuildSchema.plugin(uniqueValidator);

export const GuildModel = model<IGuild>("Guild", GuildSchema);

export const getGuildsWithMember = async (
	memberId: ObjectId
): Promise<IGuild[]> => {
	try {
		const guilds = await GuildModel.find({ members: memberId })
			.populate("members")
			.populate({
				path: "channels",
				populate: [
					{ path: "recipients" },
					{ path: "channels", populate: "recipients" },
				],
			});
		return guilds;
	} catch (error) {
		return [];
	}
};

export const getGuildById = async (id: string | ObjectId) => {
	return await GuildModel.findOne({ _id: id })
		.populate("members")
		.populate({
			path: "channels",
			populate: [
				{ path: "recipients" },
				{ path: "channels", populate: "recipients" },
			],
		});
};

export const addGuild = async (
	name: string,
	creator: IDBUser | IUser
): Promise<IGuild> => {
	const guildWithSameName = await GuildModel.findOne({ name });

	if (guildWithSameName) {
		throw new UserInputError("Already exists a guild with this name");
	}

	try {
		const newGuild = new GuildModel({
			name,
			owner_id: creator._id,
			channels: [],
			members: [creator._id],
		});

		const saveGuild = await newGuild.save();

		const populatedGuild = await saveGuild.populate("members").then((g) =>
			g.populate({
				path: "channels",
				populate: [
					{ path: "recipients" },
					{ path: "channels", populate: "recipients" },
				],
			})
		);

		return populatedGuild;
	} catch (error) {
		throw new InternalServerError("An error has ocurred");
	}
};
