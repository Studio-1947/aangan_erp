import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { LogOut, Home, User } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email || 'Owner');
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen p-6 md:p-12 text-white">
      {/* Background Ambience */}
      <div className="absolute rounded-full blur-[120px] -z-10 opacity-30 bg-accent-pink w-[400px] h-[400px] -top-[100px] -right-[100px]"></div>
      <div className="absolute rounded-full blur-[120px] -z-10 opacity-30 bg-accent-blue w-[400px] h-[400px] bottom-0 left-0"></div>

      <div className="max-w-7xl mx-auto">
        <header className="glass-container rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
           <div className="flex items-center gap-4">
             <div className="p-3 bg-primary/20 rounded-xl border border-primary/20">
               <Home size={28} className="text-primary" />
             </div>
             <div>
               <h1 className="text-2xl font-bold">Aangan Dashboard</h1>
               <p className="text-white/60 text-sm">Managing your homestay</p>
             </div>
           </div>

           <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
               <User size={16} className="text-primary" />
               <span className="text-sm font-medium">{userEmail}</span>
             </div>
             
             <button 
               onClick={handleLogout}
               className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-200 rounded-xl transition-all duration-300 group"
             >
               <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
               <span>Log Out</span>
             </button>
           </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Welcome Card */}
          <div className="glass-container p-10 rounded-3xl col-span-full bg-gradient-to-br from-white/10 to-white/5 border-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-32 bg-primary/20 rounded-full blur-[60px] group-hover:bg-primary/30 transition-all duration-500"></div>
            <h2 className="text-4xl font-bold mb-4 relative z-10">Welcome, Homestay Owner</h2>
            <p className="text-white/70 text-lg max-w-2xl relative z-10">
              Your property is running smoothly. Use the dashboard to manage bookings, view guest details, and track your revenue.
            </p>
          </div>

          {/* Placeholder Cards for future features */}
          <div className="glass-container p-8 rounded-3xl flex flex-col items-center justify-center text-center h-64 border-dashed border-2 border-white/10 hover:border-primary/30 transition-colors cursor-pointer group">
             <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <span className="text-2xl">📅</span>
             </div>
             <h3 className="text-xl font-semibold mb-2">Bookings</h3>
             <p className="text-white/40 text-sm">Create and manage reservations</p>
          </div>

          <div className="glass-container p-8 rounded-3xl flex flex-col items-center justify-center text-center h-64 border-dashed border-2 border-white/10 hover:border-primary/30 transition-colors cursor-pointer group">
             <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <span className="text-2xl">🏠</span>
             </div>
             <h3 className="text-xl font-semibold mb-2">Rooms</h3>
             <p className="text-white/40 text-sm">Manage room availability</p>
          </div>
          
          <div className="glass-container p-8 rounded-3xl flex flex-col items-center justify-center text-center h-64 border-dashed border-2 border-white/10 hover:border-primary/30 transition-colors cursor-pointer group">
             <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <span className="text-2xl">💰</span>
             </div>
             <h3 className="text-xl font-semibold mb-2">Revenue</h3>
             <p className="text-white/40 text-sm">Track your earnings</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
