import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Home, MapPin, Loader2, PlusCircle, AlertCircle } from 'lucide-react';
import { homestayService } from '../services/homestayService';

const CreateHomestay: React.FC = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user already has a homestay
  useEffect(() => {
    const checkExisting = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const existing = await homestayService.getUserHomestay(user.id);
        if (existing) {
          // Already has a homestay, redirect to dashboard
          navigate('/dashboard', { replace: true });
        }
      } catch (err) {
        console.error('Error checking existing homestay:', err);
      } finally {
        setCheckingStatus(false);
      }
    };
    checkExisting();
  }, [navigate]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!name || !address) {
        throw new Error('Please fill in all fields');
      }

      // 1. Get logged in user
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      if (!userId) {
        throw new Error('User not logged in');
      }

      // 2. Check profile exists
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .single();

      if (profileError || !profile) {
        throw new Error("Profile not found. Please logout and login again.");
      }

      // 3. Insert homestay with valid owner_id
      const { error: insertError } = await supabase.from('homestays').insert({
        name,
        address,
        owner_id: profile.id,
      });

      if (insertError) throw insertError;
      
      alert('Homestay setup successful!');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error('Error creating homestay:', err);
      setError(err.message || 'Failed to create homestay');
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <>
      {/* Background Shapes - consistent with Login/Register */}
      <div className="absolute rounded-full blur-[100px] -z-10 opacity-50 bg-accent-pink w-[300px] h-[300px] -top-[50px] -left-[100px] animate-pulse"></div>
      <div className="absolute rounded-full blur-[100px] -z-10 opacity-50 bg-accent-blue w-[400px] h-[400px] -bottom-[100px] -right-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-container p-8 md:p-12 rounded-3xl w-full max-w-md animate-fadeIn transition-all duration-300 hover:shadow-[0_0_40px_rgba(16,185,129,0.1)]">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-white to-primary-hover bg-clip-text text-transparent drop-shadow-sm">
              Setup Your Homestay
            </h1>
            <p className="text-white/60 font-light text-lg">One last step to get started</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl mb-6 flex items-start gap-3 animate-shake">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleCreate} className="flex flex-col gap-5">
            <div className="relative group">
              <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="text"
                className="glass-input pl-12 focus:ring-2 ring-primary/20 transition-all w-full"
                placeholder="Homestay Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="text"
                className="glass-input pl-12 focus:ring-2 ring-primary/20 transition-all w-full"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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
                  <PlusCircle size={20} />
                  <span>Complete Setup</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateHomestay;
