
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const QuestionForm = () => {
  const [date, setDate] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [category, setCategory] = useState<'dsa' | 'project'>('dsa');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !questionText) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('questions')
        .insert({
          date,
          text: questionText,
          category,
        });
        
      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: 'Question posted',
        description: `Question for ${date} has been posted successfully.`,
      });
      
      // Reset form
      setDate('');
      setQuestionText('');
    } catch (error) {
      console.error('Error posting question:', error);
      toast({
        title: 'Error posting question',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post New Question</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Category</Label>
            <RadioGroup defaultValue="dsa" value={category} onValueChange={(value) => setCategory(value as 'dsa' | 'project')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dsa" id="dsa" />
                <Label htmlFor="dsa">DSA</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="project" id="project" />
                <Label htmlFor="project">Project</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="questionText">Question Text</Label>
            <Textarea
              id="questionText"
              placeholder="Enter the question or challenge details..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              disabled={isSubmitting}
              required
              className="min-h-[150px]"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Posting...' : 'Post Question'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuestionForm;
