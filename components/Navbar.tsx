import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, UserCircle, LogOut, LogIn, LayoutGrid, Shield, PlusCircle, Plus, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: React.ElementType, label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`group relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
          isActive 
            ? 'text-white bg-brand-800 shadow-[0_0_15px_rgba(59,130,246,0.15)] ring-1 ring-brand-700/50' 
            : 'text-gray-400 hover:text-white hover:bg-brand-800/50'
        }`}
      >
        <Icon size={16} className={`transition-colors duration-300 ${isActive ? 'text-brand-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
        <span>{label}</span>
        {isActive && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand-400 rounded-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </Link>
    );
  };

  return (
    <nav className="bg-brand-900/90 backdrop-blur-xl border-b border-brand-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={isAuthenticated ? "/movies" : "/"} className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-brand-600 to-brand-accent p-1.5 rounded-lg shadow-lg group-hover:shadow-brand-500/20 transition-all duration-300">
              <Film className="text-white transform group-hover:rotate-12 transition-transform duration-300" size={24} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight group-hover:tracking-normal transition-all duration-300">
              Cine<span className="text-brand-400">Rate</span>
            </span>
          </Link>
          
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center gap-1 bg-brand-950/50 p-1 rounded-xl border border-brand-800/50 mr-4">
                  <NavItem to="/movies" icon={Film} label="Movies" />
                  <NavItem to="/genres" icon={LayoutGrid} label="Genres" />
                  
                  {user?.role === 'ADMIN' && (
                    <>
                      <div className="w-px h-5 bg-brand-800 mx-1"></div>
                      <NavItem to="/admin/users" icon={Shield} label="Users" />
                      <NavItem to="/admin/movies/add" icon={PlusCircle} label="Add Movie" />
                      <NavItem to="/admin/genres/add" icon={Tag} label="Add Genre" />
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3 pl-4 md:border-l border-brand-800">
                    <Link 
                      to="/profile" 
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-full transition-all duration-300 ${
                        location.pathname === '/profile' 
                          ? 'bg-brand-800 ring-1 ring-brand-700' 
                          : 'hover:bg-brand-800/50'
                      }`}
                    >
                        <div className="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center text-brand-200 font-bold text-xs shadow-inner">
                            {user?.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-300 hidden lg:inline">{user?.username}</span>
                    </Link>
                    <button 
                        onClick={handleLogout}
                        className="text-gray-400 hover:text-brand-accent hover:bg-brand-accent/10 p-2 rounded-lg transition-all duration-200"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
              </>
            ) : (
               <div className="flex items-center gap-3">
                 <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium flex items-center gap-2 transition-colors">
                    <LogIn size={18} /> Login
                 </Link>
                 <Link to="/register" className="bg-brand-500 hover:bg-brand-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5">
                    Sign Up
                 </Link>
               </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};