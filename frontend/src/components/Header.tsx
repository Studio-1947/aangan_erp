import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { LogOut, Home, User, ArrowLeft } from 'lucide-react';
import { homestayService } from '../services/homestayService';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [homestayName, setHomestayName] = useState<string | null>(null);

  useEffect(() => {
    const getUserAndHomestay = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email || 'Owner');

      if (user) {
        const homestay = await homestayService.getUserHomestay(user.id);
        if (homestay) {
          setHomestayName(homestay.name);
        }
      }
    };
    getUserAndHomestay();
  }, [location.pathname]); // Re-check on route change if needed (e.g. after creation)

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Determine title based on path
  const getPageTitle = () => {
    if (location.pathname === '/dashboard') return { title: homestayName || 'Aangan Dashboard', subtitle: homestayName ? 'Manage your property' : 'Loading...' };
    if (location.pathname === '/onboarding') return { title: 'Welcome to Aangan', subtitle: 'Let\'s get you set up' };
    return { title: 'Aangan ERP', subtitle: 'Homestay Management' };
  };

  const { title, subtitle } = getPageTitle();
  const isOnboarding = location.pathname === '/onboarding';

  return (
    <header className="glass-container rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
      <div className="flex items-center gap-4">
        {/* Hide back button on Onboarding and Dashboard */}
        {!isOnboarding && location.pathname !== '/dashboard' && (
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
        )}
        <div className="p-3 bg-primary/20 rounded-xl border border-primary/20">
          <Home size={28} className="text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-white/60 text-sm">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
          <User size={16} className="text-primary" />
          {/* Show Homestay Name as primary identity context if available, else email */}
          <span className="text-sm font-medium">{homestayName || userEmail}</span>
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
  );
};

export default Header;
