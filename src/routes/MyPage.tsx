import { useState } from 'react';
import MyBookMarks from '../components/MyPage/MyBookMarks';
import MyInfo from '../components/MyPage/MyInfo';
import styles from './MyPage.module.css';

const MyPage = () => {
  const [currentTab, setCurrentTab] = useState<'info' | 'bookmarks'>('info');

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <button
          className={currentTab === 'info' ? styles.active : ''}
          onClick={() => setCurrentTab('info')}
        >
          내 정보
        </button>
        <button
          className={currentTab === 'bookmarks' ? styles.active : ''}
          onClick={() => setCurrentTab('bookmarks')}
        >
          내 북마크
        </button>
      </div>

      <div className={styles.content}>
        {currentTab === 'info' ? <MyInfo /> : <MyBookMarks />}
      </div>
    </div>
  );
};

export default MyPage;
