import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { authSliceActions } from '~/store/slices/admin/auth.slice';
import { dineInTokenSliceActions } from '~/store/slices/customer/dineInToken.slice';
import { useLocation } from 'react-router-dom';

export const useToken = () => {
  const dispatch = useAppDispatch();

  const { pathname } = useLocation();

  const adminToken = useAppSelector((state) => state.auth.authToken);
  const dineInToken = useAppSelector((state) => state.dineInToken.token);

  useEffect(() => {
    const isAdmin = pathname.includes('admin');

    // 後台店員操作畫面，token 來自 sessionStorage
    if (isAdmin) {
      const { setAdminToken } = authSliceActions;
      dispatch(setAdminToken());
    } else {
      const { setDineInToken } = dineInTokenSliceActions;
      // 前台客人點餐，token 來自 queryString
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      const token = params.get('token');
      const people = params.get('people');
      const startAt = params.get('startAt');
      if (token && id && people && startAt && id) {
        dispatch(setDineInToken({ token, reservationId: id, people: +people, startAt }));
      }
    }
  }, [pathname, dispatch]);

  return { adminToken, dineInToken };
};
