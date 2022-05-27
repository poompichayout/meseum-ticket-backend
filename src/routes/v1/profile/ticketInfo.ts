import express from 'express';
import _ from 'lodash';

import { SuccessResponse } from '../../../core/ApiResponse';
import asyncHandler from '../../../helpers/asyncHandler';
import { role, userAuth } from '../../../auth/authenticate';
import { RoleCode } from '../../../database/models/Role';
import { IUser } from '../../../database/models/User';
import CreatePayment, { ICreatePayment } from '../../../database/models/CreatePayment';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import { NoDataError } from '../../../core/ApiError';

const router = express.Router();

router.use('/', userAuth, role([ RoleCode.USER, RoleCode.ADMIN ]));

router.get(
	'/tickets',
	asyncHandler(async (req, res) => {
		const { _id } = req.user as IUser;

		const ticketData = await CreatePayment
			.find({ user_id: _id })
			.populate('ticket_id');

		const serializeTicket = ticketData.map((data) => {
			const newData =  _.pick(data, [
				'ticket_id.ticket_id', 
				'ticket_id.ticket_name', 
				'ticket_id.amount', 
				'ticket_id.pricePerTicket', 
				'ticket_id.datetime']
				);
			return {
				...newData.ticket_id
			}
		})
		
		return new SuccessResponse('success', {
			tickets: serializeTicket
		}).send(res);
	}),
);

router.get(
	'/ticketByID/:ticket_id',
	validator(schema.ticket_params, ValidationSource.PARAM),
	asyncHandler(async (req, res) => {
		const { _id } = req.user as IUser;
		const { ticket_id } = req.params;

		const ticketData = await CreatePayment
			.find({ user_id: _id })
			.populate({ path: 'ticket_id', match: { ticket_id }})
			.lean<ICreatePayment[]>();
		
		if (!ticketData.some(e => typeof e.ticket_id === 'object')) throw new NoDataError("Can not find any data for this ticket_id on your list");

		const firstFoundTicket = _.find(ticketData, (e) => e.ticket_id !== null);
		const serializeTicket = _.pick(firstFoundTicket, [
				'ticket_id.ticket_id', 
				'ticket_id.ticket_name', 
				'ticket_id.amount', 
				'ticket_id.pricePerTicket', 
				'ticket_id.datetime']
			).ticket_id;
		return new SuccessResponse('success', {
			ticket: serializeTicket
		}).send(res);
	}),
);

export default router;