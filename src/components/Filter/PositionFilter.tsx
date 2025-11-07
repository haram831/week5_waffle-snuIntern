import { useEffect, useState } from 'react';
import type { JobFilter, RoleMapType } from '../../@types/job';
import styles from './PositionFilter.module.css';

interface Props {
  Filters: JobFilter;
  ROLE_MAP: RoleMapType;
  onFilterChange: (newFilters: JobFilter) => void;
}

export default function PositionFilter({ Filters, ROLE_MAP, onFilterChange }: Props) {
  const [open, setOpen] = useState(true);
  const [roles, setRoles] = useState<string[]>(Filters.roles ?? []);

  useEffect(() => setRoles(Filters.roles ?? []), [Filters]);

  const toggleRole = (r: string) =>
    setRoles(prev => (prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]));

  const selectAllGroup = (keys: string[]) => setRoles(prev => Array.from(new Set([...prev, ...keys])));
  const clearGroup = (keys: string[]) => setRoles(prev => prev.filter(r => !keys.includes(r)));

  const apply = () => onFilterChange({ ...Filters, roles, page: 1 });

  return (
    <div className={styles.wrap}>
      <button className={styles.header} onClick={() => setOpen(o => !o)}>
        <span className={styles.headerTitle}>직군 필터</span>
        <span className={styles.chevron}>{open ? '▾' : '▸'}</span>
      </button>

      {open && (
        <div className={styles.body}>
          {Object.entries(ROLE_MAP).map(([groupKey, group]) => {
            const keys = Object.keys(group.roles);
            const allChecked = keys.every(k => roles.includes(k));
            return (
              <section key={groupKey} className={styles.section}>
                <h4 className={styles.sectionTitle}>{group.name}</h4>

                <label className={styles.allItem}>
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={e => (e.target.checked ? selectAllGroup(keys) : clearGroup(keys))}
                  />
                  전체
                </label>

                <div className={styles.roleGrid}>
                  {Object.entries(group.roles).map(([rk, label]) => (
                    <label key={rk} className={styles.roleItem}>
                      <input
                        type="checkbox"
                        checked={roles.includes(rk)}
                        onChange={() => toggleRole(rk)}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </section>
            );
          })}

          <div className={styles.footer}>
            <button className={styles.secondary} onClick={() => setRoles([])}>초기화</button>
            <button className={styles.primary} onClick={apply}>적용</button>
          </div>
        </div>
      )}
    </div>
  );
}
