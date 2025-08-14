import React, { useState, useCallback } from 'react';
import { Brain, TrendingUp, Users, Clock, Target, Loader2 } from 'lucide-react';
import { FilterOptions } from '../types/training';
import { config } from '../config/environment';

interface NaturalLanguageInsightsProps {
  filters: FilterOptions;
}

interface InsightsResponse {
  metadata: {
    generatedAt: string;
    version: string;
    filters: {
      department: string;
      startDate: string;
      endDate: string;
    };
  };
  summary: {
    totalSessions: number;
    passRate: number;
    averageCompletionTime: number;
    overallSkillAverage: number;
  };
  naturalLanguageInsights: string;
}

export const NaturalLanguageInsights: React.FC<NaturalLanguageInsightsProps> = ({ filters }) => {
  const [insights, setInsights] = useState<InsightsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Prepare filter parameters
      const params = new URLSearchParams();
      if (filters.department && filters.department !== 'All') {
        params.set('department', filters.department);
      }
      if (filters.dateRange.start) {
        params.set('startDate', filters.dateRange.start);
      }
      if (filters.dateRange.end) {
        params.set('endDate', filters.dateRange.end);
      }

      // Use the same API base URL pattern as other API calls
      const apiUrl = config.api.baseURL || '';
      const fullUrl = `${apiUrl}/natural-language-insights?${params.toString()}`;
      
      console.log('Making API call to:', fullUrl);
      console.log('Filters being sent:', filters);
      
      const response = await fetch(fullUrl);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API call failed: ${response.status} ${response.statusText}. Response: ${errorText.substring(0, 200)}...`);
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('Non-JSON Response:', responseText);
        throw new Error(`Expected JSON response but got: ${contentType}. Response preview: ${responseText.substring(0, 200)}...`);
      }

      const data: InsightsResponse = await response.json();
      console.log('API Response received:', data);
      setInsights(data);
    } catch (err) {
      console.error('Analysis error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze data';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFilters = () => {
    const filterTexts = [];
    if (filters.department && filters.department !== 'All') {
      filterTexts.push(`Department: ${filters.department}`);
    }
    if (filters.dateRange.start) {
      filterTexts.push(`From: ${filters.dateRange.start}`);
    }
    if (filters.dateRange.end) {
      filterTexts.push(`To: ${filters.dateRange.end}`);
    }
    return filterTexts.length > 0 ? filterTexts.join(' • ') : 'All data';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <Brain className="h-5 w-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">AI-Powered Insights</h3>
        </div>
        
        <button
          onClick={analyzeData}
          disabled={isLoading}
          className={`flex items-center gap-2 px-6 py-3 text-base font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
            isLoading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:scale-105 hover:shadow-xl'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4" />
              Analyze Data
            </>
          )}
        </button>
      </div>

      {/* Current Filters Display */}
      <div className="bg-gray-50 rounded-xl p-3 mb-5">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Current Analysis Filters</span>
        </div>
        <p className="text-sm text-gray-600">{formatFilters()}</p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700">Analyzing your data...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-red-600 font-medium mb-2">Failed to analyze data</p>
          <p className="text-red-500 text-sm mb-3">{error}</p>
          <button
            onClick={analyzeData}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 border border-red-200 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Insights Content */}
      {insights && !isLoading && (
        <div className="space-y-5 animate-in slide-in-from-top-2 duration-300">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Total Sessions</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{insights.summary.totalSessions}</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">Pass Rate</span>
              </div>
              <p className="text-2xl font-bold text-green-900">{insights.summary.passRate.toFixed(1)}%</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <Target className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Skill Average</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">{insights.summary.overallSkillAverage.toFixed(1)}%</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">Avg. Time</span>
              </div>
              <p className="text-2xl font-bold text-orange-900">{insights.summary.averageCompletionTime.toFixed(1)}m</p>
            </div>
          </div>

          {/* Natural Language Insights */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="h-6 w-6 text-purple-600" />
              <h4 className="text-lg font-semibold text-gray-900">AI-Generated Insights</h4>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {insights.naturalLanguageInsights}
              </div>
            </div>
          </div>

          {/* Metadata Footer */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <span>Version: {insights.metadata.version}</span>
                <span>Generated: {formatDate(insights.metadata.generatedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span>Powered by AI Analysis</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!insights && !isLoading && !error && (
        <div className="text-center py-12">
          <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-700 mb-2">Ready for AI Analysis</h4>
          <p className="text-gray-500 mb-4">
            Click "Analyze Data" to get AI-powered insights about your training performance data.
          </p>
          <p className="text-sm text-gray-400">
            Analysis will be based on your current filter selections.
          </p>
        </div>
      )}
    </div>
  );
};
