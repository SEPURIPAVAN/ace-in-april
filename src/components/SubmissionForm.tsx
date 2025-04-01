
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';

const SubmissionForm = () => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Not logged in',
        description: 'You must be logged in to submit.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Get current date formatted as YYYY-MM-DD
      const today = new Date().toISOString().split('T')[0];
      
      // File upload (if a file is selected)
      let fileUrl = null;
      if (file) {
        const fileName = `${user.id}_${Date.now()}_${file.name}`;
        const { data: fileData, error: fileError } = await supabase.storage
          .from('submissions')
          .upload(fileName, file);
          
        if (fileError) {
          throw new Error(`File upload failed: ${fileError.message}`);
        }
        
        // Get public URL for the file
        const { data: urlData } = supabase.storage
          .from('submissions')
          .getPublicUrl(fileName);
          
        fileUrl = urlData.publicUrl;
      }
      
      // Create submission record
      const { error: submissionError } = await supabase
        .from('submissions')
        .insert({
          user_id: user.id,
          date: today,
          message: message,
          file_url: fileUrl,
        });
        
      if (submissionError) {
        throw new Error(`Submission failed: ${submissionError.message}`);
      }
      
      toast({
        title: 'Submission successful',
        description: 'Your solution has been submitted successfully.',
      });
      
      navigate('/');
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: 'Submission failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit Your Solution</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Your Message</Label>
            <Textarea
              id="message"
              placeholder="Describe your approach or include any notes about your solution..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
              required
              className="min-h-[150px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file">Upload Solution File (Optional)</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              disabled={isSubmitting}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              Upload your code, documentation, or any supporting files.
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">Submitting...</span>
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Submit Solution
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SubmissionForm;
