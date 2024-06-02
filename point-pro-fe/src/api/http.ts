import axios, { AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import { getToken } from '~/utils/token.utils';

export const apiHost = import.meta.env.VITE_API_HOST;

export const http = axios.create({ baseURL: `${apiHost}/api` });

http.interceptors.request.use(
  (configs) => {
    const token = getToken();

    configs.headers.authorization = `Bearer ${token}`;
    return configs;
  },
  (error) => {
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (response) => {
    // log(response.config, response.data);
    return response.data;
  },
  // error
  (error) => {
    // const { response } = error;
    // log(response.config, response.data, true);
    errorCodeCheck(error.response.status);
    return Promise.reject(error);
  },
);

const errorCodeCheck = (status: number) => {
  switch (status) {
    case 401:
    case 403:
      // case 500:
      sessionStorage.removeItem('token');
      if (location.href.includes('admin')) {
        location.replace(`${location.origin}/admin`);
      }
      break;
    default:
      break;
  }
};

// function log({ method, url }: AxiosRequestConfig, text: string, error = false) {
//   console.log(`%c ${method}/${url} `, `color: white; background-color: #${error ? 'f66361' : '95B46A'}`, text);
// }
