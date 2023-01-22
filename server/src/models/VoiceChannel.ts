import { IUser } from "./User";

export interface IVoiceChannelParticipantPreferences {
	muted: boolean;
	deaf: boolean;
}

export const enum StatusType {
	CONNECTING = "CONNECTING",
	AUTHENTICATING = "AUTHENTICATING",
	CONNECTED = "CONNECTED",
	FAILED = "FAILED",
}

export interface IVoiceChannelParticipant extends IUser {
	preferences: IVoiceChannelParticipantPreferences;
}

export interface IVoiceChannel {
	participants: IVoiceChannelParticipant[];
}

export interface IChannelJoin {
	channelId: string;
	preferences: IVoiceChannelParticipantPreferences;
}

export interface IChannelLeave {
	participantId: string;
	channelId: string;
}
