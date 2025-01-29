
import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

type TDetailMessage = {
  type: string;
  message: string;
}

const StatusCodeMapping: Record<number, boolean> = {
  [StatusCodes.BAD_REQUEST]: true,
  [StatusCodes.UNAUTHORIZED]: false,
  [StatusCodes.NOT_FOUND]: true
};

const shouldDisplayError = (response: AxiosResponse) => !!StatusCodeMapping[response.status];

const timeOut = import.meta.env.VITE_TIME_OUT;
const baseURL = import.meta.env.VITE_UPLOAD_URL;


export const createApi = (): AxiosInstance => {
  const api = axios.create({
    baseURL: baseURL,
    timeout: timeOut,
  });

  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token: string | null = window.localStorage.getItem('token');

    if (token && config.headers) {
      config.headers['x-token'] = token;
    }

    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<TDetailMessage>) => {
      if (error.response && shouldDisplayError(error.response)) {
        const { message } = error.response.data;
        toast.warn(message);
      }

      throw error;
    }
  );

  return api;
};
