import React, { useEffect, useCallback } from "react";
import { Calendar, Filter, X } from "lucide-react";
import { FilterOptions, DateRange, DateRangePresetType } from "../types/training";
import { useSearchParams } from "react-router-dom";

interface FilterControlsProps {
  filters: FilterOptions;
  departments: string[];
  onFiltersChange: (filters: FilterOptions) => void;
  onDateRangePreset: (
    preset: DateRangePresetType
  ) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  departments,
  onFiltersChange,
  onDateRangePreset,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Sync filters with URL on component mount
  useEffect(() => {
    const urlDepartment = searchParams.get("department");
    const urlStartDate = searchParams.get("startDate");
    const urlEndDate = searchParams.get("endDate");

    if (urlDepartment || urlStartDate || urlEndDate) {
      const newFilters = {
        dateRange: {
          start: urlStartDate || "",
          end: urlEndDate || "",
        },
        department: urlDepartment || "All",
      };
      onFiltersChange(newFilters);
    }
  }, [searchParams, onFiltersChange]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.department && filters.department !== "All") {
      params.set("department", filters.department);
    }
    if (filters.dateRange.start) {
      params.set("startDate", filters.dateRange.start);
    }
    if (filters.dateRange.end) {
      params.set("endDate", filters.dateRange.end);
    }

    // Only update URL if there are actual filters
    if (params.toString()) {
      setSearchParams(params, { replace: true });
    } else {
      // Clear URL params if no filters
      setSearchParams({}, { replace: true });
    }
  }, [filters, setSearchParams]);

  const handleDateChange = useCallback((field: keyof DateRange, value: string) => {
    let newStartDate = filters.dateRange.start;
    let newEndDate = filters.dateRange.end;

    if (field === 'start') {
      newStartDate = value;
      // If start date is after end date, reset end date
      if (value && newEndDate && value > newEndDate) {
        newEndDate = '';
      }
    } else if (field === 'end') {
      newEndDate = value;
      // If end date is before start date, reset start date
      if (value && newStartDate && value < newStartDate) {
        newStartDate = '';
      }
    }

    onFiltersChange({
      ...filters,
      dateRange: {
        start: newStartDate,
        end: newEndDate
      }
    });
  }, [filters, onFiltersChange]);

  const handleDepartmentChange = useCallback(
    (department: string) => {
      onFiltersChange({
        ...filters,
        department,
      });
    },
    [filters, onFiltersChange]
  );

  const handleClearFilters = useCallback(() => {
    onFiltersChange({
      dateRange: { start: "", end: "" },
      department: "All",
    });
    // Clear URL params
    setSearchParams({}, { replace: true });
  }, [onFiltersChange, setSearchParams]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Range Presets */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Select
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: "7days" as const, label: "Last 7 Days" },
              { key: "30days" as const, label: "Last 30 Days" },
              { key: "90days" as const, label: "Last 90 Days" },
              { key: "12months" as const, label: "Last 12 Months" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => onDateRangePreset(key)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            From Date
          </label>
          <input
            type="date"
            value={filters.dateRange.start}
            onChange={(e) => handleDateChange('start', e.target.value)}
            max={new Date().toISOString().split('T')[0]} // Prevent future dates
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Select a date from today or earlier</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            To Date
          </label>
          <input
            type="date"
            value={filters.dateRange.end}
            onChange={(e) => handleDateChange('end', e.target.value)}
            min={filters.dateRange.start || undefined} // Must be after or equal to start date
            max={new Date().toISOString().split('T')[0]} // Prevent future dates
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!filters.dateRange.start} // Disable until start date is selected
          />
          <p className="text-xs text-gray-500 mt-1">
            {filters.dateRange.start 
              ? `Select a date from ${filters.dateRange.start} to today`
              : 'Select a start date first'
            }
          </p>
        </div>

        {/* Department Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <select
            value={filters.department}
            onChange={(e) => handleDepartmentChange(e.target.value)}
            className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-end">
        {/* Clear Filters Button - Positioned on the right */}
        <button
          onClick={handleClearFilters}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};
