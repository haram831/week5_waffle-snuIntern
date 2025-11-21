import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MyBookMarks from '../components/MyPage/MyBookMarks';
import MyInfo from '../components/MyPage/MyInfo';
import styles from './MyPage.module.css';

type Tab = 'bookmark' | 'info';

const MyPage = () => {
  const [currentTab, setCurrentTab] = useState<Tab>('bookmark');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'info') {
      setCurrentTab('info');
    } else {
      setCurrentTab('bookmark');
    }
  }, [searchParams]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <button
          type="button"
          className={`${styles.tabButton} ${
            currentTab === 'bookmark' ? styles.active : ''
          }`}
          onClick={() => setCurrentTab('bookmark')}
        >
          관심공고
        </button>
        <button
          type="button"
          className={`${styles.tabButton} ${
            currentTab === 'info' ? styles.active : ''
          }`}
          onClick={() => setCurrentTab('info')}
        >
          내 정보
        </button>
      </div>

      <div className={styles.content}>
        {currentTab === 'bookmark' ? <MyBookMarks /> : <MyInfo />}
      </div>
    </div>
  );
};

export default MyPage;
