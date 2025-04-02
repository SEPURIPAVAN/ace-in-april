import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
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

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
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

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('Attempting login with:', credentials);
      
      // First, get the user by username
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', credentials.username)
        .single();

      if (userError) {
        console.log('User lookup error:', userError);
        return false;
      }

      if (!userData) {
        return false;
      }

      // For demo purposes, use plain text password comparison
      if (credentials.password !== userData.password) {
        return false;
      }

      // Store user data in localStorage
      localStorage.setItem('aceInApril_user', JSON.stringify(userData));
      setUser(userData);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
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
