import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DailyQuestion from '@/components/DailyQuestion';
import Navbar from '@/components/Navbar';

const Home = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Welcome, {user.username}!</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {user.category === 'dsa' 
                ? 'Your Daily DSA Challenge' 
                : 'Your Project Challenge'}
            </h2>
            <DailyQuestion category={user.category} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
