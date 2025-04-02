import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SubmissionForm from '@/components/SubmissionForm';
import { getSubmissions } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface Submission {
  id: string;
  message: string;
  file_url: string | null;
  created_at: string;
  users: {
    username: string;
  };
}

export default function SubmitPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const data = await getSubmissions();
      setSubmissions(data);
    } catch (error) {
      console.error('Error loading submissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load submissions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmissionSuccess = () => {
    loadSubmissions(); // Reload submissions after successful submission
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Submit Your Solution</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <SubmissionForm onSuccess={handleSubmissionSuccess} />
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Submissions</h2>
          {loading ? (
            <p>Loading submissions...</p>
          ) : submissions.length === 0 ? (
            <p>No submissions yet.</p>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div key={submission.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{submission.users.username}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(submission.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{submission.message}</p>
                  {submission.file_url && (
                    <a
                      href={submission.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
                    >
                      View Attachment
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 