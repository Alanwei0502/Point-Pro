import axios from 'axios';
import { toast } from 'react-toastify';
import { dineInTokenSliceActions } from '~/store/slices';
import { store } from '~/store/store';
import { ROUTE_PATH } from '~/constants';

const { removeDineInToken } = dineInTokenSliceActions;

export const API_HOST = import.meta.env.VITE_API_HOST;

export const http = axios.create({ baseURL: `${API_HOST}/api` });

http.interceptors.request.use(
  (configs) => {
    const adminToken = sessionStorage.getItem('token') || '';
    const customerToken = store.getState().dineInToken.token;
    const isAdmin = window.location.href.includes('admin');
    configs.headers['isAdmin'] = isAdmin;
    configs.headers['Authorization'] = `Bearer ${isAdmin ? adminToken : customerToken}`;
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
      const isInMenuPage = location.pathname === `/${ROUTE_PATH.menu}`;
      const isInCMS = /admin\/.+/.test(location.pathname);

      // 後台
      if (isInCMS) {
        toast.error('登入逾時，請重新登入');
        sessionStorage.removeItem('token');
        setTimeout(() => {
          location.replace(`${location.origin}/${ROUTE_PATH.admin}`);
        }, 1000);
      }

      // 前台
      if (isInMenuPage) {
        toast.error('登入逾時，請重新登入');
        store.dispatch(removeDineInToken());
        setTimeout(() => {
          location.replace(`${location.origin}/${ROUTE_PATH.menu}`);
        }, 1000);
      }
      break;
    }
    default:
      break;
  }
};
