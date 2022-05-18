import { Router, Request, Response } from 'express';
import _ from 'lodash';

import { SuccessResponse } from '../../../core/ApiResponse';
import { RoleCode } from '../../../database/models/Role';
import { role, userAuth } from '../../../auth/authenticate';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import MuseumDate, { IMuseumDate } from '../../../database/models/MuseumDate';

const router = Router();

router.use('/', userAuth, role([ RoleCode.ADMIN ]));

export default router.get(
  '/schedule/:year/:month',
  validator(schema.get_date, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response) => {
    const { year, month } = req.params;
    const startDay = new Date(Number(year), Number(month)-1, 1);
	  const uptoDay = new Date(Number(year), Number(month), 0);

    const closedDates = await MuseumDate.find({
      close_date: {
        $gte: startDay,
        $lte: uptoDay
      }
    }).lean<IMuseumDate[]>();

    new SuccessResponse('Success', {
        date: closedDates,
      }).send(res);
    }),
);
