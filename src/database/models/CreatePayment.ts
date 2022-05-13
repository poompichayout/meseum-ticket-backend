import { Schema, model, Types } from "mongoose";

export const DOCUMENT_NAME = 'CreatePayment';

export interface ICreatePayment {
	ticket_id: Types.ObjectId,
	payment_id: Types.ObjectId;
	user_id: Types.ObjectId;
	phone?: string;
}

const CreatePaymentSchema = new Schema<ICreatePayment>({
	ticket_id: { type: Schema.Types.ObjectId, ref: 'BookingTicket', required: true },
	payment_id: { type: Schema.Types.ObjectId, ref: 'Payment', required: true },
	user_id: { type: Schema.Types.ObjectId, ref: 'User' },
	phone: { type: String }
})

const CreatePayment = model<ICreatePayment>(DOCUMENT_NAME, CreatePaymentSchema);

export default CreatePayment;