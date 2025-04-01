
export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  category: 'dsa' | 'project';
  created_at?: string;
}

export interface Question {
  id: string;
  date: string;
  text: string;
  category: 'dsa' | 'project';
  created_at?: string;
}

export interface Submission {
  id: string;
  user_id: string;
  date: string;
  message: string;
  file_url?: string;
  created_at?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}
