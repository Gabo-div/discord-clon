import { ObjectId } from "mongoose";
import { IUser } from "./User";

export const enum ChannelType {
	DM = "DM",
	GROUP_DM = "GROUP_DM",
	GUILD_TEXT = "GUILD_TEXT",
	GUILD_VOICE = "GUILD_VOICE",
	GUILD_CATEGORY = "GUILD_CATEGORY",
}

export interface IChannel {
	name: string;
	type: ChannelType;
	position: number;
	recipients: IUser[];
	icon?: string;
	owner_id: ObjectId;
	guild_id?: string;
	channels?: IChannel[];
	_id: ObjectId;
	subchannel?: boolean;
}

export interface EditGuildChannelInput {
	name?: string;
	position?: number;
}
