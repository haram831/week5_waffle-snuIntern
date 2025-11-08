import { useEffect, useMemo, useState } from 'react';
import styles from './PositionFilter.module.css';
import type { JobFilter, RoleMapType } from '../../@types/job.d.ts';

type RoleSelection = Record<
  string,
  { name: string; roles: Record<string, boolean> }
>;

interface Props {
  Filters: JobFilter;
  ROLE_MAP: RoleMapType;
  onFilterChange: (newFilters: JobFilter) => void;
}

export default function PositionFilter({
  Filters,
  ROLE_MAP,
  onFilterChange,
}: Props) {
  const [open, setOpen] = useState(false);

  const initialSelected: RoleSelection = useMemo(() => {
    const selected = Filters.roles ?? [];
    return Object.fromEntries(
      Object.entries(ROLE_MAP).map(([ck, c]) => {
        const inner = Object.fromEntries(
          Object.keys(c.roles).map((rk) => [rk, selected.includes(rk)])
        ) as Record<string, boolean>;
        return [ck, { name: c.name, roles: inner }];
      })
    ) as RoleSelection;
  }, [Filters.roles, ROLE_MAP]);

  const [selectedRoles, setSelectedRoles] = useState<RoleSelection>(
    initialSelected
  );

  useEffect(() => setSelectedRoles(initialSelected), [initialSelected]);

  const totalCount = useMemo(() => {
    let cnt = 0;
    Object.values(selectedRoles).forEach((cat) => {
      cnt += Object.values(cat.roles).filter(Boolean).length;
    });
    return cnt;
  }, [selectedRoles]);

  const label = useMemo(
    () => (totalCount > 0 ? `직군 필터 · ${totalCount}` : '직군 필터'),
    [totalCount]
  );

  const toggleRole = (
    categoryKey: string,
    roleKey: string,
    checked: boolean
  ) => {
    setSelectedRoles((prev) => {
      const prevCategory = prev[categoryKey];
      return {
        ...prev,
        [categoryKey]: {
          ...prevCategory,
          roles: { ...prevCategory.roles, [roleKey]: checked },
        },
      };
    });
  };

  const toggleAllInCategory = (categoryKey: string, on: boolean) => {
    setSelectedRoles((prev) => {
      const prevCategory = prev[categoryKey];
      const updated = Object.fromEntries(
        Object.keys(prevCategory.roles).map((rk) => [rk, on])
      ) as Record<string, boolean>;
      return {
        ...prev,
        [categoryKey]: {
          ...prevCategory,
          roles: updated,
        },
      };
    });
  };

  const handleReset = () => {
    setSelectedRoles(initialSelected);
  };

  const handleApply = () => {
    const picked = new Set<string>();
    Object.values(selectedRoles).forEach((cat) => {
      Object.entries(cat.roles).forEach(([rk, on]) => {
        if (on) picked.add(rk);
      });
    });
    onFilterChange({
      ...Filters,
      roles: Array.from(picked),
      page: undefined,
    });
    setOpen(false);
  };

  return (
    <div className={styles.wrap}>
      <button
        id="btn-role"
        className={`${styles.mainBtn} ${open ? styles.active : ''}`}
        aria-expanded={open}
        aria-controls="panel-role"
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <span className={styles.caret} />
      </button>

      {open && (
        <div
          id="panel-role"
          className={styles.panel}
          role="dialog"
          aria-labelledby="btn-role"
        >
          <div className={styles.innerBox}>
            {Object.entries(ROLE_MAP).map(([categoryKey, category]) => {
              const allCount = Object.keys(category.roles).length;
              const onCount = Object.values(
                selectedRoles[categoryKey].roles
              ).filter(Boolean).length;
              const allOn = onCount === allCount && allCount > 0;

              return (
                <section className={styles.section} key={categoryKey}>
                  <div className={styles.sectionHeader}>
                    <h4 className={styles.heading}>{category.name}</h4>
                    <div className={styles.sectionActions}>
                      <button
                        type="button"
                        className={styles.smallGhost}
                        onClick={() => toggleAllInCategory(categoryKey, true)}
                      >
                        전체선택
                      </button>
                      <button
                        type="button"
                        className={styles.smallGhost}
                        onClick={() => toggleAllInCategory(categoryKey, false)}
                      >
                        전체해제
                      </button>
                    </div>
                  </div>

                  <label className={styles.item}>
                    <input
                      type="checkbox"
                      checked={allOn}
                      onChange={(e) =>
                        toggleAllInCategory(categoryKey, e.target.checked)
                      }
                    />
                    <span>전체</span>
                  </label>

                  <div className={styles.grid}>
                    {Object.entries(category.roles).map(
                      ([roleKey, roleLabel]) => (
                        <label className={styles.item} key={roleKey}>
                          <input
                            type="checkbox"
                            checked={
                              !!selectedRoles[categoryKey].roles[roleKey]
                            }
                            onChange={(e) =>
                              toggleRole(
                                categoryKey,
                                roleKey,
                                e.target.checked
                              )
                            }
                          />
                          <span>{roleLabel}</span>
                        </label>
                      )
                    )}
                  </div>
                </section>
              );
            })}
          </div>

          <div className={styles.footer}>
            <button className={styles.ghost} onClick={handleReset}>
              초기화
            </button>
            <button className={styles.primary} onClick={handleApply}>
              적용
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
