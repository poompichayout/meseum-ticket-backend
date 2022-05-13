import { Schema, model, Types } from "mongoose";

export const DOCUMENT_NAME = 'CreatePayment';

export interface ICreatePayment {
	ticket_id: Types.ObjectId,
	payment_id: Types.ObjectId;
	user_id: Types.ObjectId;
}

const CreatePaymentSchema = new Schema<ICreatePayment>({
	ticket_id: { type: Schema.Types.ObjectId, ref: 'BookingTicket' },
	payment_id: { type: Schema.Types.ObjectId, ref: 'Payment' },
	user_id: { type: Schema.Types.ObjectId, ref: 'User' }
})

const CreatePayment = model<ICreatePayment>(DOCUMENT_NAME, CreatePaymentSchema);

export default CreatePayment;