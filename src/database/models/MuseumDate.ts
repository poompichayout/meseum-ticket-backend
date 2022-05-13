import { Schema, model } from "mongoose";

export const DOCUMENT_NAME = 'MuseumDate';

export enum TimeStatus {
	NOT_AVAILABLE = "NOT_AVAILABLE",
	OPEN = "OPEN",
	FULL = "FULL",
	CLOSED = "CLOSED"
}

export interface IMuseumDate {
	close_date: Date;
	status: TimeStatus;
}

const MuseumDateSchema = new Schema<IMuseumDate>({
	close_date: { type: Date, required: true },
	status: { type: String, required: true }
})

const MuseumDate = model<IMuseumDate>(DOCUMENT_NAME, MuseumDateSchema);

export default MuseumDate;