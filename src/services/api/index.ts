import axios, { AxiosInstance } from 'axios';
import { UPLOAD_URL, TIME_OUT } from '../../constant';
export default function createApi():AxiosInstance{

  const token: string | null = window.localStorage.getItem('token');

  const timeOut = TIME_OUT;
  const url = UPLOAD_URL;
  const baseURL = url;

  const axiosInstance = axios.create({baseURL: baseURL, timeout: timeOut});

  axiosInstance.defaults.headers.common['X-Token'] = `${token}` || '';

  return axiosInstance;
}
