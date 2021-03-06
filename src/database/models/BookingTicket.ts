import { Schema, model, Types } from "mongoose";

export const DOCUMENT_NAME = 'BookingTicket';

export enum TicketPrice {
	P150 = 150,
}

export enum TicketName {
	ENTRY = "Entry Ticket",
}

export interface IBookingTicket {
	_id: Types.ObjectId,
	ticket_id: string;
	ticket_name: string;
	amount: number;
	pricePerTicket: TicketPrice;
	datetime: Date;
	createdAt?: Date;
	updatedAt?: Date;
}

const BookingTicketSchema = new Schema<IBookingTicket>({
	ticket_id: { type: String, required: true },
	ticket_name: { type: String, enum: [TicketName.ENTRY], default: TicketName.ENTRY },
	amount: { type: Number, required: true },
	pricePerTicket: { type: Number, required: true, enum: [TicketPrice.P150] },
	datetime: { type: Date, required: true },
}, { timestamps: true })

const BookingTicket = model<IBookingTicket>(DOCUMENT_NAME, BookingTicketSchema);

export default BookingTicket;