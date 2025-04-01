export interface User {
  id: string;
  username: string;
  role: 'user' | 'admin';
  category: 'dsa' | 'project';
  created_at: string;
  updated_at?: string;
}

export interface Question {
  id: string;
  text: string;
  date: string;
  category: 'dsa' | 'project';
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  user_id: string;
  question_id: string;
  answer: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface LoginError {
  type: 'validation' | 'network' | 'auth' | 'server';
  message: string;
}

export interface QuestionError {
  type: 'fetch' | 'network' | 'server';
  message: string;
}

export interface ApiError extends Error {
  code?: string;
  status?: number;
  details?: unknown;
}
