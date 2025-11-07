import React from 'react';
import { BsBookmark, BsBookmarkFill, BsGeoAlt } from 'react-icons/bs';
import type { JobInfo } from '../../@types/job.d.ts';
import useAuthStore from '../../store/authStroe.ts';
import useModalStore from '../../store/modalStore.ts';
import styles from './JobCard.module.css';

type JobCardProps = {
  job: JobInfo;
  onToggleBookmark: (postId: string, isBookmarked: boolean) => void;
};

// domain을 한글로 매핑
const domainMap: { [key: string]: string } = {
  FINTECH: '핀테크',
  HEALTHTECH: '헬스테크',
  EDUCATION: '교육',
  ECOMMERCE: '이커머스',
  FOODTECH: '푸드테크',
  MOBILITY: '모빌리티',
  CONTENTS: '컨텐츠',
  B2B: 'B2B',
  OTHERS: '기타',
};

// positionType을 한글로 매핑
const positionTypeMap: { [key: string]: string } = {
  FRONT: '프론트엔드 개발',
  APP: '앱 개발',
  BACKEND: '백엔드 개발',
  DATA: '데이터 분석',
  OTHERS: '기타 개발',
  DESIGN: '디자인',
  PLANNER: '기획',
  MARKETING: '마케팅',
  HUMANRESOURCE: '인사/HR',
};

function JobCard({ job, onToggleBookmark }: JobCardProps) {
  const { isLoggedIn } = useAuthStore();
  const { openLoginModal } = useModalStore();
  
  if (!job) return null;

  const isBookmarkedToShow = isLoggedIn ? job.isBookmarked : false;

  // 마감 처리용 함수
  const getDeadlineText = (endDate: string | null): string => {
    // null이면 "상시 채용"
    if (endDate === null) {
      return '상시 채용';
    }

    const now = new Date();
    const endDateObj = new Date(endDate); // 문자열을 Date 객체로 변환

    // 현재 시각 이전이면 "마감"
    if (endDateObj < now) {
      return '마감';
    }

    // 현재 시각 이후면 "D-??"
    const diffMs = endDateObj.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return `D-${diffDays}`;
  };

  const deadlineText = getDeadlineText(job.employmentEndDate);


  // 북마크 클릭 핸들러
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoggedIn) {
      // 로그인 O: bookmark.ts의 API 호출 함수 실행
      onToggleBookmark(job.id, job.isBookmarked);
    } else {
      // 로그인 X: global Store의 모달 열기 함수 실행
      openLoginModal();
    }
  };

  return (
    <div className={styles.jobCard}>
      <div className={styles.jobCardHeader}>
        <div className={styles.jobCardCompanyInfo}>
          <div className={styles.jobCardLogo} />
          {/* 이미지 임시로 블록 처리
          <img
            src={job.profileImageKey}
            alt={`${job.companyName} logo`}
            className={styles.jobCardLogo}
          /> */}
          <span className={styles.jobCardCompanyName}>{job.companyName}</span>
        </div>
        <button
          className={styles.jobCardBookmark}
          onClick={handleBookmarkClick}
        >
          {isBookmarkedToShow ? <BsBookmarkFill /> : <BsBookmark />}
        </button>
      </div>

      <div className={styles.jobCardBody}>
        <h2 className={styles.jobCardPositionTitle}>{job.positionTitle}</h2>
        <div className={styles.jobCardMeta}>
          <span className={styles.jobCardDomain}>
            {domainMap[job.domain] || job.domain}
          </span>
          <span className={styles.jobCardPositionType}>
            {positionTypeMap[job.positionType] || job.positionType}{' '}
            {job.headCount}명
          </span>
        </div>
        <span className={styles.jobCardDeadline}>{deadlineText}</span>
        <p className={styles.jobCardDetailSummary}>{job.detailSummary}</p>
      </div>

      <div className={styles.jobCardFooter}>
        <div className={styles.jobCardTags}>
          <span className={styles.jobCardTag}>
            <BsGeoAlt />
            {job.location.split(' ').slice(0, 2).join(' ')}
          </span>
          {job.tags.map((tagObj, index) => (
            <span key={index} className={styles.jobCardTag}>
              {tagObj.tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JobCard;