import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStroe';
import styles from './Header.module.css';

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, username, logout } = useAuthStore();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>스누인턴</h1>
      <div className={styles.menu}>
        {isLoggedIn ? (
          <>
            <span>{username}님</span>
            <button type="button" onClick={handleLogout} className={styles.link}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.link}>
              <span>로그인</span>
            </Link>
            <Link to="/signup" className={styles.link}>
              <span>회원가입</span>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
