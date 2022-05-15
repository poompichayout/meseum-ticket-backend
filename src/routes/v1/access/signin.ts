import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import _ from 'lodash';

import { SECRET } from '../../../config';
import User, { IUser } from '../../../database/models/User';
import { SuccessResponse } from '../../../core/ApiResponse';
import { BadRequestError, AuthFailureError } from '../../../core/ApiError';
import validator from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';

const router = Router();

export default router.post(
  '/basic',
  validator(schema.userCredential),
  asyncHandler(async (req: Request, res: Response) => {
	const { email, password } = req.body;

    const user = await User.findOne({ email: email, status: true })
    .select('+email +password +roles')
    .populate({
      path: 'roles',
      match: { status: true },
      select: { code: 1 },
    })
    .lean<IUser>()
    .exec();

    if(!user) throw new BadRequestError('User not registered');
	  if (!user.password) throw new BadRequestError('Credential not set');

    const match  = await bcrypt.compare(password, user.password)

    if(!match) throw new AuthFailureError('Authentication failure');

    //If crednetials are valid, create a token for the user
    const token = jwt.sign({ email: user.email, id: user._id, roles: user.roles }, SECRET, { expiresIn: "1h" })
    //Then send the token to the client/frontend
    new SuccessResponse('Login Success', {
      user: _.pick(user, ['_id', 'firstname', 'lastname', 'roles']),
      tokens: token,
      }).send(res);
    }),
);
