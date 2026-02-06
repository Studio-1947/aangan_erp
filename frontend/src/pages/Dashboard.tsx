import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { homestayService, type Homestay } from '../services/homestayService';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [homestay, setHomestay] = useState<Homestay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomestay = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const data = await homestayService.getUserHomestay(user.id);
        
        if (data) {
          setHomestay(data);
        } else {
          // Should have been filtered by routing, but safety check:
          navigate('/onboarding');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomestay();
  }, [navigate]);

  return (
    <div className="min-h-screen p-6 md:p-12 text-white">
      {/* Background Ambience */}
      <div className="absolute rounded-full blur-[120px] -z-10 opacity-30 bg-accent-pink w-[400px] h-[400px] -top-[100px] -right-[100px]"></div>
      <div className="absolute rounded-full blur-[120px] -z-10 opacity-30 bg-accent-blue w-[400px] h-[400px] bottom-0 left-0"></div>

      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-end mb-8">
             <div>
                <h1 className="text-3xl font-bold mb-2">My Homestay</h1>
                <p className="text-white/60">Manage your property</p>
             </div>
             {/* Create button removed - Single Homestay Policy */}
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {loading ? (
             <div className="col-span-full flex justify-center py-12">
               <Loader2 className="animate-spin text-primary" size={32} />
             </div>
          ) : homestay ? (
            <>
              {/* Homestay Card */}
              <div className="glass-container p-8 rounded-3xl flex flex-col justify-between h-64 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 group cursor-pointer col-span-1 md:col-span-1">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                    <span className="text-xl">🏠</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 truncate" title={homestay.name}>{homestay.name}</h3>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <MapPin size={14} className="shrink-0" />
                    <span className="truncate" title={homestay.address}>{homestay.address}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-sm">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                    Active
                  </span>
                  <span className="text-white/40 text-xs">
                    {new Date(homestay.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Stats Placeholders */}
              <div className="glass-container p-8 rounded-3xl flex flex-col items-center justify-center text-center h-64 border-dashed border-2 border-white/10 hover:border-primary/30 transition-colors cursor-pointer group opacity-60 hover:opacity-100">
                 <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                   <span className="text-2xl">📅</span>
                 </div>
                 <h3 className="text-xl font-semibold mb-2">Bookings</h3>
                 <p className="text-white/40 text-sm">Coming Soon</p>
              </div>

              <div className="glass-container p-8 rounded-3xl flex flex-col items-center justify-center text-center h-64 border-dashed border-2 border-white/10 hover:border-primary/30 transition-colors cursor-pointer group opacity-60 hover:opacity-100">
                 <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                   <span className="text-2xl">💰</span>
                 </div>
                 <h3 className="text-xl font-semibold mb-2">Revenue</h3>
                 <p className="text-white/40 text-sm">Coming Soon</p>
              </div>
            </>
          ) : (
            <div className="col-span-full text-center p-8 bg-red-400/10 rounded-xl text-red-200 border border-red-500/20">
               Error: No homestay found. Redirecting...
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
