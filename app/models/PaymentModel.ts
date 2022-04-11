import { Schema, model, Types } from "mongoose";

enum PaymentMethod {
	Visa = 'Visa',
	PromptPay = 'Promptpay'
}

// 1. Create an interface representing a document in MongoDB.
interface IPayment {
	payment_id: string;
	cost: number;
	payment_method: PaymentMethod;
}

// 2. Create a Schema corresponding to the document interface.
const PaymentSchema = new Schema<IPayment>({
	payment_id: { type: String, required: true },
	cost: { type: Number, required: true },
	payment_method: { type: String, required: true },
}, { timestamps: true })

// 3. Create a Model.
const Payment = model<IPayment>('Payment', PaymentSchema);

export default Payment;