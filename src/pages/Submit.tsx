
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import SubmissionForm from '@/components/SubmissionForm';

const Submit = () => {
  const { user } = useAuth();

  if (!user) {
    return null; // Auth provider will handle redirect
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Submit Your Solution</h1>
          <SubmissionForm />
        </div>
      </main>
    </div>
  );
};

export default Submit;
