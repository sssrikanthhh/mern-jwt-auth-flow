import axios from 'axios';

const options = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
};

export const API = axios.create(options);

//interceptors
API.interceptors.response.use(
  response => response.data,
  error => {
    const { status, data } = error.response;
    return Promise.reject({ status, ...data });
  }
);
