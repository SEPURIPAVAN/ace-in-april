
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to appropriate page
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <LoginForm />
    </div>
  );
};

export default Login;
