import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import type { ApplicantProfile } from '../@types/applicant';
import { getApplicantProfile } from '../api/applicant';
import MyBookMarks from '../components/MyPage/MyBookMarks';
import MyInfo from '../components/MyPage/MyInfo';
import styles from './MyPage.module.css';

export type PageState = 'LOADING' | 'PROFILE_NOT_FOUND' | 'PROFILE_EXISTS';

export default function MyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentTab = searchParams.get('tab') || 'BOOKMARK';

  const [pageState, setPageState] = useState<PageState>('LOADING');
  const [profile, setProfile] = useState<ApplicantProfile | null>(null);

  // 프로필 정보 있는지 확인
  useEffect(() => {
    const loadProfile = async () => {
      setPageState('LOADING');
      try {
        const data = await getApplicantProfile();
        setProfile(data);
        setPageState('PROFILE_EXISTS');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.data.code === 'APPLICANT_002') {
            setPageState('PROFILE_NOT_FOUND');
          } else {
            console.error('프로필 로딩 에러:', error);
          }
        } else {
          console.error('알 수 없는 에러:', error);
        }
      }
    };
    loadProfile();
  }, []);

  return (
    <div className={styles.container}>
      <h1>마이페이지</h1>
      <div className={styles.headerRow}>
        <nav className={styles.tabs}>
          <Link
            to="/mypage?tab=BOOKMARK"
            className={`${styles.tab} ${
              currentTab === 'BOOKMARK' ? styles.active : ''
            }`}
          >
            관심공고
          </Link>
          <Link
            to="/mypage?tab=PROFILE"
            className={`${styles.tab} ${
              currentTab === 'PROFILE' ? styles.active : ''
            }`}
          >
            내 정보
          </Link>
        </nav>
        <div className={styles.actionButtonArea}>
          {pageState === 'PROFILE_NOT_FOUND' && (
            <button
              onClick={() => navigate('/mypage/create-profile')}
              className={styles.headerButton}
            >
              내 프로필 생성
            </button>
          )}
          {pageState === 'PROFILE_EXISTS' && (
            <button
              onClick={() => navigate('/mypage/edit-profile')}
              className={styles.headerButton}
            >
              내 프로필 수정
            </button>
          )}
        </div>
      </div>

      <div className={styles.content}>
        {currentTab === 'BOOKMARK' && <MyBookMarks />}
        {currentTab === 'PROFILE' && (
          <MyInfo pageState={pageState} profile={profile} />
        )}
      </div>
    </div>
  );
}
