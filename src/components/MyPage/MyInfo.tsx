import { useNavigate } from 'react-router-dom';
import type { ApplicantProfile } from '../../@types/applicant';
import type { PageState } from '../../routes/MyPage';
import styles from './MyInfo.module.css';

type Props = {
  pageState: PageState;
  profile: ApplicantProfile | null;
};

function MyInfo({ pageState, profile }: Props) {
  const navigate = useNavigate();

  if (pageState === 'LOADING') {
    return <div className={styles.loading}>프로필 정보를 불러오는 중...</div>;
  }

  // 프로필 없으면
  if (pageState === 'PROFILE_NOT_FOUND') {
    return (
      <div className={styles.emptyContainer}>
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

  // 프로필 있으면
  if (pageState === 'PROFILE_EXISTS' && profile) {
    const departmentText = profile.department.split(',').join(' · ');
    const enrollYearText = String(profile.enrollYear).slice(-2);

    return (
      <div className={styles.profileContainer}>
        <h2 className={styles.name}>{profile.name}</h2>
        <p className={styles.email}>{profile.email}</p>
        <p className={styles.info}>
          {departmentText} {enrollYearText}학번
        </p>
      </div>
    );
  }

  return <div className={styles.error}>프로필을 불러오는 데 실패했습니다.</div>;
}

export default MyInfo;
