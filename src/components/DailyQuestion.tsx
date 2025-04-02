import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Question } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';
import { FileText, Loader2 } from 'lucide-react';

interface DailyQuestionProps {
  category: 'dsa' | 'project';
}

interface QuestionError {
  type: 'fetch' | 'network' | 'server';
  message: string;
}

const DailyQuestion: React.FC<DailyQuestionProps> = ({ category }) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<QuestionError | null>(null);
  const { toast } = useToast();
  
  // Memoize today's date to prevent unnecessary re-renders
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  useEffect(() => {
    let isMounted = true;

    const fetchTodaysQuestion = async () => {
      try {
        setLoading(true);
        setError(null);

        // First check if we can connect to Supabase
        const { data: testData, error: testError } = await supabase
          .from('questions')
          .select('count')
          .limit(1);

        if (testError) {
          throw new Error(`Connection error: ${testError.message}`);
        }

        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('category', category)
          .order('date', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          throw new Error(error.message);
        }

        if (isMounted) {
          setQuestion(data);
        }
      } catch (error) {
        console.error('Error fetching question:', error);
        if (isMounted) {
          if (error instanceof Error) {
            if (error.message.includes('network') || error.message.includes('Connection error')) {
              setError({
                type: 'network',
                message: 'Network connection error. Please check your internet connection.'
              });
            } else {
              setError({
                type: 'fetch',
                message: 'Failed to fetch today\'s question. Please try again later.'
              });
            }
          } else {
            setError({
              type: 'server',
              message: 'An unexpected error occurred. Please try again later.'
            });
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTodaysQuestion();

    return () => {
      isMounted = false;
    };
  }, [category, today]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="h-24 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Error Loading Challenge</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error.message}</p>
          <p className="mt-2 text-muted-foreground">Please try refreshing the page or contact support if the issue persists.</p>
        </CardContent>
      </Card>
    );
  }

  if (!question) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No Challenge Today</CardTitle>
        </CardHeader>
        <CardContent>
          <p>There is no {category === 'dsa' ? 'DSA question' : 'project challenge'} available for today.</p>
          <p className="mt-2 text-muted-foreground">Check back tomorrow or contact an administrator.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Today's Challenge</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-sm text-muted-foreground mb-1">
            {formatDate(question.date)}
          </div>
          <div className="whitespace-pre-wrap">{question.text}</div>
        </div>
      </CardContent>
      <CardFooter>
        <Link to="/submit" className="w-full">
          <Button className="w-full">
            <FileText className="mr-2 h-4 w-4" />
            Submit Your Solution
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default DailyQuestion;
