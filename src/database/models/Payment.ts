import { Schema, model, Types } from "mongoose";

export const DOCUMENT_NAME = 'Payment';

export enum PaymentMethod {
	VISA = 'Visa',
	PROMPTPAY = 'Promptpay'
}

export interface IPayment {
	_id: Types.ObjectId,
	payment_id: string;
	cost: number;
	payment_method: PaymentMethod;
}

const PaymentSchema = new Schema<IPayment>({
	payment_id: { type: String, required: true },
	cost: { type: Number, required: true },
	payment_method: { type: String, required: true },
}, { timestamps: true })

const Payment = model<IPayment>(DOCUMENT_NAME, PaymentSchema);

export default Payment;