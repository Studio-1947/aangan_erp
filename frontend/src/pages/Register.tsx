import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { authService } from '../services/authService';
import { sileo } from 'sileo';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    // Validation
    if (!email || !password || !confirmPassword) {
      sileo.error({ title: 'All fields are required.' });
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      sileo.error({ title: 'Password must be at least 8 characters.' });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      sileo.error({ title: 'Passwords do not match.' });
      setLoading(false);
      return;
    }

    // Email format validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      sileo.error({ title: 'Please enter a valid email address.' });
      setLoading(false);
      return;
    }

    try {
      const { error } = await authService.signup(email, password);

      if (error) {
        throw error;
      }

      setSuccess(true);
      sileo.success({ title: 'Registration successful! Please check your email.' });
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      sileo.error({ title: authService.normalizeError(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Verification email sent!</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  We&apos;ve sent a confirmation link to your email address.
                  Please check your inbox and verify your account to log in.
                </p>
              </div>
              <Button asChild className="mt-4" variant="outline">
                <Link to="/login">Back to Login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          )}
        </CardContent>
        {!success && (
          <CardFooter>
            <div className="text-sm text-center text-muted-foreground w-full">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default Register;
