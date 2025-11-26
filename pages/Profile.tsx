import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reviewService, movieService } from '../services/api';
import { ReviewResponse, MovieResponse } from '../types';
import { User, Mail, Shield, Calendar, Star, Film } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [movies, setMovies] = useState<{[key: number]: MovieResponse}>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [userReviews, allMovies] = await Promise.all([
            reviewService.getByUser(user.id),
            movieService.getAll()
        ]);
        
        setReviews(userReviews);
        
        // Map movies for easy access
        const movieMap: {[key: number]: MovieResponse} = {};
        allMovies.forEach(m => movieMap[m.id] = m);
        setMovies(movieMap);

      } catch (error) {
        console.error("Failed to load profile data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (!user) return <div className="text-center pt-20 text-white">Please login to view profile.</div>;
  if (loading) return <div className="flex h-screen items-center justify-center text-white">Loading...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Profile Header */}
      <div className="bg-brand-800 rounded-xl border border-brand-700 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-brand-700 to-brand-900"></div>
        <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
                <div className="flex items-end gap-6">
                    <div className="w-24 h-24 rounded-full bg-brand-600 border-4 border-brand-800 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="mb-1">
                        <h1 className="text-3xl font-bold text-white">{user.username}</h1>
                        <p className="text-brand-400">{user.role}</p>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-brand-700 pt-6">
                <div className="flex items-center gap-3 text-gray-300">
                    <div className="p-2 bg-brand-900 rounded-lg"><Mail size={20} /></div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase">Email</p>
                        <p className="font-medium">{user.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                    <div className="p-2 bg-brand-900 rounded-lg"><Shield size={20} /></div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase">Role</p>
                        <p className="font-medium">{user.role}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                    <div className="p-2 bg-brand-900 rounded-lg"><User size={20} /></div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase">User ID</p>
                        <p className="font-medium">#{user.id}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Reviews History */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Film className="text-brand-400" />
            My Reviews <span className="text-gray-500 text-lg font-normal">({reviews.length})</span>
        </h2>
        
        {reviews.length > 0 ? (
            <div className="grid gap-6">
                {reviews.map(review => {
                    const movie = movies[review.movieId];
                    return (
                        <div key={review.id} className="bg-brand-800 rounded-lg p-6 border border-brand-700 hover:border-brand-500 transition-colors flex gap-6">
                            <Link to={`/movie/${review.movieId}`} className="shrink-0 w-24 h-36 bg-brand-900 rounded-md overflow-hidden hidden sm:block">
                                {movie ? (
                                    <img 
                                        src={movie.posterUrl || `https://picsum.photos/seed/${movie.id + 100}/200/300`} 
                                        alt={movie.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600"><Film /></div>
                                )}
                            </Link>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <Link to={`/movie/${review.movieId}`} className="text-xl font-bold text-white hover:text-brand-400 transition-colors">
                                        {movie ? movie.title : `Movie #${review.movieId}`}
                                    </Link>
                                    <span className="text-xs text-gray-500">
                                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Unknown date'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} />
                                    ))}
                                    <span className="ml-2 text-gray-400 text-sm">{review.rating}/5</span>
                                </div>
                                <p className="text-gray-300 bg-brand-900/50 p-4 rounded-lg italic border border-brand-700/50">
                                    "{review.content}"
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        ) : (
            <div className="bg-brand-800 rounded-xl p-12 text-center border border-brand-700 border-dashed">
                <div className="w-16 h-16 bg-brand-900 rounded-full flex items-center justify-center text-gray-500 mx-auto mb-4">
                    <Star size={32} />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">No reviews yet</h3>
                <p className="text-gray-400 mb-6">You haven't rated any movies yet.</p>
                <Link to="/movies" className="bg-brand-500 hover:bg-brand-400 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    Browse Movies
                </Link>
            </div>
        )}
      </div>
    </div>
  );
};