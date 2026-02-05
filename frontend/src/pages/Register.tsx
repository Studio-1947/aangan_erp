import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, AlertCircle, UserPlus } from 'lucide-react';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    console.log('Attempting registration for:', email);

    try {
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }

      // Check for min password length if needed, Supabase usually requires 6
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      console.log('Calling supabase.auth.signUp...');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
         console.error('Supabase Register Error:', error);
         throw error;
      }

      console.log('Registration successful:', data);
      
      alert('Registration successful! Please check your email for confirmation login.');
      navigate('/login');
    } catch (err: any) {
      console.error('Register Exception:', err);
      
      // Specifically handle Rate Limit error
      if (err.message && err.message.toLowerCase().includes('rate limit')) {
        setError('Too many attempts. Please try again in an hour.');
      } else {
        setError(err.message || 'An error occurred during registration');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="absolute rounded-full blur-[100px] -z-10 opacity-50 bg-accent-pink w-[300px] h-[300px] -top-[50px] -left-[100px] animate-pulse"></div>
      <div className="absolute rounded-full blur-[100px] -z-10 opacity-50 bg-accent-blue w-[400px] h-[400px] -bottom-[100px] -right-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-container p-8 md:p-12 rounded-3xl w-full max-w-md animate-fadeIn transition-all duration-300 hover:shadow-[0_0_40px_rgba(16,185,129,0.1)]">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-primary-hover bg-clip-text text-transparent drop-shadow-sm">
              Join Aangan
            </h1>
            <p className="text-white/60 font-light text-lg">Start managing visually</p>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl mb-6 flex items-start gap-3 animate-shake">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="email"
                className="glass-input pl-12 focus:ring-2 ring-primary/20 transition-all"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="password"
                className="glass-input pl-12 focus:ring-2 ring-primary/20 transition-all"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full py-4 bg-primary text-white rounded-xl text-lg font-semibold hover:bg-primary-hover hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2 mt-2"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  <span>Create Account</span>
                  <UserPlus size={20} />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-8 text-sm text-white/60">
            Already have an account? <Link to="/login" className="text-primary font-bold ml-1 hover:underline underline-offset-4 decoration-2">Sign In</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
