import React, { useCallback, useState, useEffect } from "react";
import { Calendar, Filter, X, ChevronDown, ChevronUp, Clock, Building } from "lucide-react";
import { FilterOptions, DateRange, DateRangePresetType } from "../types/training";
import { useSearchParams } from "react-router-dom";
import { getServerDateRange } from "../utils/dataProcessing";

interface FilterControlsProps {
  filters: FilterOptions;
  departments: string[];
  onFiltersChange: (filters: FilterOptions) => void; // Keep for backward compatibility but won't be used
  onDateRangePreset?: (
    preset: DateRangePresetType
  ) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  departments,
  onDateRangePreset,
}) => {
  const [, setSearchParams] = useSearchParams();
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  const [pendingFilters, setPendingFilters] = useState<FilterOptions>(filters);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sync pending filters when filters prop changes (e.g., from URL navigation)
  useEffect(() => {
    setPendingFilters(filters);
  }, [filters]);

  // Update URL when filters change - this will trigger a re-render in Dashboard
  const updateURL = useCallback((newFilters: FilterOptions) => {
    const params = new URLSearchParams();

    if (newFilters.department && newFilters.department !== "All") {
      params.set("department", newFilters.department);
    }
    if (newFilters.dateRange.start) {
      params.set("startDate", newFilters.dateRange.start);
    }
    if (newFilters.dateRange.end) {
      params.set("endDate", newFilters.dateRange.end);
    }

    // Only update URL if there are actual filters
    if (params.toString()) {
      setSearchParams(params, { replace: true });
    } else {
      // Clear URL params if no filters
      setSearchParams({}, { replace: true });
    }
  }, [setSearchParams]);

  // Handle date range preset selection
  const handleDateRangePreset = useCallback((preset: DateRangePresetType) => {
    const newRange = getServerDateRange(preset);
    const newFilters = {
      ...pendingFilters,
      dateRange: newRange
    };
    setPendingFilters(newFilters);
    updateURL(newFilters);
    setShowCustomDateRange(false); // Hide custom range when preset is selected
  }, [pendingFilters, updateURL]);

  const handleDateChange = useCallback((field: keyof DateRange, value: string) => {
    let newStartDate = pendingFilters.dateRange.start;
    let newEndDate = pendingFilters.dateRange.end;

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

    setPendingFilters(prev => ({
      ...prev,
      dateRange: {
        start: newStartDate,
        end: newEndDate
      }
    }));
  }, [pendingFilters]);

  const handleDepartmentChange = useCallback(
    (department: string) => {
      setPendingFilters(prev => ({
        ...prev,
        department,
      }));
    },
    []
  );

  const handleApplyFilters = useCallback(() => {
    updateURL(pendingFilters);
  }, [pendingFilters, updateURL]);

  const handleClearFilters = useCallback(() => {
    const newFilters = {
      dateRange: { start: "", end: "" },
      department: "All",
    };
    setPendingFilters(newFilters);
    updateURL(newFilters);
    setShowCustomDateRange(false);
  }, [updateURL]);

  const toggleCustomDateRange = useCallback(() => {
    setShowCustomDateRange(prev => !prev);
  }, []);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  // Check if there are pending changes
  const hasPendingChanges = 
    pendingFilters.department !== filters.department ||
    pendingFilters.dateRange.start !== filters.dateRange.start ||
    pendingFilters.dateRange.end !== filters.dateRange.end;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-300">
      {/* Header with Status and Collapse Button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <Filter className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="flex items-center gap-3">
          {hasPendingChanges && (
            <span className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 animate-pulse">
              ⚡ Changes Pending
            </span>
          )}
          <button
            onClick={toggleCollapse}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title={isCollapsed ? "Expand Filters" : "Collapse Filters"}
          >
            {isCollapsed ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronUp className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
          {/* Quick Date Presets - Attractive Grid */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="text-base font-medium text-gray-700">Quick Select</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { key: "7days" as const, label: "Last 7 Days", shortLabel: "7D" },
                { key: "30days" as const, label: "Last 30 Days", shortLabel: "30D" },
                { key: "90days" as const, label: "Last 90 Days", shortLabel: "90D" },
                { key: "12months" as const, label: "Last 12 Months", shortLabel: "12M" },
              ].map(({ key, label, shortLabel }) => (
                <button
                  key={key}
                  onClick={() => handleDateRangePreset(key)}
                  className="px-4 py-2.5 text-sm font-medium bg-gray-50 text-gray-700 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:scale-105 hover:shadow-sm"
                >
                  <div className="text-center">
                    {/* <div className="font-semibold text-lg">{shortLabel}</div> */}
                    <div className="text-xs font-semibold mt-1">{label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Department Filter - Spacious */}
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-3 mb-2">
              <Building className="h-5 w-5 text-blue-500" />
              <span className="text-base font-medium text-gray-700">Department</span>
            </div>
            <select
              value={pendingFilters.department}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              className="w-full px-4 py-2.5 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-gray-300 transition-colors shadow-sm"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Date Range - Attractive Toggle */}
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span className="text-base font-medium text-gray-700">Custom Date Range</span>
              </div>
              <button
                onClick={toggleCustomDateRange}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:scale-105"
              >
                {showCustomDateRange ? 'Hide Range' : 'Show Range'}
                {showCustomDateRange ? (
                  <ChevronUp className="inline h-4 w-4 ml-2" />
                ) : (
                  <ChevronDown className="inline h-4 w-4 ml-2" />
                )}
              </button>
            </div>

            {/* Custom Date Range Inputs - Spacious */}
            {showCustomDateRange && (
              <div className="bg-white rounded-xl p-3 border border-gray-200 mt-2 animate-in slide-in-from-top-2 duration-300">
                {/* <h4 className="text-sm font-medium text-gray-700 mb-3 text-center">Select Date Range</h4> */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">From Date</label>
                    <input
                      type="date"
                      value={pendingFilters.dateRange.start}
                      onChange={(e) => handleDateChange('start', e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">To Date</label>
                    <input
                      type="date"
                      value={pendingFilters.dateRange.end}
                      onChange={(e) => handleDateChange('end', e.target.value)}
                      min={pendingFilters.dateRange.start || undefined}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-colors shadow-sm"
                      disabled={!pendingFilters.dateRange.start}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons - Attractive */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 hover:scale-105 hover:shadow-sm"
            >
              <X className="h-4 w-4" />
              Clear All Filters
            </button>
            
            <button
              onClick={handleApplyFilters}
              disabled={!hasPendingChanges}
              className={`flex items-center gap-2 px-5 py-2.5 text-base font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                hasPendingChanges
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:scale-105 hover:shadow-xl'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
