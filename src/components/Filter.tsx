import type { JobFilter, RoleMapType } from '../@types/job.d.ts';
import FilterBar from './Filter/FilterBar';
import PositionFilter from './Filter/PositionFilter';

interface Props {
  Filters: JobFilter;
  ROLE_MAP: RoleMapType;
  DOMAIN_MAP: { [key: string]: string };
  onFilterChange: (newFilters: JobFilter) => void;
}

export default function Filter({ Filters, ROLE_MAP, DOMAIN_MAP, onFilterChange }: Props) {
  return (
    <div>
      <FilterBar Filters={Filters} DOMAIN_MAP={DOMAIN_MAP} onFilterChange={onFilterChange} />
      <PositionFilter Filters={Filters} ROLE_MAP={ROLE_MAP} onFilterChange={onFilterChange} />
    </div>
  );
}
