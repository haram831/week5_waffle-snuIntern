import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStroe';
import styles from './Header.module.css';

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuthStore();

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    localStorage.removeItem('authToken');
    logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.title}>
        스누인턴
      </Link>

      <div className={styles.menu}>
        {isLoggedIn ? (
          <>
            <Link to="/mypage" className={styles.link}>
              마이페이지
            </Link>
            <Link to="/" onClick={handleLogout} className={styles.link}>
              로그아웃
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.link}>
              로그인
            </Link>
            <Link to="/signup" className={styles.link}>
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
