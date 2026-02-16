import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { authService } from '../services/authService';
import { supabase } from '../supabaseClient';
import { sileo } from 'sileo';

const ResetPassword: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [validSession, setValidSession] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        // Check if we have a valid session (recovery link logs user in)
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setValidSession(true);
            } else {
                // If no session, they shouldn't be here (or link is invalid/consumed)
                // Redirecting to login ensures they can't manually access this page
                navigate('/login');
            }
            setCheckingSession(false);
        };

        checkSession();

        // Listen to changes (in case link is clicked while app is open)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setValidSession(true);
            } else if (event === 'SIGNED_OUT' || !session) {
                // Handle explicit sign out or session loss
                setValidSession(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Validation
        if (!password || !confirmPassword) {
            sileo.error({ title: 'Both fields are required.' });
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

        try {
            const { error } = await authService.updatePassword(password);

            if (error) throw error;

            sileo.success({ title: 'Password updated successfully. Redirecting to login...' });

            sileo.success({ title: 'Password updated successfully. Redirecting to login...' });

            // Wait 1.5 seconds before redirecting
            setTimeout(async () => {
                // Sign out after password update to force fresh login with new credentials
                await authService.logout();
                navigate('/login');
            }, 1500);

        } catch (err: any) {
            sileo.error({ title: authService.normalizeError(err) });
            setLoading(false);
        }
        // Note: We don't set loading(false) on success to prevent UI flicker before redirect
    };

    if (checkingSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/50">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    if (!validSession) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-muted/50">
                <Card className="w-full max-w-md text-center p-6 space-y-4">
                    <div className="flex justify-center">
                        <AlertCircle className="h-12 w-12 text-destructive" />
                    </div>
                    <CardTitle>Invalid or Expired Link</CardTitle>
                    <CardDescription>
                        This password reset link is invalid or has expired. Please request a new one.
                    </CardDescription>
                    <Button asChild className="w-full">
                        <Link to="/forgot-password">Request New Link</Link>
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-muted/50">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Set new password</CardTitle>
                    <CardDescription>
                        Please enter your new password below
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
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
                            Update Password
                        </Button>

                        <div className="text-center mt-4">
                            <Button
                                variant="link"
                                type="button"
                                className="text-sm text-muted-foreground"
                                onClick={async () => {
                                    await authService.logout();
                                    navigate('/login');
                                }}
                            >
                                Cancel and Return to Login
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResetPassword;
