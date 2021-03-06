import express from 'express';
import _ from 'lodash';

import MuseumDate, { IMuseumDate, TimeStatus } from '../../../database/models/MuseumDate';
import { SuccessResponse } from '../../../core/ApiResponse';
import asyncHandler from '../../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
// import { role, userAuth } from '../../../auth/authenticate';
// import { RoleCode } from '../../../database/models/Role';

const router = express.Router();

// router.use('/', userAuth, role([ RoleCode.ADMIN ]));

router.get(
	'/date-status',
	validator(schema.range, ValidationSource.QUERY),
	asyncHandler(async (req, res) => {
		const dayRange = req.query.range;
		const thisday = new Date();
		const queryUptoDay = new Date(new Date().setDate(new Date().getDate() + Number(dayRange)))
		const closeDateRange = await MuseumDate.find({
			close_date: {
				$gte: thisday, 
				$lte: queryUptoDay,
			}
		}).lean<IMuseumDate[]>();

		const allDayStatus = _.times(
			Number(dayRange), 
			(index) => {
				const thisday = new Date();
				const queryUptoDay = new Date(thisday.setDate(thisday.getDate() + Number(index)))
				return queryUptoDay;
			}
		)
				
		const formatAvailableDate = allDayStatus.map((date) => {
			return {
				date: date,
				time: [...Array(11).keys()].map((hour) => {
					const validHour = hour + 10;
					let isCloseHour: boolean = false, status: string = TimeStatus.CLOSED;
					closeDateRange.forEach((x) => {
						if (x.close_date.getUTCHours() === validHour && x.close_date.getUTCDate() === date.getUTCDate()) {
							isCloseHour = true;
							status = x.status;
						}
					});
					if (isCloseHour)
						return {
							hour: validHour + ":00",
							status,
						}
					else 
						return {
							hour: validHour + ":00",
							status: TimeStatus.OPEN,
						}
				})
			}
		})
	
		return new SuccessResponse('success', {
			available_date: formatAvailableDate,
		}).send(res);
	}),
);

export default router;