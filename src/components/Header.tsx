import styles from './Header.module.css';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>스누인턴</h1>
      <div className={styles.menu}>
        <Link to ="/login" className={styles.link}>
          <span>로그인</span>
        </Link>
        <Link to ="/signup" className={styles.link}>
          <span>회원가입</span>
        </Link>
      </div>

    </header>
  );
}

export default Header;