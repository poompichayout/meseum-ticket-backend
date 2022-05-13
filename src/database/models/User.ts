import { Schema, model, Types } from "mongoose";
import { IRole } from './Role';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export interface IUser {
	_id: Types.ObjectId,
	email: string;
	firstname: string;
	lastname: string;
	password: string;
	phone?: string;
	roles: IRole[];
}

const UserSchema = new Schema<IUser>({
	email: { type: String, required: true, unique: true },
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	password: { type: String, required: true },
	phone: { type: String },
	roles: {
	type: [
		{
		type: Schema.Types.ObjectId,
		ref: 'Role',
		},
	],
	required: true,
	select: false,
	},
})

const User = model<IUser>(DOCUMENT_NAME, UserSchema, COLLECTION_NAME);

export default User;