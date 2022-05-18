import { Router, Request, Response } from 'express';
import _ from 'lodash';

import { SuccessResponse } from '../../../core/ApiResponse';
import { role, userAuth } from '../../../auth/authenticate';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import BookingTicket, { IBookingTicket } from '../../../database/models/BookingTicket';
import { RoleCode } from '../../../database/models/Role';

const router = Router();

router.use('/', userAuth, role([ RoleCode.ADMIN ]));

export default router.get(
  '/purchase-history',
  validator(schema.purchase_history, ValidationSource.QUERY),
  asyncHandler(async (req: Request, res: Response) => {
	const { range, limit } = req.query;
	const thisday = new Date();
	const queryUptoDay = new Date(new Date().setDate(new Date().getDate() - Number(range)))
	let tickets: IBookingTicket[];

	if (limit) {
		tickets = await BookingTicket.find({
			createdAt: {
				$gte: queryUptoDay, 
				$lte: thisday,
			}
		}).select("-_id ticket_id datetime createdAt").limit(Number(limit)).lean<IBookingTicket[]>();
	} else {
		tickets = await BookingTicket.find({
			createdAt: {
				$gte: queryUptoDay, 
				$lte: thisday,
			}
		}).select("-_id ticket_id datetime createdAt").lean<IBookingTicket[]>();
	}
	
    new SuccessResponse('Success', {
      tickets
      }).send(res);
    }),
);
