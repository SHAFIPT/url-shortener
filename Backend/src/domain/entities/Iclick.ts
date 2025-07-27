import { Types } from 'mongoose';

export interface IClick {
  _id?: Types.ObjectId;
  urlId: Types.ObjectId;
  ts?: Date;
  ipHash?: string;
  country?: string;
  ua?: string;
  referer?: string;
}
