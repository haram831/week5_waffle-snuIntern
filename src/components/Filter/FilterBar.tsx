import { useEffect, useRef, useState } from 'react';
import type { JobFilter } from '../../@types/job';
import styles from './FilterBar.module.css';

interface Props {
  Filters: JobFilter;
  DOMAIN_MAP: { [key: string]: string };
  onFilterChange: (newFilters: JobFilter) => void;
}

type Menu = null | 'status' | 'domain' | 'order';

export default function FilterBar({ Filters, DOMAIN_MAP, onFilterChange }: Props) {
  const [draft, setDraft] = useState<JobFilter>(Filters || {});
  const [menu, setMenu] = useState<Menu>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => setDraft(Filters || {}), [Filters]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setMenu(null);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const toggleDomain = (k: string) =>
    setDraft(prev => {
      const s = new Set(prev.domains ?? []);
      s.has(k) ? s.delete(k) : s.add(k);
      return { ...prev, domains: Array.from(s) };
    });

  const apply = () => {
    onFilterChange({ ...draft, page: 1 });
    setMenu(null);
  };

  const resetAll = () => {
    const base: JobFilter = {};
    onFilterChange(base);
    setDraft(base);
    setMenu(null);
  };

  return (
    <div className={styles.wrap} ref={rootRef}>
      <div className={styles.headerRow}>
        <div className={styles.headerBox}>
          <span className={styles.headerTitle}>직군 필터</span>
          <span className={styles.headerChevron}>▾</span>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.triggerGroup}>
          <div className={styles.triggerWrap}>
            <button
              className={styles.trigger}
              data-active={draft.isActive !== undefined}
              onClick={() => setMenu(m => (m === 'status' ? null : 'status'))}
            >
              모집상태 ▾
            </button>
            {menu === 'status' && (
              <div className={styles.menu}>
                <button
                  className={styles.menuItem}
                  data-selected={draft.isActive === undefined}
                  onClick={() => setDraft(prev => ({ ...prev, isActive: undefined }))}
                >
                  전체
                </button>
                <button
                  className={styles.menuItem}
                  data-selected={draft.isActive === true}
                  onClick={() => setDraft(prev => ({ ...prev, isActive: true }))}
                >
                  모집중
                </button>
                <div className={styles.menuFooter}>
                  <button className={styles.secondary} onClick={() => setDraft(prev => ({ ...prev, isActive: undefined }))}>초기화</button>
                  <button className={styles.primary} onClick={apply}>적용</button>
                </div>
              </div>
            )}
          </div>

          <div className={styles.triggerWrap}>
            <button
              className={styles.trigger}
              data-active={(draft.domains?.length ?? 0) > 0}
              onClick={() => setMenu(m => (m === 'domain' ? null : 'domain'))}
            >
              업종 ▾
            </button>
            {menu === 'domain' && (
              <div className={styles.menuWide}>
                <label className={styles.checkItem}>
                  <input
                    type="checkbox"
                    checked={Object.keys(DOMAIN_MAP).every(k => draft.domains?.includes(k))}
                    onChange={e =>
                      setDraft(prev => ({
                        ...prev,
                        domains: e.target.checked ? Object.keys(DOMAIN_MAP) : []
                      }))
                    }
                  />
                  전체
                </label>
                <div className={styles.grid}>
                  {Object.entries(DOMAIN_MAP).map(([k, v]) => (
                    <label key={k} className={styles.checkItem}>
                      <input
                        type="checkbox"
                        checked={!!draft.domains?.includes(k)}
                        onChange={() => toggleDomain(k)}
                      />
                      {v}
                    </label>
                  ))}
                </div>
                <div className={styles.menuFooter}>
                  <button className={styles.secondary} onClick={() => setDraft(prev => ({ ...prev, domains: [] }))}>초기화</button>
                  <button className={styles.primary} onClick={apply}>적용</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.triggerGroup}>
          <div className={styles.triggerWrap}>
            <button
              className={styles.trigger}
              data-active={draft.order === 1}
              onClick={() => setMenu(m => (m === 'order' ? null : 'order'))}
            >
              최신순 ▾
            </button>
            {menu === 'order' && (
              <div className={styles.menu}>
                <button
                  className={styles.menuItem}
                  data-selected={draft.order !== 1}
                  onClick={() => setDraft(prev => ({ ...prev, order: 0 }))}
                >
                  공고등록순
                </button>
                <button
                  className={styles.menuItem}
                  data-selected={draft.order === 1}
                  onClick={() => setDraft(prev => ({ ...prev, order: 1 }))}
                >
                  마감임박순
                </button>
                <div className={styles.menuFooter}>
                  <button className={styles.secondary} onClick={() => setDraft(prev => ({ ...prev, order: 0 }))}>초기화</button>
                  <button className={styles.primary} onClick={apply}>적용</button>
                </div>
              </div>
            )}
          </div>

          <button className={styles.resetInline} onClick={resetAll}>⟳ 초기화</button>
        </div>
      </div>
    </div>
  );
}
