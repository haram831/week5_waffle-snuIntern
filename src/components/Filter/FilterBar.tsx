import { useEffect, useState } from 'react';
import type { JobFilter } from '../../@types/job';
import styles from './FilterBar.module.css';

interface Props {
  Filters: JobFilter;
  DOMAIN_MAP: { [key: string]: string };
  onFilterChange: (newFilters: JobFilter) => void;
}

export default function FilterBar({ Filters, DOMAIN_MAP, onFilterChange }: Props) {
  const [selected, setSelected] = useState<JobFilter>(Filters);

  const setIsActive = (v: boolean | undefined) =>
    setSelected(prev => ({ ...prev, isActive: v }));

  const setOrder = (v: 0 | 1) =>
    setSelected(prev => ({ ...prev, order: v }));

  const toggleDomain = (key: string) =>
    setSelected(prev => {
      const domains = new Set(prev.domains ?? []);
      domains.has(key) ? domains.delete(key) : domains.add(key);
      return { ...prev, domains: Array.from(domains) };
    });

  const reset = () => setSelected({});

  const apply = () => onFilterChange(selected);

  return (
    <div className={styles.container}>
      <div className={styles.leftGroup}>
        <span className={styles.sectionTitle}>모집 상태</span>
        <button
          className={`${styles.filterButton} ${selected.isActive ? '' : styles.active}`}
          onClick={() => setIsActive(undefined)}
        >
          전체
        </button>
        <button
          className={`${styles.filterButton} ${selected.isActive ? styles.active : ''}`}
          onClick={() => setIsActive(true)}
        >
          모집중
        </button>
      </div>

      <div className={styles.leftGroup}>
        <span className={styles.sectionTitle}>업종</span>
        <div className={styles.chipGroup}>
          {Object.entries(DOMAIN_MAP).map(([key, label]) => (
            <button
              key={key}
              className={`${styles.filterButton} ${(selected.domains ?? []).includes(key) ? styles.active : ''}`}
              onClick={() => toggleDomain(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.leftGroup}>
        <span className={styles.sectionTitle}>정렬</span>
        <button
          className={`${styles.filterButton} ${selected.order !== 1 ? styles.active : ''}`}
          onClick={() => setOrder(0)}
        >
          공고등록순
        </button>
        <button
          className={`${styles.filterButton} ${selected.order === 1 ? styles.active : ''}`}
          onClick={() => setOrder(1)}
        >
          마감임박순
        </button>
      </div>

      <div className={styles.footer}>
        <button className={styles.resetButton} onClick={reset}>초기화</button>
        <button className={styles.applyButton} onClick={apply}>적용</button>
      </div>
    </div>
  );
}
