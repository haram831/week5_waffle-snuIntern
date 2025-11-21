import { useNavigate } from 'react-router-dom';
import styles from './MyInfo.module.css';

const MyInfo = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>내 정보</h2>

      <div className={styles.profileBox}>
        <p>아직 작성된 프로필이 없어요.</p>
      </div>

      <div className={styles.buttonRow}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => navigate('/profile/create')}
        >
          내 정보 생성
        </button>
      </div>
    </div>
  );
};

export default MyInfo;
