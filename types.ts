export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string; // In a real app, never store plain text passwords
}

export interface AnalysisResult {
  level: number;
  levelName: string;
  assessment: string;
  keyFeatures: string[];
  recommendations: string[];
  isAcne: boolean;
  confidenceScore?: number;
}

export interface HistoryItem {
  id: string;
  date: string;
  result: AnalysisResult;
  imageUrl?: string; // URL from Supabase storage
}

export enum AcneLevel {
  MILD = 1,
  MODERATE = 2,
  SEVERE = 3,
  VERY_SEVERE = 4
}

export type ViewState = 'HOME' | 'LOGIN' | 'REGISTER' | 'PROFILE' | 'HISTORY';