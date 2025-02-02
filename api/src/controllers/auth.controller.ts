import { catchErrors } from '../utils/catchErrors';
import { createAccount, loginUser, logoutUser } from '../services/auth.service';
import { CREATED, OK, UNAUTHORIZED } from '../constants/httpCodes';
import { clearAuthCookies, setAuthCookies } from '../utils/cookies';
import { loginSchema, registerSchema } from '../schemas/auth';
import { appAssert } from '../utils/appAssert';

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

export const logoutHandler = catchErrors(async (req, res) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  await logoutUser(accessToken || '');
  return clearAuthCookies(res).status(OK).json({
    message: 'Logout successful'
  });
});
