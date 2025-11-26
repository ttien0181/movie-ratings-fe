import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { MovieDetail } from './pages/MovieDetail';
import { Landing } from './pages/Landing';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { Genres } from './pages/Genres';
import { Profile } from './pages/Profile';
import { Navbar } from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';

const Footer: React.FC = () => (
    <footer className="bg-brand-900 border-t border-brand-800 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-500 text-sm">© 2024 CineRate. All rights reserved.</p>
            <p className="text-gray-600 text-xs mt-2">Connected to Spring Boot Backend at /movie-ratings</p>
        </div>
    </footer>
)

// Wrapper to redirect to landing if not logged in when accessing protected routes
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

const AppContent: React.FC = () => {
    return (
        <div className="min-h-screen bg-brand-900 text-gray-100 font-sans flex flex-col">
            <Navbar />
            <main className="flex-grow w-full">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                {/* Protected Routes */}
                <Route path="/movies" element={<ProtectedRoute><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><Home /></div></ProtectedRoute>} />
                <Route path="/movie/:id" element={<ProtectedRoute><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><MovieDetail /></div></ProtectedRoute>} />
                <Route path="/genres" element={<ProtectedRoute><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><Genres /></div></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><Profile /></div></ProtectedRoute>} />
              </Routes>
            </main>
            <Footer />
        </div>
    );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
        <HashRouter>
            <AppContent />
        </HashRouter>
    </AuthProvider>
  );
};

export default App;