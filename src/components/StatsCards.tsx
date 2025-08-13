import React from 'react';
import { Target, Clock, TrendingUp } from 'lucide-react';
import { TrainingSession } from '../types/training';

interface StatsCardsProps {
  sessions?: TrainingSession[];
  totalSessions?: number;
  passRate?: number;
  averageScore?: number;
  averageCompletionTime?: number;
  isLoading?: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ 
  sessions, 
  totalSessions: serverTotalSessions,
  passRate: serverPassRate,
  averageScore: serverAverageScore,
  averageCompletionTime,
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded mb-3"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Use server data if available, otherwise fall back to sessions data
  const totalSessions = serverTotalSessions ?? sessions?.length ?? 0;
  const passRate = serverPassRate ?? (sessions ? (sessions.filter(s => s.passed).length / sessions.length * 100) : 0);
  const averageScore = serverAverageScore ?? 0;
  const averageTime = averageCompletionTime ?? 0;
  
  const stats = [
    {
      label: 'Total Sessions',
      value: totalSessions.toLocaleString(),
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Pass Rate',
      value: `${Math.round(passRate)}%`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Average Score',
      value: Math.round(averageScore).toString(),
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Avg. Time (min)',
      value: averageTime.toString(),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};