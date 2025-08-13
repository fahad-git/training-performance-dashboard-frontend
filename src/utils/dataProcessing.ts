import { ChartDataPoint, DateRangePresetType, PassRateData, ServerApiResponse } from '../types/training';
import { format, subDays, subMonths } from 'date-fns';

// Utility functions for server data processing
export const processServerPerformanceTrends = (serverData: ServerApiResponse): ChartDataPoint[] => {
  return serverData.performanceTrends.map(trend => ({
    date: trend.date,
    averageScore: trend.averageScore,
    passRate: serverData.passRate, // Use overall pass rate for all trends
    sessionCount: Math.round(serverData.totalSessions / serverData.performanceTrends.length) // Approximate sessions per day
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const processServerPassRateData = (serverData: ServerApiResponse): PassRateData => {
  return {
    passRate: serverData.passRate,
    totalSessions: serverData.totalSessions,
    averageScoresByDepartment: serverData.averageScoresByDepartment
  };
};

// Utility function to get the date range for the server data
export const getServerDateRange = (range: DateRangePresetType) => {
  const today = new Date();

  switch (range) {
    case '7days':
      return {
        start: format(subDays(today, 7), 'yyyy-MM-dd'),
        end: format(today, 'yyyy-MM-dd')
      };
    case '30days':
      return {
        start: format(subDays(today, 30), 'yyyy-MM-dd'),
        end: format(today, 'yyyy-MM-dd')
      };
    case '90days':
      return {
        start: format(subDays(today, 90), 'yyyy-MM-dd'),
        end: format(today, 'yyyy-MM-dd')
      };
    case '12months':
      return {
        start: format(subMonths(today, 12), 'yyyy-MM-dd'),
        end: format(today, 'yyyy-MM-dd')
      };
    default:
      return {
        start: format(subDays(today, 30), 'yyyy-MM-dd'),
        end: format(today, 'yyyy-MM-dd')
      };
  }
};