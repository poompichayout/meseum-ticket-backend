import { Schema, model, Types } from 'mongoose';

export const DOCUMENT_NAME = 'Role';

export const enum RoleCode {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface IRole {
  _id: Types.ObjectId,
  code: string;
  status?: boolean;
}

const schema = new Schema(
  {
    code: {
      type: Schema.Types.String,
      required: true,
      enum: [RoleCode.USER, RoleCode.ADMIN],
    },
    status: {
      type: Schema.Types.Boolean,
      default: true,
    }
  }
);

const Role = model<IRole>(DOCUMENT_NAME, schema);

export default Role;