import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { MovieDetail } from './pages/MovieDetail';
import { Film, UserCircle } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-brand-900/80 backdrop-blur-md border-b border-brand-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-brand-accent p-1.5 rounded-lg">
              <Film className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Cine<span className="text-brand-400">Rate</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm">
                <UserCircle size={20} />
                <span className="hidden md:inline">Demo User</span>
            </button>
            <Link to="/" className="bg-brand-700 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
                Browse Movies
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer: React.FC = () => (
    <footer className="bg-brand-900 border-t border-brand-800 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-500 text-sm">© 2024 CineRate. All rights reserved.</p>
            <p className="text-gray-600 text-xs mt-2">Connected to Spring Boot Backend at port 8080</p>
        </div>
    </footer>
)

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-brand-900 text-gray-100 font-sans flex flex-col">
        <Navbar />
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
