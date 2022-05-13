import { Schema, model } from "mongoose";

export const DOCUMENT_NAME = 'BookingTicket';

export enum TicketPrice {
	P150 = 150,
}

export interface IBookingTicket {
	ticket_id: string;
	amount: number;
	price: TicketPrice;
	datetime: Date;
}

const BookingTicketSchema = new Schema<IBookingTicket>({
	ticket_id: { type: String, required: true },
	amount: { type: Number, required: true },
	price: { type: Number, required: true, enum: [TicketPrice.P150] },
	datetime: { type: Date, required: true },
})

const BookingTicket = model<IBookingTicket>(DOCUMENT_NAME, BookingTicketSchema);

export default BookingTicket;