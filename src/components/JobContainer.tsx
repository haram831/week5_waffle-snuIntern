import { useCallback, useEffect, useState } from 'react';
import type { JobFilter, JobInfo } from '../@types/job.d.ts';
import { fetchJobList } from '../api/job.ts';
import Filter from './Filter';
import JobList from './Job/JobList';
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

  return (
    <div>
      <div>
        <h1>공고 목록 데이터 확인용</h1>
        <pre>{JSON.stringify(jobs, null, 2)}</pre>
      </div>
      <Filter
        Filters={filters}
        ROLE_MAP={ROLE_MAP}
        DOMAIN_MAP={DOMAIN_MAP}
        onFilterChange={handleFilterChange}
      />
      <JobList />
      <Pagination
        pageCount={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
