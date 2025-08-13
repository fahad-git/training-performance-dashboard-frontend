export interface TrainingSession {
  sessionId: string;
  userId: string;
  userName: string;
  department: string;
  date: string;
  overallScore: number;
  skills: {
    communication: number;
    problemSolving: number;
    productKnowledge: number;
    customerService: number;
  };
  completionTime: number;
  passed: boolean;
}

export interface TrainingData {
  metadata: {
    generatedAt: string;
    version: string;
  };
  sessions: TrainingSession[];
}

// New server API response types
export interface ServerApiResponse {
  metadata: {
    generatedAt: string;
    version: string;
  };
  totalSessions: number;
  passRate: number;
  averageCompletionTime?: number;
  overallSkillAverage?: number;
  averageScoresByDepartment: Array<{
    department: string;
    average: number;
    communicationAvg: number;
    problemSolvingAvg: number;
    productKnowledgeAvg: number;
    customerServiceAvg: number;
    passRate: number;

  }>;
  topSkills: Array<{
    skill: string;
    average: number;
  }>;
  performanceTrends: Array<{
    date: string;
    averageScore: number;
  }>;
}

export interface ChartDataPoint {
  date: string;
  averageScore: number;
  passRate: number;
  sessionCount: number;
}

export interface SkillsComparisonData {
  department: string;
  average: number;
  communicationAvg: number;
  problemSolvingAvg: number;
  productKnowledgeAvg: number;
  customerServiceAvg: number;
  passRate: number;
}

export interface PassRateData {
  passRate: number;
  totalSessions: number;
  averageScoresByDepartment: SkillsComparisonData[];
}

export interface DateRange {
  start: string;
  end: string;
}

export interface FilterOptions {
  dateRange: DateRange;
  department: string;
}

export type DateRangePresetType = "7days" | "30days" | "90days" | "12months";