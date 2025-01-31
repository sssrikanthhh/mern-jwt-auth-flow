import mongoose from 'mongoose';
import { VerificationCodeType } from '../utils/verificationCodeType';

export interface VerificationCodeDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  type: VerificationCodeType;
  expiresAt: Date;
  createdAt: Date;
}

export const VerificationCodeSchema =
  new mongoose.Schema<VerificationCodeDocument>(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true
      },
      type: { type: String, required: true },
      createdAt: { type: Date, required: true, default: Date.now },
      expiresAt: { type: Date, required: true }
    },
    {
      versionKey: false
    }
  );

export default mongoose.model<VerificationCodeDocument>(
  'VerificationCode',
  VerificationCodeSchema,
  'verification_codes'
);
