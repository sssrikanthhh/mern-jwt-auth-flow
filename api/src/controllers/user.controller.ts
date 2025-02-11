import { NOT_FOUND, OK } from '../constants/httpCodes';
import UserModel from '../models/user.model';
import { appAssert } from '../utils/appAssert';
import { catchErrors } from '../utils/catchErrors';

export const getUserHandler = catchErrors(async (req, res) => {
  const userId = req.userId;
  //get the user
  const user = await UserModel.findById(userId);
  //if the user is not found, throw an error
  appAssert(user, NOT_FOUND, 'User not found');
  return res.status(OK).json(user.omitPassword());
});
