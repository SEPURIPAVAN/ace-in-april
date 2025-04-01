import { supabase } from './supabase';
import { Question, Submission, User, ApiResponse, ApiError as ApiErrorType } from '@/types';

class ApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = {
  async getTodaysQuestion(category: 'dsa' | 'project'): Promise<ApiResponse<Question>> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('date', today)
        .eq('category', category)
        .single();

      if (error) {
        throw new ApiError(error.message, error.code, error.status, error.details);
      }

      return { data, error: null };
    } catch (error) {
      if (error instanceof ApiError) {
        return { data: null, error };
      }
      return { 
        data: null, 
        error: new ApiError('An unexpected error occurred while fetching the question')
      };
    }
  },

  async submitAnswer(submission: Omit<Submission, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Submission>> {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .insert([submission])
        .select()
        .single();

      if (error) {
        throw new ApiError(error.message, error.code, error.status, error.details);
      }

      return { data, error: null };
    } catch (error) {
      if (error instanceof ApiError) {
        return { data: null, error };
      }
      return { 
        data: null, 
        error: new ApiError('An unexpected error occurred while submitting your answer')
      };
    }
  },

  async getUserSubmissions(userId: string): Promise<ApiResponse<Submission[]>> {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new ApiError(error.message, error.code, error.status, error.details);
      }

      return { data, error: null };
    } catch (error) {
      if (error instanceof ApiError) {
        return { data: null, error };
      }
      return { 
        data: null, 
        error: new ApiError('An unexpected error occurred while fetching your submissions')
      };
    }
  },

  async authenticateUser(username: string, password: string): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, role, category, password_hash')
        .eq('username', username)
        .single();

      if (error) {
        throw new ApiError(error.message, error.code, error.status, error.details);
      }

      if (!data) {
        throw new ApiError('User not found', 'USER_NOT_FOUND');
      }

      return { data, error: null };
    } catch (error) {
      if (error instanceof ApiError) {
        return { data: null, error };
      }
      return { 
        data: null, 
        error: new ApiError('An unexpected error occurred during authentication')
      };
    }
  }
}; 