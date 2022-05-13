import { Schema, model } from "mongoose";

export const DOCUMENT_NAME = 'MuseumDate';

export enum TimeStatus {
	NOT_AVAILABLE = "NOT_AVAILABLE",
	OPEN = "OPEN",
	FULL = "FULL",
	CLOSED = "CLOSED"
}

export enum MuseumOpenTime {
	T10 = 10,
	T11 = 11,
	T12 = 12,
	T13 = 13,
	T14 = 14,
	T15 = 15,
	T16 = 16,
	T17 = 17,
	T18 = 18,
	T19 = 19,
	T20 = 20,
}

export interface ITime {
	hour: MuseumOpenTime;
	status: TimeStatus;
}

export interface IMuseumDate {
	close_date: string;
	close_time: [ITime];
}

const CloseTimeSchema = new Schema<ITime>({
	hour: {
		type: Number,
		require: true,
		enum: [
			MuseumOpenTime.T10, MuseumOpenTime.T11, MuseumOpenTime.T12, MuseumOpenTime.T13, MuseumOpenTime.T14, MuseumOpenTime.T15,
			MuseumOpenTime.T16, MuseumOpenTime.T17, MuseumOpenTime.T18, MuseumOpenTime.T19, MuseumOpenTime.T20,
		]
	},
	status: {
		type: String,
		required: true,
		enum: [TimeStatus.CLOSED, TimeStatus.FULL, TimeStatus.NOT_AVAILABLE, TimeStatus.OPEN]
	}
})

const MuseumDateSchema = new Schema<IMuseumDate>({
	close_date: {type: String, required: true},
	close_time: CloseTimeSchema
})

const MuseumDate = model<IMuseumDate>(DOCUMENT_NAME, MuseumDateSchema);

export default MuseumDate;