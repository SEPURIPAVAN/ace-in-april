
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DailyQuestion from '@/components/DailyQuestion';
import Navbar from '@/components/Navbar';

const Home = () => {
  const { user } = useAuth();

  if (!user) {
    return null; // Auth provider will handle redirect
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
