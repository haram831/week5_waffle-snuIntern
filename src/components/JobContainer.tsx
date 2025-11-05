import {useEffect, useState } from "react";
import type { JobFilter, JobInfo } from "../@types/job.d.ts";
import { fetchJobList } from "../api/job.ts";
import Filter from "./Filter";
import JobList from "./Job/JobList";
import Pagination from "./Pagination";

export default function JobContainer() {
    const [jobs, setJobs] = useState<JobInfo[]>([]);
    const [filters, setFilters] = useState<JobFilter>({});
    const [pages, setPages] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const handleFilterChange = (newFilters: JobFilter) => {
        setFilters(newFilters);
    };

    useEffect(() => {
        const loadJobs = async () => {
            const data = await fetchJobList(filters.roles, filters.isActive, filters.domains, filters.page, filters.order);
            setJobs(data.posts);
            setPages(data.paginator.lastPage);
        };
        loadJobs();
    }, [filters]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    }

    return (
        <div>
            <div>
                <h1>공고 목록 데이터 확인용</h1>
                <pre>{JSON.stringify(jobs, null, 2)}</pre> {/* 화면에서도 확인 가능 */}
            </div>
            <Filter onFilterChange={handleFilterChange} />
            <JobList />
            <Pagination 
                totalItems={jobs.length} 
                itemPerPage={jobs.length / pages} 
                pageCount={pages} 
                currentPage={currentPage} 
                onPageChange={handlePageChange} />
        </div>
    );
}
