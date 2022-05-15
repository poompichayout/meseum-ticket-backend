import { Response, NextFunction, Request } from "express";
import passport from "passport";
import { AuthFailureError } from "../core/ApiError";
import { ProtectedRequest } from "app-request";
import asyncHandler from "../helpers/asyncHandler";

export const userAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	return passport.authenticate('jwt', { session: false }, (err, user, info) => {
		if (err) { 
			throw new AuthFailureError("Can not authenticate");
		}
		if (!user) { 
			throw new AuthFailureError("No user found, wrong credentials! or expired token");
		}
		req.user = user;
		return next();
	})(req, res, next);
})

export const role = (roles: string[]) => (req: ProtectedRequest, res: Response, next: NextFunction) => {
	if (req.user?.roles.some(r => roles.includes(r.code))) {
		return next();
	}
	
	next(new AuthFailureError("You are not allowed to use this request"));
};