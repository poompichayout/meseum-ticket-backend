import { Schema, model, Types } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface ICreatePayment {
	ticket_id: Types.ObjectId,
	payment_id: Types.ObjectId;
}

// 2. Create a Schema corresponding to the document interface.
const CreatePaymentSchema = new Schema<ICreatePayment>({
	ticket_id: { type: Schema.Types.ObjectId, ref: 'BookingTicket' },
	payment_id: { type: Schema.Types.ObjectId, ref: 'Payment' }
})

// 3. Create a Model.
const CreatePayment = model<ICreatePayment>('CreatePayment', CreatePaymentSchema);

export default CreatePayment;