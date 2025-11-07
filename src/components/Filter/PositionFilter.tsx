import { useState } from 'react';
import type { JobFilter, RoleMapType } from '../../@types/job';
import styles from './PositionFilter.module.css';

interface Props {
  Filters: JobFilter;
  ROLE_MAP: RoleMapType;
  onFilterChange: (newFilters: JobFilter) => void;
}

export default function PositionFilter({ Filters, ROLE_MAP, onFilterChange }: Props) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(Filters.roles ?? []);

  const toggleRole = (role: string) =>
    setSelectedRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);

  const reset = () => setSelectedRoles([]);
  const apply = () => onFilterChange({ ...Filters, roles: selectedRoles });

  return (
    <div className={styles.wrapper}>
      {Object.entries(ROLE_MAP).map(([groupKey, group]) => (
        <section key={groupKey} className={styles.section}>
          <div className={styles.sectionHeader}>
            <h4 className={styles.sectionTitle}>{group.name}</h4>
          </div>

          <div className={styles.roleGrid}>
            {Object.entries(group.roles).map(([roleKey, label]) => {
              const active = selectedRoles.includes(roleKey);
              return (
                <button
                  key={roleKey}
                  className={`${styles.roleButton} ${active ? styles.active : ''}`}
                  onClick={() => toggleRole(roleKey)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>
      ))}

      <div className={styles.footer}>
        <button className={styles.resetButton} onClick={reset}>초기화</button>
        <button className={styles.applyButton} onClick={apply}>적용</button>
      </div>
    </div>
  );
}
