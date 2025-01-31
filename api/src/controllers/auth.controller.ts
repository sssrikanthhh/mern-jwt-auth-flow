import z from 'zod';
import { catchErrors } from '../utils/catchErrors';
import { createAccount } from '../services/auth.service';
import { CREATED } from '../constants/httpCodes';
import { setAuthCookies } from '../utils/cookies';

const registerSchema = z
  .object({
    email: z.string().min(1).max(255),
    password: z.string().min(8).max(255),
    confirmPassword: z.string().min(8).max(255),
    userAgent: z.string().optional()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

export const registerHandler = catchErrors(async (req, res) => {
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers['user-agent']
  });
  const { user, refreshToken, accessToken } = await createAccount(request);

  return setAuthCookies({ res, refreshToken, accessToken })
    .status(CREATED)
    .json(user);
});
