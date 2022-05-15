import { Request } from 'express';
import { IUser } from '../database/models/User';

declare global {
  namespace Express {
    // export interface Request {
    //   userCode: IUser
    // }
    export interface User extends IUser {
      
    }
  }
}

declare interface ProtectedRequest extends Request {
  //userCode: import('../database/models/User').IUser;
}
