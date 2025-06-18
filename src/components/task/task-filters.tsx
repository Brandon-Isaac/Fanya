import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type FilterStatus = "all" | "pending" | "completed";

interface TaskFiltersProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
}

export function TaskFilters({ currentFilter, onFilterChange }: TaskFiltersProps) {
  return (
    <RadioGroup
      value={currentFilter}
      onValueChange={(value) => onFilterChange(value as FilterStatus)}
      className="flex items-center space-x-2 sm:space-x-4"
      aria-label="Filter tasks by status"
    >
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        <RadioGroupItem value="all" id="filter-all" />
        <Label htmlFor="filter-all" className="cursor-pointer text-sm sm:text-base">All</Label>
      </div>
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        <RadioGroupItem value="pending" id="filter-pending" />
        <Label htmlFor="filter-pending" className="cursor-pointer text-sm sm:text-base">Pending</Label>
      </div>
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        <RadioGroupItem value="completed" id="filter-completed" />
        <Label htmlFor="filter-completed" className="cursor-pointer text-sm sm:text-base">Completed</Label>
      </div>
    </RadioGroup>
  );
}
