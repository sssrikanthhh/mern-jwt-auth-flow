import mongoose from 'mongoose';
import { compareValue, hashValue } from '../utils/bcrypt';

export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (val: string) => Promise<boolean>;
  omitPassword(): Pick<
    UserDocument,
    '_id' | 'email' | 'verified' | 'createdAt' | 'updatedAt'
  >;
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
  return compareValue(val, this.password);
};

userSchema.methods.omitPassword = function () {
  const userObj = this.toObject();
  delete userObj.password;
  return userObj;
};

const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;
