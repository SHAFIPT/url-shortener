import { Schema, model } from 'mongoose';
import { IClick } from '../../../domain/entities/Iclick';

const clickSchema = new Schema<IClick>({
  urlId: { type: Schema.Types.ObjectId, ref: 'Url', required: true },
  ts: { type: Date, default: Date.now },
  ipHash: { type: String },
  country: { type: String },
  ua: { type: String },
  referer: { type: String },
});

const Click = model<IClick>('Click', clickSchema);
export default Click;
