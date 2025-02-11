import mongoose from 'mongoose';
import { thirtyDaysFromNow } from '../utils/date';

export interface SessionDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
}

const SessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true
    },
    userAgent: { type: String },
    createdAt: { type: Date, required: true, default: Date.now },
    expiresAt: {
      type: Date,
      required: true,
      default: thirtyDaysFromNow()
    }
  },
  {
    versionKey: false
  }
);

const SessionModel = mongoose.model<SessionDocument>(
  'Session',
  SessionSchema,
  'user_sessions'
);
export default SessionModel;
