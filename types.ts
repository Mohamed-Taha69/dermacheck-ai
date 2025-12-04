export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string; // In a real app, never store plain text passwords
}

export type DiseaseType = 'Monkeypox' | 'Chickenpox' | 'Measles' | 'Normal';

export interface AnalysisResult {
  diagnosis: DiseaseType;
  assessment: string;
  keyFeatures: string[];
  recommendations: string[];
  confidenceScore?: number;
}

export interface HistoryItem {
  id: string;
  date: string;
  result: AnalysisResult;
  imageUrl?: string; // URL from Supabase storage
}

export type ViewState = 'HOME' | 'LOGIN' | 'REGISTER' | 'PROFILE' | 'HISTORY';