import { useCallback, useEffect, useState } from 'react';
import type { JobFilter, JobInfo } from '../@types/job.d.ts';
import { addBookmark, removeBookmark } from '../api/bookmark.ts';
import { fetchJobList } from '../api/job.ts';
import Filter from './Filter';
import JobCard from './Job/JobCard.tsx';
import styles from './JobContainer.module.css';
import Pagination from './Pagination';

export default function JobContainer() {
  const [jobs, setJobs] = useState<JobInfo[]>([]);
  const [filters, setFilters] = useState<JobFilter>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const DOMAIN_MAP: { [key: string]: string } = {
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

  const ROLE_MAP = {
    DEVELOPMENT: {
      name: '개발',
      roles: {
        FRONT: '프론트엔드 개발',
        BACKEND: '서버·백엔드 개발',
        APP: '앱 개발',
        DATA: '데이터',
        OTHERS: '기타 분야',
      },
    },
    DESIGN: {
      name: '디자인',
      roles: {
        DESIGN: '디자인',
      },
    },
    PLANNING: {
      name: '기획',
      roles: {
        PLANNER: '기획',
      },
    },
    MARKETING: {
      name: '마케팅',
      roles: {
        MARKETING: '마케팅',
      },
    },
    HUMANRESOURCE: {
      name: '인사/HR',
      roles: {
        HUMANRESOURCE: '인사/HR',
      },
    },
  } as const;

  const handleFilterChange = useCallback((newFilters: JobFilter) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    const loadJobs = async () => {
      const apiPage = currentPage - 1;
      const data = await fetchJobList(
        filters.roles,
        filters.isActive,
        filters.domains,
        apiPage,
        filters.order
      );
      setJobs(data.posts);
      setTotalPages(data.paginator.lastPage);
    };
    loadJobs();
  }, [filters, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 북마크 토글 핸들러
  const handleBookmarkToggle = async (
    postId: string,
    isBookmarked: boolean
  ) => {
    try {
      if (isBookmarked) {
        // 찜하기 해제 API 호출
        await removeBookmark(postId);
      } else {
        // 찜하기 API 호출
        await addBookmark(postId);
      }

      // API 호출 성공 시, UI(jobs state) 즉시 업데이트
      setJobs((prevJobs) =>
        prevJobs.map(
          (job) =>
            job.id === postId
              ? { ...job, isBookmarked: !job.isBookmarked } // 해당 job의 isBookmarked 값 토글
              : job // 나머지는 그대로 반환
        )
      );
    } catch (error) {
      console.error('북마크 처리에 실패했습니다:', error);
      alert('북마크 상태 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div>
      <Filter
        Filters={filters}
        ROLE_MAP={ROLE_MAP}
        DOMAIN_MAP={DOMAIN_MAP}
        onFilterChange={handleFilterChange}
      />

      <div className={styles.joblist}>
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onToggleBookmark={handleBookmarkToggle}
          />
        ))}
      </div>

      <Pagination
        pageCount={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
