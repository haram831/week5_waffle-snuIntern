import type { JobFilter } from "../@types/job.d.ts";
import FilterBar from "./Filter/FilterBar";
import PositionFilter from "./Filter/PositionFilter";

interface Props {
    onFilterChange: (newFilters: JobFilter) => void;
}

export default function Filter({ onFilterChange }: Props) {
    return(
        <div>
            <FilterBar onFilterChange={onFilterChange} />
            <PositionFilter />
        </div>
    )
}