import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In real app, call supabase.auth.signOut()
    navigate('/login');
  };

  return (
    <>
      <div className="absolute rounded-full blur-[100px] -z-10 opacity-30 bg-accent-pink w-[500px] h-[500px] -top-[200px] -left-[200px]"></div>
      
      <div className="min-h-screen p-8 text-white">
        <header className="glass-container rounded-2xl p-6 flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/20 rounded-xl">
              <LayoutDashboard size={24} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Aangan Dashboard</h1>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <div className="glass-container p-8 rounded-3xl col-span-full md:col-span-2">
            <h2 className="text-3xl font-bold mb-4">Welcome back, Admin</h2>
            <p className="text-white/60 text-lg">
              Here's what's happening with your homestays today.
            </p>
          </div>

          {/* Stats Card Placeholder */}
          <div className="glass-container p-8 rounded-3xl flex flex-col justify-center items-center text-center">
            <div className="text-5xl font-bold text-primary mb-2">12</div>
            <div className="text-white/50">Active Bookings</div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
