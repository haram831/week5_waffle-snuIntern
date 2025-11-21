import { useState } from 'react';
import styles from './MyPage.module.css';
import MyBookMarks from '../components/MyPage/MyBookMarks';
import MyInfo from '../components/MyPage/MyInfo';

const MyPage = () => {
  const [activeTab, setActiveTab] = useState<'bookmark' | 'info'>('bookmark');

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>마이페이지</h1>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'bookmark' ? styles.active : ''}`}
          onClick={() => setActiveTab('bookmark')}
        >
          관심공고
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'info' ? styles.active : ''}`}
          onClick={() => setActiveTab('info')}
        >
          내 정보
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'bookmark' && <MyBookMarks />}
        {activeTab === 'info' && <MyInfo />}
      </div>
    </div>
  );
};

export default MyPage;
