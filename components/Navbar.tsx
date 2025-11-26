import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, UserCircle, LogOut, LogIn, LayoutGrid } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-brand-900/80 backdrop-blur-md border-b border-brand-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={isAuthenticated ? "/movies" : "/"} className="flex items-center gap-2">
            <div className="bg-brand-accent p-1.5 rounded-lg">
              <Film className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Cine<span className="text-brand-400">Rate</span></span>
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/movies" className="text-gray-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1">
                   <Film size={16} /> Movies
                </Link>
                <Link to="/genres" className="text-gray-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1">
                   <LayoutGrid size={16} /> Genres
                </Link>
                <div className="flex items-center gap-3 pl-4 border-l border-brand-700">
                    <Link to="/profile" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-brand-700 group-hover:bg-brand-600 flex items-center justify-center text-brand-200 font-bold text-xs">
                            {user?.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm hidden md:inline">{user?.username}</span>
                    </Link>
                    <button 
                        onClick={handleLogout}
                        className="text-gray-400 hover:text-brand-accent transition-colors flex items-center gap-2 text-sm"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
              </>
            ) : (
               <>
                 <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium flex items-center gap-2">
                    <LogIn size={18} /> Login
                 </Link>
                 <Link to="/register" className="bg-brand-500 hover:bg-brand-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
                    Sign Up
                 </Link>
               </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};