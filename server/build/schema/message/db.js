"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getChannelMessages = exports.getNextChannelMessage = exports.getMessageById = exports.MessageModel = void 0;
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: false,
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    channel_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
}, {
    timestamps: {
        createdAt: "created_at",
    },
});
exports.MessageModel = (0, mongoose_1.model)("Message", MessageSchema);
const getMessageById = async (id) => {
    return await exports.MessageModel.findOne({ _id: id }).populate("author");
};
exports.getMessageById = getMessageById;
const getNextChannelMessage = async (channel_id, id, date) => {
    return await exports.MessageModel.findOne({
        channel_id,
        _id: { $lt: id },
    })
        .sort({ created_at: -1 })
        .populate("author");
};
exports.getNextChannelMessage = getNextChannelMessage;
const getChannelMessages = async (channel_id, limit, cursor) => {
    if (!cursor) {
        return await exports.MessageModel.find({ channel_id })
            .sort({ created_at: -1 })
            .limit(limit)
            .populate("author");
    }
    return await exports.MessageModel.find({ channel_id, _id: { $lt: cursor } })
        .sort({ created_at: -1 })
        .limit(limit)
        .populate("author");
};
exports.getChannelMessages = getChannelMessages;
const sendMessage = async (authorId, content, channel_id) => {
    const message = new exports.MessageModel({
        author: authorId,
        content,
        channel_id,
    });
    return await message.save();
};
exports.sendMessage = sendMessage;
