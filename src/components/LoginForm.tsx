import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface LoginError {
  type: 'validation' | 'network' | 'auth' | 'server';
  message: string;
}

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<LoginError | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    if (!username || !password) {
      setError({
        type: 'validation',
        message: 'Username and password are required'
      });
      return false;
    }

    if (password.length < 8) {
      setError({
        type: 'validation',
        message: 'Password must be at least 8 characters long'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError(null);
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const success = await login({ username, password });
      if (success) {
        navigate('/');
      } else {
        setError({
          type: 'auth',
          message: 'Invalid username or password'
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('network')) {
          setError({
            type: 'network',
            message: 'Network connection error. Please check your internet connection.'
          });
        } else {
          setError({
            type: 'server',
            message: 'An unexpected error occurred. Please try again later.'
          });
        }
      } else {
        setError({
          type: 'server',
          message: 'An unexpected error occurred. Please try again later.'
        });
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Ace in April</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              required
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              autoComplete="current-password"
              minLength={8}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          Solve daily problems and track your progress
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
