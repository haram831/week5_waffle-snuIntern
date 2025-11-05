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
        <pre>{JSON.stringify(jobs, null, 2)}</pre> {/* 화면에서도 확인 가능 */}
      </div>
      <Filter onFilterChange={handleFilterChange} />
      <JobList />
      <Pagination
        pageCount={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
