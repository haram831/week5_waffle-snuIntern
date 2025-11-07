import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { getUserInfo } from '../api/auth';
import useAuthStore from '../store/authStroe';
import useModalStore from '../store/modalStore';
import Header from './Header';
import LoginModal from './LoginModal.tsx';

function Layout() {
  const { isLoggedIn, login: storeLogin, logout } = useAuthStore();

  // 로그인모달 상태를 전역 스토어에서 가져옴
  const { isLoginModalOpen } = useModalStore();

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
      
      {/* 로그인 모달 렌더링 */}
      {isLoginModalOpen && <LoginModal />}
    </>
  );
}

export default Layout;
