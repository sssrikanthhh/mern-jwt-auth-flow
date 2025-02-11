import { catchErrors } from '../utils/catchErrors';
import {
  createAccount,
  loginUser,
  logoutUser,
  refreshAccessToken,
  resetPassword,
  sendPasswordResetEmail,
  verifyEmail
} from '../services/auth.service';
import { CREATED, OK, UNAUTHORIZED } from '../constants/httpCodes';
import {
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies
} from '../utils/cookies';
import {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verificationCodeSchema
} from '../schemas/auth';
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

//refresh token handler
export const refreshHandler = catchErrors(async (req, res) => {
  //check for refresh token
  const refreshToken = req.cookies.refreshToken as string | undefined;
  //if the refresh token is missing, throw an error
  appAssert(refreshToken, UNAUTHORIZED, 'Refresh token missing!');

  const { accessToken, newRefreshToken } = await refreshAccessToken(
    refreshToken
  );
  if (newRefreshToken) {
    res.cookie('refreshToken', newRefreshToken, getRefreshTokenCookieOptions());
  }
  return res
    .status(OK)
    .cookie('accessToken', accessToken, getAccessTokenCookieOptions())
    .json({
      message: 'Access token refreshed'
    });
});

//verify email handler
export const verifyEmailHandler = catchErrors(async (req, res) => {
  //validate req.params
  const verificationCode = verificationCodeSchema.parse(req.params.code);

  await verifyEmail(verificationCode);

  res.status(OK).json({
    message: 'Email verified successfully'
  });
});

//forgot password handler
export const sendPasswordResetHandler = catchErrors(async (req, res) => {
  const email = emailSchema.parse(req.body.email);
  //call the sendPasswordResetEmail service
  await sendPasswordResetEmail(email);
  return res.status(OK).json({
    message: 'Password reset email sent successfully'
  });
});

//reset password handler
export const resetPasswordHandler = catchErrors(async (req, res) => {
  //validate the request body
  const { verificationCode, password } = resetPasswordSchema.parse(req.body);
  //call the resetPassword service
  await resetPassword({ verificationCode, password });

  //clearing the cookies, as the sessions are cleared(making the user to login again)
  return clearAuthCookies(res).status(OK).json({
    message: 'Password reset successful'
  });
});
