import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { SkillsComparisonData } from '../types/training';
import { Target } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

interface SkillsComparisonChartProps {
  data: SkillsComparisonData[];
  isLoading?: boolean;
}

const COLORS = {
  Sales: '#3b82f6',
  Support: '#10b981',
  Marketing: '#8b5cf6'
};

export const SkillsComparisonChart: React.FC<SkillsComparisonChartProps> = ({ 
  data, 
  isLoading = false 
}) => {
  // Transform data for radar chart

  const radarData = [
    { skill: 'Communication', ...data.reduce((acc, dept) => ({ ...acc, [dept.department]: dept.communicationAvg }), {}) },
    { skill: 'Problem Solving', ...data.reduce((acc, dept) => ({ ...acc, [dept.department]: dept.problemSolvingAvg }), {}) },
    { skill: 'Product Knowledge', ...data.reduce((acc, dept) => ({ ...acc, [dept.department]: dept.productKnowledgeAvg }), {}) },
    { skill: 'Customer Service', ...data.reduce((acc, dept) => ({ ...acc, [dept.department]: dept.customerServiceAvg }), {}) }
  ];
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Skills Comparison</h3>
        </div>
        <div className="h-80 flex items-center justify-center">
          <LoadingSpinner size="md" message="Loading skills comparison data..." />
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Skills Comparison</h3>
        </div>
        <div className="h-80 flex items-center justify-center">
          <p className="text-gray-500">No data available for comparison</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 focus:outline-none">
      <div className="flex items-center gap-2 mb-6">
        <Target className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Skills Comparison by Department</h3>
        <span className="ml-auto text-sm text-gray-500">{data.length} departments</span>
      </div>
      
      <div className="h-80 focus:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
            <PolarGrid stroke="#f0f0f0" />
            <PolarAngleAxis 
              dataKey="skill" 
              tick={{ fontSize: 11, fill: '#6b7280' }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fontSize: 11, fill: '#6b7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {data.map((dept, index) => (
              <Radar
                key={dept.department}
                name={dept.department}
                dataKey={dept.department}
                stroke={COLORS[dept.department as keyof typeof COLORS] || `hsl(${index * 137.5}, 70%, 50%)`}
                fill={COLORS[dept.department as keyof typeof COLORS] || `hsl(${index * 137.5}, 70%, 50%)`}
                fillOpacity={0.1}
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        {data.map(dept => (
          <div key={dept.department} className="text-center">
            <div 
              className="w-3 h-3 rounded-full mx-auto mb-1"
              style={{ backgroundColor: COLORS[dept.department as keyof typeof COLORS] || '#6b7280' }}
            />
            <p className="font-medium text-gray-900">{dept.department}</p>
            <p className="text-gray-600">
              Avg: {dept.average}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};