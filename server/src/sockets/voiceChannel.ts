import {
	IChannelJoin,
	IChannelLeave,
	IVoiceChannel,
	IVoiceChannelParticipant,
	StatusType,
} from "@models/VoiceChannel";
import { getChannelById } from "schema/channel/db";
import { getUserByToken } from "schema/user/db";
import { Socket } from "socket.io";

const channels: Map<string, IVoiceChannel> = new Map();

const createChannel = (
	channelId: string,
	participant: IVoiceChannelParticipant
) => {
	channels.set(channelId, {
		participants: [{ ...participant }],
	});
	return channels.get(channelId) as IVoiceChannel;
};

const addChannelParticipant = (
	channelId: string,

	participant: IVoiceChannelParticipant
) => {
	const currentChannel = channels.get(channelId) as IVoiceChannel;

	channels.set(channelId, {
		...currentChannel,
		participants: [
			...currentChannel.participants,
			{
				...participant,
			},
		],
	});

	return channels.get(channelId) as IVoiceChannel;
};

const removeChannelParticipant = (channelId: string, participantId: string) => {
	const currentChannel = channels.get(channelId) as IVoiceChannel;

	channels.set(channelId, {
		...currentChannel,
		participants: currentChannel.participants.filter(
			(p) => p._id.toString() !== participantId
		),
	});

	return channels.get(channelId) as IVoiceChannel;
};

export const voiceChannelController = (socket: Socket) => {
	const leaveChannel = async ({
		participantId,
		channelId,
	}: IChannelLeave) => {
		removeChannelParticipant(channelId, participantId);
		socket.to(channelId).emit("user-leaved", { participantId });
		socket.leave(channelId);
	};

	const joinChannel = async ({ channelId, preferences }: IChannelJoin) => {
		socket.emit("status", { status: StatusType.CONNECTING });

		const user = await getUserByToken(socket.handshake.auth.token);
		const channel = await getChannelById(channelId);

		socket.emit("status", { status: StatusType.AUTHENTICATING });
		if (!user || !channel) return;

		const currentChannel = channels.get(channel._id.toString());

		const participant: IVoiceChannelParticipant = {
			_id: user._id,
			username: user.username,
			discriminator: user.discriminator,
			avatar: user.avatar,
			email: user.email,
			verified: user.verified,
			preferences,
		};

		if (
			currentChannel &&
			currentChannel.participants.some(
				(p) => p._id.toString() === participant._id.toString()
			)
		) {
			socket.emit("status", { status: StatusType.CONNECTED });
			return;
		}

		if (currentChannel) {
			const ch = addChannelParticipant(
				channel._id.toString(),
				participant
			);

			socket.join(channel._id.toString());

			socket.emit("users", { participants: ch.participants });

			socket
				.to(channel._id.toString())
				.emit("user-joined", { participant });
		} else {
			const ch = createChannel(channel._id.toString(), participant);
			socket.join(channel._id.toString());
			socket.emit("users", { participants: ch.participants });
		}

		socket.emit("status", { status: StatusType.CONNECTED });

		socket.on("disconnect", () =>
			leaveChannel({
				participantId: participant._id.toString(),
				channelId: channel._id.toString(),
			})
		);

		socket.on("leave-channel", () =>
			leaveChannel({
				participantId: participant._id.toString(),
				channelId: channel._id.toString(),
			})
		);
	};

	socket.on("join-channel", joinChannel);
};
