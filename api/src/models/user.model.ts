import mongoose from 'mongoose';
import { hashValue } from '../utils/bcrypt-utils';

export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (val: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false, required: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await hashValue(this.password);
});

userSchema.methods.comparePassword = async function (val: string) {
  return val === this.password;
};

export default mongoose.model<UserDocument>('User', userSchema);
