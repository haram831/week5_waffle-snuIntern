import { useEffect, useMemo, useState } from 'react';
import type { JobFilter } from '../../@types/job.d.ts';
import Dropdown from './Dropdown';
import styles from './FilterBar.module.css';

interface Props {
  Filters: JobFilter;
  DOMAIN_MAP: Record<string, string>;
  onFilterChange: (f: JobFilter) => void;
}

const ORDER_OPTIONS = [
  { value: 0, label: '공고등록순' },
  { value: 1, label: '마감임박순' },
] as const;

export default function FilterBar({
  Filters,
  DOMAIN_MAP,
  onFilterChange,
}: Props) {
  const [open, setOpen] = useState<null | 'status' | 'domain' | 'order'>(null);
  const [temp, setTemp] = useState<JobFilter>(Filters);

  useEffect(() => setTemp(Filters), [Filters]);

  const statusLabel = useMemo(() => {
    if (temp.isActive === undefined) return '모집상태 · 전체';
    return temp.isActive ? '모집상태 · 모집중' : '모집상태 · 전체';
  }, [temp.isActive]);

  const domainLabel = useMemo(() => {
    const allKeys = Object.keys(DOMAIN_MAP);
    const selected = temp.domains ?? [];
    if (selected.length === 0 || selected.length === allKeys.length)
      return '업종 · 전체';
    const shown = selected
      .slice(0, 2)
      .map((k) => DOMAIN_MAP[k] ?? k)
      .join(', ');
    const more = selected.length > 2 ? ` 외 ${selected.length - 2}` : '';
    return `업종 · ${shown}${more}`;
  }, [temp.domains, DOMAIN_MAP]);

  const orderLabel = useMemo(() => {
    const found = ORDER_OPTIONS.find((o) => o.value === (temp.order ?? 0));
    return `정렬 · ${found?.label ?? '공고등록순'}`;
  }, [temp.order]);

  const handleGlobalReset = () => {
    const resetState: JobFilter = {
      roles: [], // 직군필터도 초기화하게 추가
      isActive: undefined,
      domains: [],
      order: 0,
      page: 1,
    };
    setTemp(resetState);
    onFilterChange(resetState);
  };

  return (
    <div className={styles.bar}>
      <div className={styles.item}>
        <button
          id="btn-status"
          className={`${styles.filterButton} ${
            open === 'status' ? styles.active : ''
          }`}
          aria-expanded={open === 'status'}
          aria-controls="dd-status"
          onClick={() => setOpen(open === 'status' ? null : 'status')}
        >
          <span className={styles.label}>{statusLabel}</span>
          <span className={styles.caret} />
        </button>

        {open === 'status' && (
          <div className={styles.popAnchor} id="dd-status">
            <Dropdown
              open
              anchorId="btn-status"
              onClose={() => setOpen(null)}
              onReset={() =>
                setTemp((t) => ({ ...t, isActive: undefined, page: 1 }))
              }
              onApply={() => {
                onFilterChange(temp);
                setOpen(null);
              }}
              role="listbox"
            >
              <div
                className={styles.optionGroup}
                role="group"
                aria-label="모집상태"
              >
                <label className={styles.optionRow}>
                  <input
                    type="radio"
                    name="isActive"
                    checked={temp.isActive === undefined}
                    onChange={() =>
                      setTemp((t) => ({ ...t, isActive: undefined, page: 1 }))
                    }
                  />
                  <span>전체</span>
                </label>
                <label className={styles.optionRow}>
                  <input
                    type="radio"
                    name="isActive"
                    checked={temp.isActive === true}
                    onChange={() =>
                      setTemp((t) => ({ ...t, isActive: true, page: 1 }))
                    }
                  />
                  <span>모집중</span>
                </label>
              </div>
            </Dropdown>
          </div>
        )}
      </div>

      <div className={styles.item}>
        <button
          id="btn-domain"
          className={`${styles.filterButton} ${
            open === 'domain' ? styles.active : ''
          }`}
          aria-expanded={open === 'domain'}
          aria-controls="dd-domain"
          onClick={() => setOpen(open === 'domain' ? null : 'domain')}
        >
          <span className={styles.label}>{domainLabel}</span>
          <span className={styles.caret} />
        </button>

        {open === 'domain' && (
          <div className={styles.popAnchor} id="dd-domain">
            <Dropdown
              open
              anchorId="btn-domain"
              onClose={() => setOpen(null)}
              onReset={() => setTemp((t) => ({ ...t, domains: [], page: 1 }))}
              onApply={() => {
                onFilterChange(temp);
                setOpen(null);
              }}
              role="listbox"
            >
              <div
                className={styles.optionGroup}
                role="group"
                aria-label="업종"
              >
                <label className={styles.optionRow}>
                  <input
                    type="checkbox"
                    checked={
                      Object.keys(DOMAIN_MAP).every((k) =>
                        temp.domains?.includes(k)
                      ) && (temp.domains?.length ?? 0) > 0
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTemp((t) => ({
                          ...t,
                          domains: Object.keys(DOMAIN_MAP),
                          page: 1,
                        }));
                      } else {
                        setTemp((t) => ({ ...t, domains: [], page: 1 }));
                      }
                    }}
                  />
                  <span>전체</span>
                </label>

                {Object.entries(DOMAIN_MAP).map(([key, label]) => (
                  <label className={styles.optionRow} key={key}>
                    <input
                      type="checkbox"
                      checked={!!temp.domains?.includes(key)}
                      onChange={(e) => {
                        setTemp((t) => {
                          const cur = new Set(t.domains ?? []);
                          if (e.target.checked) cur.add(key);
                          else cur.delete(key);
                          return { ...t, domains: Array.from(cur), page: 1 };
                        });
                      }}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </Dropdown>
          </div>
        )}
      </div>

      <div className={styles.item}>
        <button
          id="btn-order"
          className={`${styles.filterButton} ${
            open === 'order' ? styles.active : ''
          }`}
          aria-expanded={open === 'order'}
          aria-controls="dd-order"
          onClick={() => setOpen(open === 'order' ? null : 'order')}
        >
          <span className={styles.label}>{orderLabel}</span>
          <span className={styles.caret} />
        </button>

        {open === 'order' && (
          <div className={styles.popAnchor} id="dd-order">
            <Dropdown
              open
              anchorId="btn-order"
              onClose={() => setOpen(null)}
              onReset={() => setTemp((t) => ({ ...t, order: 0, page: 1 }))}
              onApply={() => {
                onFilterChange(temp);
                setOpen(null);
              }}
              role="listbox"
            >
              <div
                className={styles.optionGroup}
                role="group"
                aria-label="정렬"
              >
                {ORDER_OPTIONS.map((opt) => (
                  <label className={styles.optionRow} key={opt.value}>
                    <input
                      type="radio"
                      name="order"
                      checked={(temp.order ?? 0) === opt.value}
                      onChange={() =>
                        setTemp((t) => ({ ...t, order: opt.value, page: 1 }))
                      }
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </Dropdown>
          </div>
        )}
      </div>

      <button
        type="button"
        className={styles.resetButton}
        onClick={handleGlobalReset}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.resetIcon}
        >
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
        초기화
      </button>
    </div>
  );
}
