
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
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

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Logout user if they visit this page (to prevent getting stuck in logged-in state if previous reset failed)
    React.useEffect(() => {
        const signOut = async () => {
            await authService.logout();
        };
        signOut();
    }, []);

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        if (!email) {
            sileo.error({ title: 'Please enter your email address.' });
            setLoading(false);
            return;
        }

        try {
            // We always show success message for security (don't reveal if email exists)
            // BUT we still log error internally if needed
            await authService.resetPasswordForEmail(email);

            // Simulate network delay if response is too fast, for better UX
            // (Optional, mostly handled by await above)
            setSuccess(true);
            sileo.success({ title: 'Reset link sent if account exists.' });
        } catch (err: any) {
            // In a production app, we might still want to show a generic error
            // or handle rate limits specifically.
            console.error('Password reset error:', err);
            // For rate limits, we should probably tell the user
            if (err.message && err.message.toLowerCase().includes('rate limit')) {
                sileo.error({ title: 'Too many requests. Please try again later.' });
            } else {
                // Generic success even on error to prevent enumeration, unless rate limit
                setSuccess(true);
                sileo.success({ title: 'Reset link sent if account exists.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-muted/50">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Reset password</CardTitle>
                    <CardDescription>
                        Enter your email address and we&apos;ll send you a link to reset your password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium">Check your email</h3>
                                <p className="text-muted-foreground mt-2 text-sm">
                                    If an account exists for {email}, we have sent a password reset link to it.
                                </p>
                            </div>
                            <Button asChild className="mt-4" variant="outline">
                                <Link to="/login">Back to Login</Link>
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleResetRequest} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        className="pl-9"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Send Reset Link
                            </Button>
                        </form>
                    )}
                </CardContent>
                {!success && (
                    <CardFooter>
                        <div className="w-full">
                            <Button asChild variant="ghost" className="w-full">
                                <Link to="/login" className="flex items-center gap-2">
                                    <ArrowLeft size={16} />
                                    Back to Login
                                </Link>
                            </Button>
                        </div>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
};

export default ForgotPassword;
