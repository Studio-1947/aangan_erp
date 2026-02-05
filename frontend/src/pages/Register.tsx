import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

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

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      alert('Registration successful! Please check your email for confirmation login.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="absolute rounded-full blur-[80px] -z-10 opacity-60 bg-accent-pink w-[300px] h-[300px] -top-[100px] -left-[100px]"></div>
      <div className="absolute rounded-full blur-[80px] -z-10 opacity-60 bg-accent-blue w-[400px] h-[400px] -bottom-[150px] -right-[100px]"></div>
      
      <div className="glass-container p-12 rounded-3xl w-full max-w-md animate-fadeIn">
        <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
          Create Account
        </h1>
        <p className="text-center mb-8 opacity-80 font-light">Join Aangan ERP today</p>
        
        {error && (
          <div className="text-red-400 bg-red-500/10 p-3 rounded-lg text-sm text-center border border-red-500/30 mb-4 animate-shake">
            {error}
          </div>
        )}
        
        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <div className="relative">
            <input
              type="email"
              className="glass-input placeholder-white/50"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <input
              type="password"
              className="glass-input placeholder-white/50"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full p-4 bg-white text-primary rounded-xl text-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 mt-4"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-white/70">
          Already have an account? <Link to="/login" className="text-white font-medium ml-1 hover:underline underline-offset-4">Sign In</Link>
        </div>
      </div>
    </>
  );
};

export default Register;
