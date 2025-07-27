import { Schema, model} from 'mongoose';
import { IUrl } from '../../../domain/entities/Iurl';

const urlSchema = new Schema<IUrl>({
  shortCode: { type: String, required: true, unique: true },
  longUrl: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    index: { expires: 0 },
  },
  clicks: { type: Number, default: 0 },
  lastClickedAt: { type: Date },
  isActive: { type: Boolean, default: true },
});

const Url = model<IUrl>('Url', urlSchema);
export default Url;
