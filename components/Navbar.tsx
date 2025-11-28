import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, LogOut, LogIn, LayoutGrid, Shield, PlusCircle, Tag, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const closeMenu = () => setIsMenuOpen(false);

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link
                            to={isAuthenticated ? "/movies" : "/"}
                            onClick={closeMenu}
                            className="flex items-center gap-2 group"
                        >
                            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
                                <Film className="text-white" size={24} />
                            </div>
                            <span className="text-xl font-bold text-white">
                                Cine<span className="text-blue-400">Rate</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-6">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/movies"
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                            isActive('/movies')
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                                                : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                        }`}
                                    >
                                        <Film size={18} />
                                        <span>Movies</span>
                                    </Link>

                                    <Link
                                        to="/genres"
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                            isActive('/genres')
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                                                : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                        }`}
                                    >
                                        <LayoutGrid size={18} />
                                        <span>Genres</span>
                                    </Link>

                                    {user?.role === 'ADMIN' && (
                                        <>
                                            <div className="w-px h-6 bg-slate-700"></div>

                                            <Link
                                                to="/admin/users"
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                    isActive('/admin/users')
                                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                                                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                                }`}
                                            >
                                                <Shield size={18} />
                                                <span>Users</span>
                                            </Link>

                                            <Link
                                                to="/admin/movies/add"
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                    isActive('/admin/movies/add')
                                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                                                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                                }`}
                                            >
                                                <PlusCircle size={18} />
                                                <span>Add Movie</span>
                                            </Link>

                                            <Link
                                                to="/admin/genres/add"
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                    isActive('/admin/genres/add')
                                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                                                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                                }`}
                                            >
                                                <Tag size={18} />
                                                <span>Add Genre</span>
                                            </Link>
                                        </>
                                    )}

                                    <div className="w-px h-6 bg-slate-700"></div>

                                    <Link
                                        to="/profile"
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                                            isActive('/profile')
                                                ? 'bg-slate-800 ring-2 ring-blue-500'
                                                : 'hover:bg-slate-800'
                                        }`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                            {user?.username.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium text-slate-300">{user?.username}</span>
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                                        title="Logout"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="flex items-center gap-2 text-slate-300 hover:text-white px-4 py-2 text-sm font-medium transition-colors"
                                    >
                                        <LogIn size={18} />
                                        <span>Login</span>
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-500/30"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden text-slate-400 hover:text-white p-2 transition-colors"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden fixed left-0 right-0 top-16 bg-slate-900/95 backdrop-blur-lg z-40 max-h-[85vh] overflow-y-auto shadow-2xl border-b border-slate-700">
                    <div className="p-4 space-y-3">
                        {isAuthenticated ? (
                            <>
                                {/* User Info */}
                                <div className="flex items-center gap-3 p-3 bg-slate-800/80 rounded-lg border border-slate-700 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                        {user?.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium text-sm truncate">{user?.username}</p>
                                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                                    </div>
                                    <Link
                                        to="/profile"
                                        onClick={closeMenu}
                                        className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                                    >
                                        Profile
                                    </Link>
                                </div>

                                {/* Navigation Links */}
                                <Link
                                    to="/movies"
                                    onClick={closeMenu}
                                    className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-all ${
                                        isActive('/movies')
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/80'
                                    }`}
                                >
                                    <Film size={18} />
                                    <span className="text-sm">Movies</span>
                                </Link>

                                <Link
                                    to="/genres"
                                    onClick={closeMenu}
                                    className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-all ${
                                        isActive('/genres')
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/80'
                                    }`}
                                >
                                    <LayoutGrid size={18} />
                                    <span className="text-sm">Genres</span>
                                </Link>

                                {user?.role === 'ADMIN' && (
                                    <>
                                        <div className="my-3 border-t border-slate-700/50"></div>
                                        <p className="px-3 text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
                                            Admin Controls
                                        </p>

                                        <Link
                                            to="/admin/users"
                                            onClick={closeMenu}
                                            className={`flex items-center gap-3 p-4 rounded-xl font-medium transition-all ${
                                                isActive('/admin/users')
                                                    ? 'bg-purple-600 text-white shadow-lg'
                                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                            }`}
                                        >
                                            <Shield size={20} />
                                            <span>Manage Users</span>
                                        </Link>

                                        <Link
                                            to="/admin/movies/add"
                                            onClick={closeMenu}
                                            className={`flex items-center gap-3 p-4 rounded-xl font-medium transition-all ${
                                                isActive('/admin/movies/add')
                                                    ? 'bg-purple-600 text-white shadow-lg'
                                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                            }`}
                                        >
                                            <PlusCircle size={20} />
                                            <span>Add Movie</span>
                                        </Link>

                                        <Link
                                            to="/admin/genres/add"
                                            onClick={closeMenu}
                                            className={`flex items-center gap-3 p-4 rounded-xl font-medium transition-all ${
                                                isActive('/admin/genres/add')
                                                    ? 'bg-purple-600 text-white shadow-lg'
                                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                            }`}
                                        >
                                            <Tag size={20} />
                                            <span>Add Genre</span>
                                        </Link>
                                    </>
                                )}

                                <div className="mt-6 pt-6 border-t border-slate-700">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-4 rounded-xl transition-all font-medium border border-red-500/30"
                                    >
                                        <LogOut size={20} />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-3 pt-4">
                                <Link
                                    to="/login"
                                    onClick={closeMenu}
                                    className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition-all"
                                >
                                    <LogIn size={20} />
                                    <span>Login</span>
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={closeMenu}
                                    className="flex items-center justify-center w-full py-4 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/30"
                                >
                                    Create Account
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};