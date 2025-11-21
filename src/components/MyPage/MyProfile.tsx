import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApplicantProfile } from '../../api/applicant';
import styles from './MyProfile.module.css'; // MyPage.module.css가 아닌 별도 CSS


// 이거 나중에 @types로 옮기기
export interface ApplicantProfile {
  id: string;
  name: string;
  email: string;
  enrollYear: number; // 예: 2021
  department: string; // 예: "컴퓨터공학부,경영학과(복수전공)"
  // ... API가 반환하는 다른 필드들 ...
}

// 1. 상태(State) 정의
type PageState = 'LOADING' | 'PROFILE_NOT_FOUND' | 'PROFILE_EXISTS';

// MyPage.tsx가 아닌, '내 정보' 탭 전용 컴포넌트
export default function MyProfile() {
  const [pageState, setPageState] = useState<PageState>('LOADING');
  const [profile, setProfile] = useState<ApplicantProfile | null>(null);
  const navigate = useNavigate();

  // 2. 데이터 로딩 (이 로직은 MyProfile 컴포넌트가 렌더링될 때만 실행됨)
  useEffect(() => {
    const loadProfile = async () => {
      setPageState('LOADING'); // 탭을 다시 누를 때마다 로딩
      try {
        const data = await getApplicantProfile();
        setProfile(data);
        setPageState('PROFILE_EXISTS');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.data.code === 'APPLICANT_002') {
            setPageState('PROFILE_NOT_FOUND');
          } else {
            console.error('프로필 로딩 중 다른 에러:', error);
            // TODO: 실제 에러 UI 처리
          }
        } else {
          console.error('알 수 없는 에러:', error);
        }
      }
    };

    loadProfile();
  }, []); // MyProfile 컴포넌트 마운트 시 1회 실행

  // 3. UI 렌더링 (이전 MyPage.tsx의 renderProfile 함수 내용)

  // 3-1. 로딩 중
  if (pageState === 'LOADING') {
    return <div className={styles.loading}>프로필 정보를 불러오는 중...</div>;
  }

  // 3-2. 프로필 없음 (APPLICANT_002) - 155450.png
  if (pageState === 'PROFILE_NOT_FOUND') {
    return (
      <div className={styles.emptyContainer}>
        <button
          onClick={() => navigate('/mypage/create-profile')}
          className={styles.createButtonHeader}
        >
          내 프로필 생성
        </button>
        <h2>아직 프로필이 등록되지 않았어요!</h2>
        <p>기업에 소개할 나의 정보를 작성해서 나를 소개해보세요.</p>
        <button
          onClick={() => navigate('/mypage/create-profile')}
          className={styles.createButtonMain}
        >
          지금 바로 프로필 작성하기
        </button>
      </div>
    );
  }

  // 3-3. 프로필 있음 - 155645.png
  if (pageState === 'PROFILE_EXISTS' && profile) {
    const departmentText = profile.department.split(',').join(' · ');

    return (
      <div className={styles.profileContainer}>
        <button
          onClick={() => navigate('/mypage/edit-profile')}
          className={styles.editButtonHeader}
        >
          내 프로필 수정
        </button>
        <h2 className={styles.name}>{profile.name}</h2>
        <p className={styles.email}>{profile.email}</p>
        <p className={styles.info}>
          {departmentText} {profile.enrollYear}학번
        </p>
      </div>
    );
  }

  // 3-4. (예외) 그 외의 경우
  return <div className={styles.error}>프로필을 불러오는 데 실패했습니다.</div>;
}