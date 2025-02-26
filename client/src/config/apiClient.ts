import axios from 'axios';
import { queryClient } from './query-client';
import { navigate } from '@/lib/navigation';

const options = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
};

export const API = axios.create(options);
//create a client for refreshing the access token - to avoid infinite loop with the error interceptor
const TokenRefreshClient = axios.create(options);
TokenRefreshClient.interceptors.response.use(response => response.data);

//interceptors
API.interceptors.response.use(
  response => response.data,
  async error => {
    const { response, config } = error;
    const { status, data } = response || {};

    //refresh the access token if the status is 401
    if (status === 401 && data?.errorCode === 'INVALID_ACCESS_TOKEN') {
      try {
        await TokenRefreshClient.get('/auth/refresh');

        return TokenRefreshClient(config);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        queryClient.clear();
        navigate('/signin', {
          state: {
            redirectUrl: window.location.pathname
          }
        });
      }
    }

    return Promise.reject({ status, ...data });
  }
);
