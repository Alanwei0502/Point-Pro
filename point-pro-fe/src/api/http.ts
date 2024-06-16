import axios from 'axios';
import { toast } from 'react-toastify';
import { ROUTE_PATH } from '~/router/App';

export const apiHost = import.meta.env.VITE_API_HOST;

export const http = axios.create({ baseURL: `${apiHost}/api` });

http.interceptors.request.use(
  (configs) => {
    const token = sessionStorage.getItem('token') || '';
    configs.headers['isAdmin'] = window.location.href.includes('admin');
    configs.headers['Authorization'] = `Bearer ${token}`;
    return configs;
  },
  (error) => {
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  // error
  (error) => {
    errorCodeCheck(error.response.status);
    return Promise.reject(error);
  },
);

const errorCodeCheck = (status: number) => {
  switch (status) {
    case 401:
    case 403: {
      sessionStorage.removeItem('token');
      const isInAdminLoginPage = location.pathname === `/${ROUTE_PATH.admin}`;
      const isInCMS = location.pathname.includes('admin');

      if (isInCMS && !isInAdminLoginPage) {
        // 後台
        toast.error('登入逾時，請重新登入');
        setTimeout(() => {
          location.replace(`${location.origin}/admin`);
        }, 1000);
      } else if (!isInCMS) {
        // 前台
        sessionStorage.removeItem('people');
        sessionStorage.removeItem('startAt');
        toast.error('登入逾時，請重新登入');
        setTimeout(() => {
          location.replace(`${location.origin}/menu`);
        }, 1000);
      }
      break;
    }
    default:
      break;
  }
};
