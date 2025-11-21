import styles from './MyInfo.module.css';

const MyInfo = () => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>내 정보</h2>
      <div className={styles.profileBox}>
        <div className={styles.row}>
          <span className={styles.label}>이름</span>
          <span className={styles.value}>이름</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>이메일</span>
          <span className={styles.value}>email@example.com</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>학번</span>
          <span className={styles.value}>00학번</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>학과</span>
          <span className={styles.value}>학과 정보</span>
        </div>
      </div>
      <div className={styles.buttonRow}>
        <button type="button" className={styles.primaryButton}>
          내 프로필 생성
        </button>
      </div>
    </div>
  );
};

export default MyInfo;
