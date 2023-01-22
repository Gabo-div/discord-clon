import { Schema, model, ObjectId } from "mongoose";
import { IMessage } from "@models/Message";

const MessageSchema = new Schema<IMessage>(
	{
		content: {
			type: String,
			required: false,
		},
		author: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		channel_id: {
			type: Schema.Types.ObjectId,
			required: true,
		},
	},
	{
		timestamps: {
			createdAt: "created_at",
		},
	}
);

export const MessageModel = model<IMessage>("Message", MessageSchema);

export const getMessageById = async (id: string) => {
	return await MessageModel.findOne({ _id: id }).populate("author");
};

export const getNextChannelMessage = async (
	channel_id: ObjectId | string,
	id: ObjectId | string,
	date: number
) => {
	return await MessageModel.findOne({
		channel_id,
		_id: { $lt: id },
	})
		.sort({ created_at: -1 })
		.populate("author");
};

export const getChannelMessages = async (
	channel_id: ObjectId | string,
	limit: number,
	cursor: ObjectId | string | null
) => {
	if (!cursor) {
		return await MessageModel.find({ channel_id })
			.sort({ created_at: -1 })
			.limit(limit)
			.populate("author");
	}

	return await MessageModel.find({ channel_id, _id: { $lt: cursor } })
		.sort({ created_at: -1 })
		.limit(limit)
		.populate("author");
};

export const sendMessage = async (
	authorId: ObjectId | string,
	content: string,
	channel_id: ObjectId | string
) => {
	const message = new MessageModel({
		author: authorId,
		content,
		channel_id,
	});
	return await message.save();
};
