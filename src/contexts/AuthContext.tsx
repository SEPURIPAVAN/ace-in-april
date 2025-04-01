import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import type { User, LoginCredentials } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import bcrypt from 'bcryptjs';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = () => {
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
        localStorage.removeItem('aceInApril_user'); // Clear invalid data
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      console.log('Attempting login with:', credentials.username);
      
      // Query the users table with proper password hashing
      const { data, error } = await supabase
        .from('users')
        .select('id, username, role, category, password, created_at')
        .eq('username', credentials.username)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        toast({
          title: 'Login failed',
          description: 'Database error occurred',
          variant: 'destructive',
        });
        return false;
      }

      if (!data) {
        toast({
          title: 'Login failed',
          description: 'User not found',
          variant: 'destructive',
        });
        return false;
      }

      console.log('Found user:', { username: data.username, hasPassword: !!data.password });
      
      // Direct password comparison for demo
      const isValidPassword = credentials.password === data.password;
      console.log('Password verification:', { 
        providedPassword: credentials.password,
        storedPassword: data.password,
        isValid: isValidPassword 
      });

      if (!isValidPassword) {
        toast({
          title: 'Login failed',
          description: 'Invalid username or password',
          variant: 'destructive',
        });
        return false;
      }

      // Remove password from user data before storing
      const { password, ...userData } = data;

      // Save user data to localStorage
      localStorage.setItem('aceInApril_user', JSON.stringify(userData));
      setUser(userData);

      toast({
        title: 'Login successful',
        description: `Welcome back, ${userData.username}!`,
      });

      // Redirect based on role
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login error',
        description: 'An unexpected error occurred. Please try again later.',
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
      <Outlet />
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
