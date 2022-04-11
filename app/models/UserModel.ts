import { Schema, model } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
interface IUser {
	email: string;
	firstname: string;
	lastname: string;
	password: string;
	phone?: string;
}

// 2. Create a Schema corresponding to the document interface.
const UserSchema = new Schema<IUser>({
	email: { type: String, required: true, unique: true },
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	password: { type: String, required: true },
	phone: { type: String },
})

// 3. Create a Model.
const User = model<IUser>('User', UserSchema);

export default User;