import { supabase } from '../supabaseClient';
import { AuthError, type Session, type User } from '@supabase/supabase-js';

export interface AuthResponse {
    user: User | null;
    session: Session | null;
    error: AuthError | null;
}

export const authService = {
    /**
     * Sign up with email and password
     */
    signup: async (email: string, password: string): Promise<AuthResponse> => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/login`, // Redirect to login after verification
            },
        });

        return { user: data.user, session: data.session, error };
    },

    /**
     * Sign in with email and password
     */
    login: async (email: string, password: string): Promise<AuthResponse> => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        return { user: data.user, session: data.session, error };
    },

    /**
     * Sign out
     */
    logout: async (): Promise<{ error: AuthError | null }> => {
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    /**
     * Send password reset email
     */
    resetPasswordForEmail: async (email: string): Promise<{ error: AuthError | null }> => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        return { error };
    },

    /**
     * Update password (requires active session)
     */
    updatePassword: async (password: string): Promise<{ error: AuthError | null }> => {
        const { error } = await supabase.auth.updateUser({
            password: password,
        });
        return { error };
    },

    /**
     * Get current session
     */
    getSession: async (): Promise<{ session: Session | null; error: AuthError | null }> => {
        const { data, error } = await supabase.auth.getSession();
        return { session: data.session, error };
    },

    /**
     * Normalize error messages for UI
     */
    normalizeError: (error: AuthError | null): string => {
        if (!error) return '';

        // Customize Supabase error messages here if needed
        if (error.message.includes('Invalid login credentials')) {
            return 'Invalid email or password. Please try again.';
        }
        if (error.message.includes('Email not confirmed')) {
            return 'Please verify your email address before logging in.';
        }

        return error.message;
    }
};
