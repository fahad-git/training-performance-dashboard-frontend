import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartDataPoint } from '../types/training';
import { format, parseISO } from 'date-fns';
import { TrendingUp } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

interface PerformanceTrendChartProps {
  data: ChartDataPoint[];
  isLoading?: boolean;
}

export const PerformanceTrendChart: React.FC<PerformanceTrendChartProps> = ({ 
  data, 
  isLoading = false 
}) => {
  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM dd');
    } catch {
      return dateStr;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{formatDate(label)}</p>
          {payload.map((entry: any) => (
            <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}{entry.dataKey === 'passRate' ? '%' : ''}
            </p>
          ))}
          <p className="text-sm text-gray-600 mt-1">
            Sessions: {payload[0]?.payload?.sessionCount}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Performance Trend</h3>
        </div>
        <div className="h-80 flex items-center justify-center">
          <LoadingSpinner size="md" message="Loading pass rate data..." />
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Performance Trend</h3>
        </div>
        <div className="h-80 flex items-center justify-center">
          <p className="text-gray-500">No data available for the selected period</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 focus:outline-none">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Performance Trend</h3>
        <span className="ml-auto text-sm text-gray-500">{data.length} data points</span>
      </div>
      
      <div className="h-80 focus:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="averageScore"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              name="Average Score"
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
            />
            <Line
              type="monotone"
              dataKey="passRate"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              name="Pass Rate (%)"
              activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#ffffff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};