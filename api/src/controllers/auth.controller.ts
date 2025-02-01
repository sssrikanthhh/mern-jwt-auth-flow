import z from 'zod';
import { catchErrors } from '../utils/catchErrors';
import { createAccount, loginUser } from '../services/auth.service';
import { CREATED, OK } from '../constants/httpCodes';
import { setAuthCookies } from '../utils/cookies';
import { loginSchema, registerSchema } from '../schemas/auth';

export const registerHandler = catchErrors(async (req, res) => {
  //validate the request body with zod schema
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers['user-agent']
  });
  const { user, refreshToken, accessToken } = await createAccount(request);

  return setAuthCookies({ res, refreshToken, accessToken })
    .status(CREATED)
    .json(user);
});

export const loginHandler = catchErrors(async (req, res) => {
  //validate the request body with zod schema
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers['user-agent']
  });
  const { accessToken, refreshToken } = await loginUser(request);

  return setAuthCookies({ res, refreshToken, accessToken }).status(OK).json({
    message: 'Login successful'
  });
});
