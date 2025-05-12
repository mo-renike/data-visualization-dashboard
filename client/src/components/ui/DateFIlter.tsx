import { useState } from "react";
import { TimeFilter } from "../../types";

interface DateFilterProps {
  onFilterChange?: (filter: TimeFilter) => void;
  defaultSelected?: TimeFilter;
}

export default function DateFilter({
  onFilterChange,
  defaultSelected = "This Year",
}: DateFilterProps) {
  const [selected, setSelected] = useState<TimeFilter>(defaultSelected);

  const options: TimeFilter[] = [
    "This Month",
    "Last Month",
    "This Year",
    "Last Year",
  ];

  const handleSelect = (option: TimeFilter) => {
    setSelected(option);
    if (onFilterChange) {
      onFilterChange(option);
    }
  };

  return (
    <div className="rounded-xl border border-gray-300 bg-white shadow-lg overflow-hidden w-48">
      <div className="flex flex-col">
        {options.map((option) => (
          <button
            key={option}
            className={`py-3 px-6 text-left hover:bg-gray-50 ${
              selected === option
                ? "text-blue-600 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => handleSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
