import { IDBUser, IUser } from "./User";

export interface IContext {
	user: IUser | IDBUser | null;
}
