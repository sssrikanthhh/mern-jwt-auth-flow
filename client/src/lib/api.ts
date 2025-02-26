import { API } from '@/config/apiClient';
import { SigninType, SignupType } from '@/types/auth';
import { Session } from '@/types/session';
import { User } from '@/types/user';

export const signin = async (data: SigninType) =>
  //make a post request to /api/auth/login
  API.post('/auth/login', data);

export const signout = async () =>
  //make a get request to /api/auth/logout
  API.get('/auth/logout', { withCredentials: true });

export const signup = async (data: SignupType) =>
  //make a post request to /api/auth/register
  API.post('/auth/register', data);

export const verifyEmail = async (code: string) =>
  //make a get request to /api/auth/email/verify/:code
  API.get(`/auth/email/verify/${code}`);

export const sendPasswordResetEmail = async (email: string) =>
  //make a post request to /api/auth/password/forgot
  API.post('/auth/password/forgot', { email });

export const resetPassword = async ({
  password,
  verificationCode
}: {
  password: string;
  verificationCode: string;
}) =>
  //make a post request to /api/auth/password/reset
  API.post('/auth/password/reset', { verificationCode, password });

//user api
export const fetchUser = async (): Promise<User> =>
  //make a get request to /api/user
  API.get('/user', { withCredentials: true });

//session api
export const fetchSessions = async (): Promise<Session[]> =>
  //make a get request to /api/sessions
  API.get('/sessions', { withCredentials: true });

export const deleteSession = async (sessionId: string) =>
  //make a delete request to /api/sessions/:id
  API.delete(`/sessions/${sessionId}`, { withCredentials: true });
