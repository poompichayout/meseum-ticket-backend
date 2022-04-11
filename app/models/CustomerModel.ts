import { Schema, model, Types } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
interface ICustomer {
	customer_id: string,
	user_id: Types.ObjectId;
}

// 2. Create a Schema corresponding to the document interface.
const CustomerSchema = new Schema<ICustomer>({
	customer_id: { type: String, required: true },
	user_id: { type: Schema.Types.ObjectId, ref: 'User' }
})

// 3. Create a Model.
const Customer = model<ICustomer>('Customer', CustomerSchema);

export default Customer;