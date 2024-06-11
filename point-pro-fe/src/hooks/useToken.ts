import { useRef } from 'react';

export const useToken = () => {
  const tokenRef = useRef<string | null>(null);

  const isAdmin = location.href.includes('admin');
  const sessionToken = sessionStorage.getItem('token');

  // 後台店員操作畫面，token 來自 sessionStorage
  if (isAdmin) {
    tokenRef.current = sessionToken;
  } else {
    // 前台客人點餐，token 來自 queryString
    const params = new URLSearchParams(window.location.search);
    const newToken = params.get('token');
    if (newToken) {
      sessionStorage.setItem('token', newToken);
      tokenRef.current = newToken;
    } else if (sessionToken) {
      tokenRef.current = sessionToken;
    }
  }

  return tokenRef.current;
};
