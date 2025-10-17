import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { getUserInfo } from '../api/auth';
import useAuthStore from '../store/authStroe';
import Header from './Header';

function Layout() {
  const { isLoggedIn, login: storeLogin, logout } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token || isLoggedIn) return;
    (async () => {
      try {
        const me = await getUserInfo();
        storeLogin(me.name);
      } catch {
        localStorage.removeItem('authToken');
        logout();
      }
    })();
  }, [isLoggedIn, storeLogin, logout]);

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default Layout;
