import { Router, Request, Response } from 'express';
import _ from 'lodash';

import { SuccessMsgResponse } from '../../../core/ApiResponse';
import { RoleCode } from '../../../database/models/Role';
import { role, userAuth } from '../../../auth/authenticate';
import validate from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import MuseumDate, { TimeStatus } from '../../../database/models/MuseumDate';
import { BadRequestError } from '../../../core/ApiError';

interface BodyArray {
	datetime: Date;
	status: TimeStatus;
}

const router = Router();

router.use('/', userAuth, role([ RoleCode.ADMIN ]));

export default router.post(
  '/schedule',
  validate(schema.museum_date),
  asyncHandler(async (req: Request, res: Response) => {
    const datetimeArray: BodyArray[] = req.body;
	let errorCount = 0;
	datetimeArray.forEach(async (date) => {
		const requestDate = new Date(date.datetime);
		const checkDate = new Date(requestDate.getFullYear(), requestDate.getMonth(), requestDate.getDate(), requestDate.getHours(), 0, 0, 0);
		if (checkDate.getUTCHours() < 10 || checkDate.getUTCHours() > 20) {
			console.log(checkDate.getUTCHours())
			errorCount++;
			return;
		}
	})

	if (errorCount > 0) throw new BadRequestError("Wrong time set. only 10:00 - 20:00 only!");
	
	datetimeArray.forEach(async (date) => {
		const requestDate = new Date(date.datetime);
		const checkDate = new Date(requestDate.getFullYear(), requestDate.getMonth(), requestDate.getDate(), requestDate.getHours(), 0, 0, 0);
		await MuseumDate.findOneAndDelete({
			close_date: checkDate
		});
		if (date.status !== TimeStatus.OPEN) {
			await MuseumDate.create({
				close_date: checkDate,
				status: date.status
			});
		}
	});

    new SuccessMsgResponse('Success').send(res);
    }),
);
