
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Question } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';
import { FileText } from 'lucide-react';

interface DailyQuestionProps {
  category: 'dsa' | 'project';
}

const DailyQuestion: React.FC<DailyQuestionProps> = ({ category }) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Get current date formatted as YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchTodaysQuestion = async () => {
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('date', today)
          .eq('category', category)
          .single();

        if (error) {
          console.error('Error fetching question:', error);
          toast({
            title: 'Error fetching today\'s question',
            description: error.message,
            variant: 'destructive',
          });
          return;
        }

        setQuestion(data);
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodaysQuestion();
  }, [category, today, toast]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="h-24 flex items-center justify-center">
            <p>Loading today's challenge...</p>
          </div>
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
