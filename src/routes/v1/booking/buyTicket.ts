import { Router, Request, Response } from 'express';
import _ from 'lodash';
import nodemailer from 'nodemailer';

import BookingTicket, { IBookingTicket } from '../../../database/models/BookingTicket';
import CreatePayment from '../../../database/models/CreatePayment';
import Payment from '../../../database/models/Payment';
import { SuccessResponse } from '../../../core/ApiResponse';
import { InternalError } from '../../../core/ApiError';
import validator from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import { getNextNum } from '../../../helpers/utils';
import User, { IUser } from '../../../database/models/User';
import { smtp_email, smtp_pass } from '../../../config';
import moment from 'moment';

const router = Router();

export default router.post(
  '/buy',
  validator(schema.ticket),
  asyncHandler(async (req: Request, res: Response) => {
	const { date, amount, pricePerTicket, payment_method, phone, email } = req.body;
	const formatDate = new Date(date);

	// ต้องเช็คว่าวันที่ที่จองเข้ามา ไม่ซ้ำกับวันที่ปิด

	const ticketCount = await BookingTicket.findOne({ datetime: formatDate }).lean<IBookingTicket>().count();
	if (ticketCount >= 50) {
		throw new InternalError("No more space for this time: " + formatDate);
	}

	// find the last ticket_id from BookingTicket database
	let latestTicketID = await BookingTicket.findOne({}, 'ticket_id', {
		sort: { 'createdAt': -1 },
	}).then((value) => {
		return value ? value.ticket_id : null;
	});

	let latestPaymentID = await Payment.findOne({}, 'payment_id', {
		sort: { 'createdAt': -1 },
	}).then((value) => {
		return value ? value.payment_id : null;
	});

	// get year value
	let thisYear = new Date().getFullYear().toString().substring(2, 4);
	// increment id value
	latestTicketID = `T${thisYear}-${latestTicketID ? getNextNum(latestTicketID, 5) : '00001'}`;
	latestPaymentID = `P${thisYear}-${latestPaymentID ? getNextNum(latestPaymentID, 5) : '00001'}`;
	
	const ticket = await BookingTicket.create({
		ticket_id: latestTicketID,
		amount,
		datetime: formatDate,
		pricePerTicket
	});

	const payment = await Payment.create({
		payment_id: latestPaymentID,
		cost: Number(pricePerTicket) * Number(amount),
		payment_method
	});

	const user = await User.findOne({ email }).lean<IUser>();

	await CreatePayment.create({
		payment_id: payment._id,
		ticket_id: ticket._id,
		user_id: user?._id,
		phone,
	})

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: smtp_email, // your email
			pass: smtp_pass // your email password
		}
	});

	let mailOptions = {
		from: smtp_email,                // sender
		to: email,                // list of receivers
		subject: 'Museum - Thank you for booking with us ' + latestTicketID,              // Mail subject
		html: `
			<div>Thank you for booking with us</div>
			<div><b>Ticket ID:</b> ${latestTicketID}</div>
			<div><b>Ticket Type:</b> ${ticket.ticket_name}</div>
			<div><b>Date:</b> ${moment(ticket.datetime).format('DD-MMM-YYYY')}</div>
			<div><b>Time:</b> ${moment(ticket.datetime).format('HH:mm')}</div>
			<div><b>Total Price:</b> ${ticket.pricePerTicket * ticket.amount}</div>
			<div><b>Amount:</b> ${ticket.amount}</div>
		`
	};

	transporter.sendMail(mailOptions, function (err, info) {
		if(err)
		  console.log(err)
	 });
	
    new SuccessResponse('Booking Success', {
      ticket: _.pick(ticket, ['ticket_id', 'amount', 'pricePerTicket', 'datetime']),
	  payment: _.pick(payment, ['payment_id', 'cost', 'payment_method', 'datetime']),
	  user
      }).send(res);
	}),
);
