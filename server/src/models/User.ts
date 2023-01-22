import { ObjectId } from "mongoose";

export interface IUser {
	_id: ObjectId;
	username: string;
	discriminator: string;
	avatar?: string;
	email: string;
	verified: boolean;
}

export interface IDBUser extends IUser {
	password: string;
}
