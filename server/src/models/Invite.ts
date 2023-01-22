import { ObjectId } from "mongoose";
import { IChannel } from "./Channel";
import { IGuild } from "./Guild";
import { IDBUser, IUser } from "./User";

export interface IInvite {
	_id: ObjectId;
	guild: IGuild;
	channel: IChannel;
	inviter: IUser | IDBUser;
}
