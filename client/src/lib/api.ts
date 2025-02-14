import { API } from '@/config/apiClient';
import { SigninType, SignupType } from '@/types/auth';

export const signin = async (data: SigninType) =>
  //make a post request to /api/auth/login
  API.post('/auth/login', data);

export const signup = async (data: SignupType) =>
  //make a post request to /api/auth/register
  API.post('/auth/register', data);
