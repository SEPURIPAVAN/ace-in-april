
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LoginCredentials } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for user in localStorage
    const userString = localStorage.getItem('aceInApril_user');
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      console.log('Attempting login with:', credentials.username);
      
      // Query the users table directly
      const { data, error } = await supabase
        .from('users')
        .select('id, username, role, category')
        .eq('username', credentials.username)
        .eq('password', credentials.password) // Note: Use password hashing in production
        .single();

      console.log('Login response:', { data, error });

      if (error || !data) {
        toast({
          title: 'Login failed',
          description: 'Invalid username or password',
          variant: 'destructive',
        });
        return false;
      }

      // Save user data to localStorage
      localStorage.setItem('aceInApril_user', JSON.stringify(data));
      setUser(data);

      toast({
        title: 'Login successful',
        description: `Welcome back, ${data.username}!`,
      });

      // Redirect based on role
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('aceInApril_user');
    setUser(null);
    navigate('/login');
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
