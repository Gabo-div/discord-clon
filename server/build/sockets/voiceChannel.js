"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voiceChannelController = void 0;
const db_1 = require("../schema/channel/db");
const db_2 = require("../schema/user/db");
const channels = new Map();
const createChannel = (channelId, participant) => {
    return channels.set(channelId, {
        participants: [Object.assign({}, participant)],
    });
};
const addChannelParticipant = (channelId, participant) => {
    const currentChannel = channels.get(channelId);
    channels.set(channelId, Object.assign(Object.assign({}, currentChannel), { participants: [
            ...currentChannel.participants,
            Object.assign({}, participant),
        ] }));
    return channels.get(channelId);
};
const removeChannelParticipant = (channelId, participantId) => {
    const currentChannel = channels.get(channelId);
    channels.set(channelId, Object.assign(Object.assign({}, currentChannel), { participants: currentChannel.participants.filter((p) => p._id.toString() !== participantId) }));
    return channels.get(channelId);
};
const voiceChannelController = (socket) => {
    const leaveChannel = async ({ participantId, channelId, }) => {
        removeChannelParticipant(channelId, participantId);
        socket.to(channelId).emit("user-leaved", { participantId });
        socket.leave(channelId);
    };
    const joinChannel = async ({ channelId, preferences }) => {
        socket.emit("status", { status: "CONNECTING" /* StatusType.CONNECTING */ });
        const user = await (0, db_2.getUserByToken)(socket.handshake.auth.token);
        const channel = await (0, db_1.getChannelById)(channelId);
        socket.emit("status", { status: "AUTHENTICATING" /* StatusType.AUTHENTICATING */ });
        if (!user || !channel)
            return;
        const currentChannel = channels.get(channel._id.toString());
        const participant = {
            _id: user._id,
            username: user.username,
            discriminator: user.discriminator,
            avatar: user.avatar,
            email: user.email,
            verified: user.verified,
            preferences,
        };
        if (currentChannel &&
            currentChannel.participants.some((p) => p._id.toString() === participant._id.toString())) {
            socket.emit("status", { status: "CONNECTED" /* StatusType.CONNECTED */ });
            return;
        }
        if (currentChannel) {
            const ch = addChannelParticipant(channel._id.toString(), participant);
            socket.join(channel._id.toString());
            socket.emit("users", { participants: ch.participants });
            socket
                .to(channel._id.toString())
                .emit("user-joined", { participant });
        }
        else {
            createChannel(channel._id.toString(), participant);
            socket.join(channel._id.toString());
        }
        socket.emit("status", { status: "CONNECTED" /* StatusType.CONNECTED */ });
        socket.on("disconnect", () => leaveChannel({
            participantId: participant._id.toString(),
            channelId: channel._id.toString(),
        }));
        socket.on("leave-channel", () => leaveChannel({
            participantId: participant._id.toString(),
            channelId: channel._id.toString(),
        }));
    };
    socket.on("join-channel", joinChannel);
};
exports.voiceChannelController = voiceChannelController;
