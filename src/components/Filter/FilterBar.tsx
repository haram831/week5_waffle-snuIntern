import { useEffect, useState } from 'react';
import type { JobFilter } from '../../@types/job';

interface Props {
  Filters: JobFilter;
  DOMAIN_MAP: { [key: string]: string };
  onFilterChange: (newFilters: JobFilter) => void;
}

export default function FilterBar({ Filters, DOMAIN_MAP, onFilterChange }: Props) {
  const [selectedStatus, setSelectedStatus] = useState<JobFilter>(Filters);

  useEffect(() => {
    setSelectedStatus(Filters);
  }, [Filters]);

  const [isActiveClicked, setIsActiveClicked] = useState(false);
  const [isDomainClicked, setIsDomainClicked] = useState(false);
  const [isLatestClicked, setIsLatestClicked] = useState(false);

  return (
    <div>
      <div onClick={() => setIsActiveClicked(true)}>
        <p>모집 상태</p>
      </div>
      {isActiveClicked && (
        <>
          <div>
            <label>
              <input
                type="radio"
                value="isActive"
                checked={selectedStatus.isActive === true || selectedStatus.isActive === false}
                onChange={() =>
                  setSelectedStatus({ ...selectedStatus, isActive: false })
                }
              />
              전체
            </label>
            <label>
              <input
                type="radio"
                value="isActive"
                checked={selectedStatus.isActive === undefined}
                onChange={() =>
                  setSelectedStatus({ ...selectedStatus, isActive: true })
                }
              />
              모집중
            </label>
          </div>

          <button onClick={() => setSelectedStatus({
            roles: [...selectedStatus.roles || []],
            isActive: undefined,
            domains: [...selectedStatus.domains || []],
            page: selectedStatus.page,
            order: 0,
          })}>초기화</button>
          <button onClick={() => onFilterChange(selectedStatus)}>적용</button>
        </>
      )}


      <div onClick={() => setIsDomainClicked(true)}>
        <p>업종</p>
      </div>
      {isDomainClicked && (
      <div>
        <label>
          <input
            type="checkbox"
            value="domains"
            checked={Object.keys(DOMAIN_MAP).every((domain) =>
              selectedStatus.domains?.includes(domain)
            )}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedStatus({ ...selectedStatus, domains: Object.keys(DOMAIN_MAP) });
              } else {
                setSelectedStatus({ ...selectedStatus, domains: [] });
              }
            }}
          />
          전체
        </label>
        {Object.entries(DOMAIN_MAP).map(([domainKey, domainValue]) => (
          <label key={domainKey}>
            <input
              type="checkbox"
              value={domainKey}
              checked={selectedStatus.domains?.includes(domainKey)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedStatus({
                    ...selectedStatus,
                    domains: [...(selectedStatus.domains || []), domainKey],
                  });
                } else {
                  setSelectedStatus({
                    ...selectedStatus,
                    domains: selectedStatus.domains?.filter(
                      (domain) => domain !== domainKey
                    ),
                  });
                }
              }}
            />
            {domainValue}
          </label>
        ))}
        <button onClick={() => setSelectedStatus({
          roles: [selectedStatus.roles || []].flat(),
          isActive: false,
          domains: [...Object.keys(DOMAIN_MAP)],
          page: undefined,
          order: 0,
        })}>초기화</button>
        <button onClick={() => {
          onFilterChange(selectedStatus);
        }}>적용</button>
      </div>
      )}


      <div onClick={() => setIsLatestClicked(true)}>
        <p>최신순</p>
      </div>
      {isLatestClicked && (
        <div>
          <label>
            <input 
              type="radio"
              value="latest"
              checked={selectedStatus.order === 0}
              onChange={() => setSelectedStatus({ ...selectedStatus, order: 0 })}
            />
            공고등록순
          </label>
          <label>
            <input
              type="radio"
              value="oldest"
              checked={selectedStatus.order === 1}
              onChange={() => setSelectedStatus({ ...selectedStatus, order: 1 })}
            />
            마감임박순
          </label>
            <button onClick={() => setSelectedStatus({
            roles: [selectedStatus.roles || []].flat(),
            isActive: false,
            domains: [...Object.keys(DOMAIN_MAP)],
            page: undefined,
            order: 0,
          })}>초기화</button>
          <button onClick={() => {
            onFilterChange(selectedStatus);
          }}>적용</button>
        </div>
      )}
    </div>
  );
}
