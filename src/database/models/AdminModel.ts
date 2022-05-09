import { Schema, model, Types } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface IAdmin {
	staff_id: string,
	user_id: Types.ObjectId;
}

// 2. Create a Schema corresponding to the document interface.
const AdminSchema = new Schema<IAdmin>({
	staff_id: { type: String, required: true },
	user_id: { type: Schema.Types.ObjectId, ref: 'User' }
})

// 3. Create a Model.
const Admin = model<IAdmin>('Admin', AdminSchema);

export default Admin;