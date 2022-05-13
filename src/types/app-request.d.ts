import { Request } from 'express';
import { IUser } from '../database/models/User';

declare interface RoleRequest extends Request {
  currentRoleCode: string;
}

declare interface ProtectedRequest extends RoleRequest {
  user: IUser;
  accessToken: string;
}

declare interface Tokens {
  accessToken: string;
  refreshToken: string;
}
