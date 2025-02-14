import { API } from '@/config/apiClient';
import { SigninType } from '@/types/auth';

export const signin = async (data: SigninType) =>
  //make a post request to /api/auth/login
  API.post('/auth/login', data);
