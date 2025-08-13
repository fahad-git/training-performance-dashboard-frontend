import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterControls } from './FilterControls';
import { StatsCards } from './StatsCards';
import { PerformanceTrendChart } from './PerformanceTrendChart';
import { SkillsComparisonChart } from './SkillsComparisonChart';
import { PassRateChart } from './PassRateChart';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorBoundary } from './ErrorBoundary';
import { DateRangePresetType, FilterOptions } from '../types/training';
import { 
  processServerPerformanceTrends,
  getServerDateRange,
  processServerPassRateData
} from '../utils/dataProcessing';
import { useEnhancedQuery } from '../hooks/useApi';
import { insightsApi } from '../api/insightsApi';
import { formatApiError } from '../utils/apiUtils';

interface DashboardProps {
  isLoading: boolean;
}

export const Dashboard = ({ isLoading }: DashboardProps) => {
  const [searchParams] = useSearchParams();
  
  // Initialize filters from URL params
  const getInitialFilters = useCallback((): FilterOptions => {
    const urlDepartment = searchParams.get('department');
    const urlStartDate = searchParams.get('startDate');
    const urlEndDate = searchParams.get('endDate');
    console.log("getInitialFilters");
    return {
      dateRange: {
        start: urlStartDate || '',
        end: urlEndDate || ''
      },
      department: urlDepartment || 'All'
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<FilterOptions>(getInitialFilters);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<string[]>(['All']);
  const [loadingAnimation, setLoadingAnimation] = useState<boolean>(true);

  //added delay just to show loading animation otherwise it is too fast
  useEffect(() => {
    setTimeout(() => {
      setLoadingAnimation(false);
    }, 3000);
  }, []);

  // Update filters when URL params change (e.g., browser back/forward)
  useEffect(() => {
    const newFilters = getInitialFilters();
    setFilters(newFilters);
  }, [getInitialFilters]);

  // Fetch server training data with enhancedQuery
  const {
    data: serverData,
    error: serverError,
    isLoading: serverLoading,
    refetch: refetchServerData,
  } = useEnhancedQuery({
    queryKey: ['serverTrainingData', filters],
    queryFn: () => insightsApi.getServerTrainingData({
      department: filters.department !== 'All' ? filters.department : undefined,
      startDate: filters.dateRange.start || undefined,
      endDate: filters.dateRange.end || undefined,
    }),
    enabled: !isLoading, // only fetch when not loading
    onSuccess: () => {
      // we can set server data in the redux store or context API here if we have larger app
      setError(null);
    },
    onError: (error) => {
      const errorMessage = formatApiError(error);
      setError(`Failed to fetch training data: ${errorMessage}`);
    },
  });

  // Update departments when server data changes, maintaining union with existing departments
  useEffect(() => {
    if (serverData) {
      const serverDepartments = serverData.averageScoresByDepartment.map(d => d.department);
      
      // Union of existing departments with new server departments
      setDepartments(prevDepartments => {
        const existingDepartments = prevDepartments.filter(dept => dept !== 'All');
        const allDepartments = [...new Set([...existingDepartments, ...serverDepartments])];
        return ['All', ...allDepartments.sort()];
      });
    }
  }, [serverData]);

  const performanceTrendData = useMemo(() => {
    if (!serverData) return [];
    return processServerPerformanceTrends(serverData);
  }, [serverData, filters]);


  const passRateData = useMemo(() => {
    if (!serverData) return null;
    return processServerPassRateData(serverData);
  }, [serverData, filters]);

  // Event handlers
  const handleDateRangePreset = useCallback((preset: DateRangePresetType) => {
    if (!serverData) return;
    const newRange = getServerDateRange(preset);
    setFilters(prev => ({
      ...prev,
      dateRange: newRange
    }));
  }, [serverData]);

  const handleRetry = useCallback(() => {
    setError(null);
    refetchServerData();
  }, [refetchServerData]);

  // Early returns for loading and error states
  if (isLoading || serverLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner 
          size="xl" 
          message="Loading training dashboard..." 
        />
      </div>
    );
  }

  if (serverError && error) {
    return <ErrorBoundary 
      error={error} 
      onRetry={handleRetry} 
      title="Failed to Load Dashboard"
    />;
  }

  if (!serverData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No training data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Training Performance Dashboard
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Monitor and analyze gamified training simulation results
            </p>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Filters */}
          <FilterControls
            filters={filters}
            departments={departments}
            onFiltersChange={setFilters}
            onDateRangePreset={handleDateRangePreset}
          />

          {/* Stats Cards */}
          <StatsCards 
            totalSessions={serverData.totalSessions}
            passRate={serverData.passRate}
            averageScore={serverData.overallSkillAverage}
            averageCompletionTime={serverData.averageCompletionTime}
            isLoading={loadingAnimation} 
          />

          {/* Charts Grid */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Performance Trend - Full width on smaller screens, half on XL */}
            <div className="xl:col-span-2">
              <PerformanceTrendChart data={performanceTrendData} isLoading={loadingAnimation} />
            </div>
            
            {/* Skills Comparison */}
            <div>
              <SkillsComparisonChart data={serverData.averageScoresByDepartment} isLoading={loadingAnimation} />
            </div>
            
            {/* Pass Rate Chart */}
            <div>
              {passRateData && <PassRateChart data={passRateData} isLoading={loadingAnimation} />}
            </div>
          </section>

          {/* Data Summary */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-900">Total Sessions</p>
                <p className="text-2xl font-bold text-blue-600">{serverData.totalSessions}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-900">Overall Pass Rate</p>
                <p className="text-2xl font-bold text-green-600">{Math.round(serverData.passRate)}%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-900">Data Version</p>
                <p className="text-gray-600">{serverData.metadata.version}</p>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500 text-center">
              Last updated: {new Date(serverData.metadata.generatedAt).toLocaleString()}
            </div>
          </section>

          {/* Department Performance */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {serverData.averageScoresByDepartment.map((dept) => (
                <div key={dept.department} className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-900">{dept.department}</p>
                  <p className="text-2xl font-bold text-blue-600">{dept.average.toFixed(1)}</p>
                  <p className="text-sm text-gray-600">Average Score</p>
                </div>
              ))}
            </div>
          </section>

          {/* Top Skills */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Skills</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {serverData.topSkills.map((skill) => (
                <div key={skill.skill} className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-900 capitalize">{skill.skill.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className="text-2xl font-bold text-green-600">{skill.average.toFixed(1)}</p>
                  <p className="text-sm text-gray-600">Average Score</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};