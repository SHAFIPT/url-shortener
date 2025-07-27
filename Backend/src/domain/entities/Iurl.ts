import { Types } from "mongoose";

export interface IUrl {
  _id?: Types.ObjectId;
  shortCode: string;
  longUrl: string;
  userId: Types.ObjectId;
  createdAt?: Date;
  expiresAt?: Date;
  clicks?: number;
  lastClickedAt?: Date;
  isActive?: boolean;
}
