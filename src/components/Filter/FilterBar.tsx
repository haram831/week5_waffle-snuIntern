import { useEffect, useState } from 'react';
import type { JobFilter } from '../../@types/job';

interface Props {
    onFilterChange: (newFilters: JobFilter) => void;
}

export default function FilterBar({ onFilterChange }: Props) {

    const [selectedStatus, setSelectedStatus] = useState<JobFilter>({
        roles: [],
        isActive: undefined,
        domains: [],
        page: undefined,
        order: undefined,
    });
    const allDomains = [
        'FINTECH', 'HEALTHTECH', 'EDUCATION', 'ECOMMERCE',
        'FOODTECH', 'MOBILITY', 'CONTENTS', 'B2B', 'OTHERS',
    ];

    useEffect(() => {
        onFilterChange(selectedStatus);
    }, [onFilterChange, selectedStatus]);

    return(
        <div>
            <div>
                <p>모집 상태</p>
            </div>
            <div>
                <label>
                    <input type='radio' value='isActive' checked={selectedStatus.isActive === true} onChange={() => setSelectedStatus({ ...selectedStatus, isActive: false })} />
                    전체
                </label>
                <label>
                    <input type='radio' value='isActive' checked={selectedStatus.isActive === true} onChange={() => setSelectedStatus({ ...selectedStatus, isActive: true })} />
                    모집중
                </label>
            </div>
            <div>
                <p>업종</p>
            </div>
            <div>
                <label>
                    <input type='checkbox' value='domains' checked={
                        allDomains.every((domain) => selectedStatus.domains?.includes(domain))
                    } onChange={(e) => {
                        if (e.target.checked) {
                            setSelectedStatus({ ...selectedStatus, domains: allDomains });
                        } else {
                            setSelectedStatus({ ...selectedStatus, domains: [] });
                        }
                    }} />
                    전체
                </label>
            </div>
            <div>
                <p>최신순</p>
            </div>
            <div>
                <p>초기화</p>
            </div>
        </div>
    )
}