import { Link, useSearchParams } from 'react-router-dom';
import BookmarkedJobs from '../components/MyPage/BookmarkedJobs';
import MyProfile from '../components/MyPage/MyProfile';
import styles from './MyPage.module.css';

export default function MyPage() {
  const [searchParams] = useSearchParams();
  // URL에 ?tab=... 파라미터가 없으면 'BOOKMARK'를 기본값으로 사용
  const currentTab = searchParams.get('tab') || 'BOOKMARK';

  return (
    <div className={styles.container}>
      <h1>마이페이지</h1>
      <nav className={styles.tabs}>
        {/*
          이제 Link 컴포넌트를 사용합니다.
          클릭 시 /mypage?tab=BOOKMARK 로 이동합니다.
        */}
        <Link
          to="/mypage?tab=BOOKMARK"
          className={`${styles.tab} ${
            currentTab === 'BOOKMARK' ? styles.active : ''
          }`}
        >
          관심공고
        </Link>
        {/*
          클릭 시 /mypage?tab=PROFILE 로 이동합니다.
        */}
        <Link
          to="/mypage?tab=PROFILE"
          className={`${styles.tab} ${
            currentTab === 'PROFILE' ? styles.active : ''
          }`}
        >
          내 정보
        </Link>
      </nav>

      {/*
        URL의 tab 값에 따라 렌더링할 컴포넌트를 결정합니다.
      */}
      <div className={styles.content}>
        {currentTab === 'BOOKMARK' && <BookmarkedJobs />}
        {currentTab === 'PROFILE' && <MyProfile />}
      </div>
    </div>
  );
}