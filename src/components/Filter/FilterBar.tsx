import { useEffect, useState } from 'react';
import type { JobFilter } from '../../@types/job';
import styles from './FilterBar.module.css';

interface Props {
  Filters: JobFilter;
  DOMAIN_MAP: { [key: string]: string };
  onFilterChange: (newFilters: JobFilter) => void;
}

export default function FilterBar({ Filters, DOMAIN_MAP, onFilterChange }: Props) {
  const [selectedStatus, setSelectedStatus] = useState<JobFilter>(Filters);
  const [isActiveClicked, setIsActiveClicked] = useState(false);
  const [isDomainClicked, setIsDomainClicked] = useState(false);
  const [isLatestClicked, setIsLatestClicked] = useState(false);

  useEffect(() => {
    setSelectedStatus(Filters);
  }, [Filters]);

  return (
    <div className={styles.container}>
      <div className={styles.leftGroup} onClick={() => setIsActiveClicked(!isActiveClicked)}>
        <p className={styles.sectionTitle}>모집 상태</p>
      </div>

      {isActiveClicked && (
        <div className={styles.filterGroup}>
          <label className={styles.filterButton}>
            <input
              type="radio"
              checked={selectedStatus.isActive === undefined}
              onChange={() => setSelectedStatus({ ...selectedStatus, isActive: undefined })}
            />
            전체
          </label>
          <label className={styles.filterButton}>
            <input
              type="radio"
              checked={selectedStatus.isActive === true}
              onChange={() => setSelectedStatus({ ...selectedStatus, isActive: true })}
            />
            모집중
          </label>
          <div className={styles.footer}>
            <button
              className={styles.resetButton}
              onClick={() => setSelectedStatus({ ...selectedStatus, isActive: undefined })}
            >
              초기화
            </button>
            <button className={styles.applyButton} onClick={() => onFilterChange(selectedStatus)}>
              적용
            </button>
          </div>
        </div>
      )}

      <div className={styles.leftGroup} onClick={() => setIsDomainClicked(!isDomainClicked)}>
        <p className={styles.sectionTitle}>업종</p>
      </div>

      {isDomainClicked && (
        <div className={styles.chipGroup}>
          {Object.entries(DOMAIN_MAP).map(([domainKey, domainValue]) => (
            <label key={domainKey} className={styles.filterButton}>
              <input
                type="checkbox"
                checked={selectedStatus.domains?.includes(domainKey)}
                onChange={(e) => {
                  const nextDomains = e.target.checked
                    ? [...(selectedStatus.domains || []), domainKey]
                    : selectedStatus.domains?.filter((d) => d !== domainKey);
                  setSelectedStatus({ ...selectedStatus, domains: nextDomains });
                }}
              />
              {domainValue}
            </label>
          ))}
          <div className={styles.footer}>
            <button
              className={styles.resetButton}
              onClick={() => setSelectedStatus({ ...selectedStatus, domains: [] })}
            >
              초기화
            </button>
            <button className={styles.applyButton} onClick={() => onFilterChange(selectedStatus)}>
              적용
            </button>
          </div>
        </div>
      )}

      <div className={styles.leftGroup} onClick={() => setIsLatestClicked(!isLatestClicked)}>
        <p className={styles.sectionTitle}>정렬</p>
      </div>

      {isLatestClicked && (
        <div className={styles.filterGroup}>
          <label className={styles.filterButton}>
            <input
              type="radio"
              checked={selectedStatus.order === 0}
              onChange={() => setSelectedStatus({ ...selectedStatus, order: 0 })}
            />
            공고등록순
          </label>
          <label className={styles.filterButton}>
            <input
              type="radio"
              checked={selectedStatus.order === 1}
              onChange={() => setSelectedStatus({ ...selectedStatus, order: 1 })}
            />
            마감임박순
          </label>
          <div className={styles.footer}>
            <button
              className={styles.resetButton}
              onClick={() => setSelectedStatus({ ...selectedStatus, order: 0 })}
            >
              초기화
            </button>
            <button className={styles.applyButton} onClick={() => onFilterChange(selectedStatus)}>
              적용
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
