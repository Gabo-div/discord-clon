import { ObjectId } from "mongoose";
import { IChannel } from "./Channel";
import { IUser } from "./User";

export interface IGuild {
	_id: ObjectId;
	owner_id: ObjectId;
	members: IUser[];
	name: string;
	icon?: string;
	channels: IChannel[];
}
