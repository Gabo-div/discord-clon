import { ObjectId } from "mongoose";
import { IDBUser, IUser } from "./User";

export interface IMessage {
	_id: ObjectId;
	channel_id: ObjectId;
	author: IUser | IDBUser;
	created_at: number;
	content: string;
}
