import { Router, Request, Response } from 'express';
import _ from 'lodash';

import { SuccessResponse } from '../../../core/ApiResponse';
import { role, userAuth } from '../../../auth/authenticate';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import BookingTicket, { IBookingTicket } from '../../../database/models/BookingTicket';
import { RoleCode } from '../../../database/models/Role';
import Payment, { IPayment } from '../../../database/models/Payment';

const router = Router();

router.use('/', userAuth, role([ RoleCode.ADMIN ]));

export default router.get(
  '/statistics',
  validator(schema.range, ValidationSource.QUERY),
  asyncHandler(async (req: Request, res: Response) => {
	const { range } = req.query;
	const thisday = new Date();
	const queryUptoDay = new Date(new Date().setDate(new Date().getDate() - Number(range)))
	
	const tickets = await BookingTicket.find({
		createdAt: {
			$gte: queryUptoDay, 
			$lte: thisday,
		}
	}).lean<IBookingTicket[]>();

	const countTicket = tickets.reduce((count, ticket) => {
		return count + (ticket.amount);
	}, 0);

	const payments = await Payment.find({
		createdAt: {
			$gte: queryUptoDay, 
			$lte: thisday,
		}
	}).lean<IPayment[]>();

	const totalIncome = payments.reduce((count, payment) => {
		return count + (payment.cost);
	}, 0);

    new SuccessResponse('Success', {
      ticketSold: countTicket,
	  totalIncome
      }).send(res);
    }),
);
