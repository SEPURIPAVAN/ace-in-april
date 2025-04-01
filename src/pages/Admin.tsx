
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import UserList from '@/components/UserList';
import QuestionForm from '@/components/QuestionForm';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If user is not an admin, redirect to home
  if (!user) {
    return null; // Auth provider will handle redirect
  }

  if (user.role !== 'admin') {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <UserList />
          </div>
          <div>
            <QuestionForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
