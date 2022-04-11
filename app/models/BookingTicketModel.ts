import { Schema, model } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
interface IBookingTicket {
	ticket_id: string;
	amount: number;
	price: number;
	datetime: Date;
}

// 2. Create a Schema corresponding to the document interface.
const BookingTicketSchema = new Schema<IBookingTicket>({
	ticket_id: { type: String, required: true },
	amount: { type: Number, required: true },
	price: { type: Number, required: true },
	datetime: { type: Date, required: true },
})

// 3. Create a Model.
const BookingTicket = model<IBookingTicket>('BookingTicket', BookingTicketSchema);

export default BookingTicket;