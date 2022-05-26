import express, { Request } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

import { SuccessResponse } from '../../../core/ApiResponse';
import { BadRequestError, InternalError } from '../../../core/ApiError';
import User from '../../../database/models/User';
import Role, { IRole } from '../../../database/models/Role';
import validator from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';

import { SECRET } from '../../../config';
import { RoleCode } from '../../../database/models/Role';

const router = express.Router();

router.post(
  '/basic',
  validator(schema.signup),
  asyncHandler(async (req: Request, res) => {
    const { email, password, firstName, lastName, phone, roles } = req.body

	const existingUser = await User.findOne({ email })

	if(existingUser) throw new BadRequestError('User already registered');
	
	const hashedPassword = await bcrypt.hash(password, 12)

	const role = await Role.findOne({ code: roles })
      .select('+email +password')
      .lean<IRole>()
      .exec();
    if (!role) throw new InternalError('Role must be defined');

	const result = await User.create({ email, password: hashedPassword, firstname: firstName, lastname: lastName, phone, roles: [role._id] })
	const token = jwt.sign({ email: result.email, _id: result._id, roles: [{ code: roles }] }, SECRET, { expiresIn: "1h" })
	
	new SuccessResponse('Signup Successful', {
		user: _.pick(result, ['_id', 'firstname', 'lastname', 'email', 'roles']),
		tokens: token,
		}).send(res);
	}),
);

export default router;
