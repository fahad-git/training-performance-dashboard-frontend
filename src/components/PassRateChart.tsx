import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PassRateData } from '../types/training';
import { CheckCircle2 } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

interface PassRateChartProps {
  data: PassRateData;
  isLoading?: boolean;
}

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

export const PassRateChart: React.FC<PassRateChartProps> = ({ 
  data, 
  isLoading = false
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          <p className="text-sm text-blue-600">
            Pass Rate: {data.passRate}%
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
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Pass Rate by Department</h3>
        </div>
        <div className="h-80 flex items-center justify-center">
          <LoadingSpinner size="md" message="Loading pass rate data..." />
        </div>
      </div>
    );
  }

  if (data === undefined || data === null || data.averageScoresByDepartment.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Pass Rate by Department</h3>
        </div>
        <div className="h-80 flex items-center justify-center">
          <p className="text-gray-500">No pass rate data available</p>
        </div>
      </div>
    );
  }

  const sortedData = [...data.averageScoresByDepartment].sort((a, b) => b.passRate - a.passRate);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 focus:outline-none">
      <div className="flex items-center gap-2 mb-6">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">Pass Rate by Department</h3>
        <span className="ml-auto text-sm text-gray-500">
          Overall: {data.passRate}%
        </span>
      </div>
      
      <div className="h-80 focus:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="department" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              domain={[0, 100]}
              label={{ value: 'Pass Rate (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="passRate" radius={[4, 4, 0, 0]}>
              {sortedData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {sortedData.map((dept, index) => (
          <div key={dept.department} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="font-medium text-gray-900">{dept.department}</span>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold  text-gray-900">{dept.passRate}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};