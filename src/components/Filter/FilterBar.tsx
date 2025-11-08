import { useEffect, useMemo, useState } from 'react';
import styles from './FilterBar.module.css';
import Dropdown from './Dropdown';
import type { JobFilter } from '../../@types/job.d.ts';

interface Props {
  Filters: JobFilter;
  DOMAIN_MAP: { [key: string]: string };
  onFilterChange: (newFilters: JobFilter) => void;
}

const ORDER_OPTIONS = [
  { value: 0, label: '공고등록순' },
  { value: 1, label: '마감임박순' },
] as const;

export default function FilterBar({ Filters, DOMAIN_MAP, onFilterChange }: Props) {
  const [open, setOpen] = useState<null | 'status' | 'domain' | 'order'>(null);
  const [temp, setTemp] = useState<JobFilter>(Filters);

  useEffect(() => setTemp(Filters), [Filters]);

  const closeAll = () => setOpen(null);

  const statusLabel = useMemo(() => {
    if (temp.isActive === undefined) return '모집상태 · 전체';
    return temp.isActive ? '모집상태 · 모집중' : '모집상태 · 전체';
  }, [temp.isActive]);

  const domainLabel = useMemo(() => {
    const allKeys = Object.keys(DOMAIN_MAP);
    const selected = temp.domains ?? [];
    if (selected.length === 0 || selected.length === allKeys.length) return '업종 · 전체';
    const shown = selected.slice(0, 2).map((k) => DOMAIN_MAP[k] ?? k).join(', ');
    const more = selected.length > 2 ? ` 외 ${selected.length - 2}` : '';
    return `업종 · ${shown}${more}`;
  }, [temp.domains, DOMAIN_MAP]);

  const orderLabel = useMemo(() => {
    const found = ORDER_OPTIONS.find((o) => o.value === (temp.order ?? 0));
    return `정렬 · ${found?.label ?? '공고등록순'}`;
  }, [temp.order]);

  const applyAll = () => {
    onFilterChange({
      ...Filters,
      isActive: temp.isActive,
      domains: temp.domains,
      order: temp.order ?? 0,
      page: undefined,
    });
    closeAll();
  };

  const resetAll = () => {
    setTemp({
      ...Filters,
      isActive: undefined,
      domains: [],
      order: 0,
      page: undefined,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftGroup}>
        <div className={styles.item}>
          <button
            id="btn-status"
            className={`${styles.filterButton} ${open === 'status' ? styles.active : ''}`}
            aria-expanded={open === 'status'}
            aria-controls="dd-status"
            onClick={() => setOpen(open === 'status' ? null : 'status')}
          >
            {statusLabel}
            <span className={styles.caret} />
          </button>

          {open === 'status' && (
            <div className={styles.popAnchor} id="dd-status">
              <Dropdown
                open
                anchorId="btn-status"
                onClose={closeAll}
                onReset={() => setTemp((t) => ({ ...t, isActive: undefined }))}
                onApply={applyAll}
                width={300}
                role="listbox"
              >
                <div className={styles.optionGroup} role="group" aria-label="모집상태">
                  <label className={styles.optionRow}>
                    <input
                      type="radio"
                      name="isActive"
                      checked={temp.isActive === undefined}
                      onChange={() => setTemp((t) => ({ ...t, isActive: undefined }))}
                    />
                    <span>전체</span>
                  </label>
                  <label className={styles.optionRow}>
                    <input
                      type="radio"
                      name="isActive"
                      checked={temp.isActive === true}
                      onChange={() => setTemp((t) => ({ ...t, isActive: true }))}
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
            className={`${styles.filterButton} ${open === 'domain' ? styles.active : ''}`}
            aria-expanded={open === 'domain'}
            aria-controls="dd-domain"
            onClick={() => setOpen(open === 'domain' ? null : 'domain')}
          >
            {domainLabel}
            <span className={styles.caret} />
          </button>

          {open === 'domain' && (
            <div className={styles.popAnchor} id="dd-domain">
              <Dropdown
                open
                anchorId="btn-domain"
                onClose={closeAll}
                onReset={() => setTemp((t) => ({ ...t, domains: [] }))}
                onApply={applyAll}
                width={360}
                role="listbox"
              >
                <div className={styles.optionGroup} role="group" aria-label="업종">
                  <label className={styles.optionRow}>
                    <input
                      type="checkbox"
                      checked={
                        Object.keys(DOMAIN_MAP).every((k) => temp.domains?.includes(k)) &&
                        (temp.domains?.length ?? 0) > 0
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setTemp((t) => ({ ...t, domains: Object.keys(DOMAIN_MAP) }));
                        } else {
                          setTemp((t) => ({ ...t, domains: [] }));
                        }
                      }}
                    />
                    <span>전체</span>
                  </label>

                  {Object.entries(DOMAIN_MAP).map(([key, label]) => {
                    const checked = !!temp.domains?.includes(key);
                    return (
                      <label className={styles.optionRow} key={key}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            setTemp((t) => {
                              const base = new Set(t.domains ?? []);
                              if (e.target.checked) base.add(key);
                              else base.delete(key);
                              return { ...t, domains: Array.from(base) };
                            });
                          }}
                        />
                        <span>{label}</span>
                      </label>
                    );
                  })}
                </div>
              </Dropdown>
            </div>
          )}
        </div>

        <div className={styles.item}>
          <button
            id="btn-order"
            className={`${styles.filterButton} ${open === 'order' ? styles.active : ''}`}
            aria-expanded={open === 'order'}
            aria-controls="dd-order"
            onClick={() => setOpen(open === 'order' ? null : 'order')}
          >
            {orderLabel}
            <span className={styles.caret} />
          </button>

          {open === 'order' && (
            <div className={styles.popAnchor} id="dd-order">
              <Dropdown
                open
                anchorId="btn-order"
                onClose={closeAll}
                onReset={() => setTemp((t) => ({ ...t, order: 0 }))}
                onApply={applyAll}
                width={260}
                role="listbox"
              >
                <div className={styles.optionGroup} role="group" aria-label="정렬">
                  {ORDER_OPTIONS.map((opt) => (
                    <label className={styles.optionRow} key={opt.value}>
                      <input
                        type="radio"
                        name="order"
                        checked={(temp.order ?? 0) === opt.value}
                        onChange={() => setTemp((t) => ({ ...t, order: opt.value }))}
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </Dropdown>
            </div>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.resetButton} onClick={resetAll}>
          전체 초기화
        </button>
        <button className={styles.applyButton} onClick={applyAll}>
          적용
        </button>
      </div>
    </div>
  );
}
