import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userService, reviewService, movieService, commentService } from '../../services/api';
import { UserResponse, ReviewResponse, MovieResponse, CommentResponse } from '../../types';
import { ArrowLeft, Mail, Calendar, Shield, Ban, CheckCircle, Star, MessageSquare, Trash2, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [movies, setMovies] = useState<{[key: number]: MovieResponse}>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const userId = Number(id);
      try {
        const [userData, userReviews, userComments, allMovies] = await Promise.all([
          userService.getById(userId),
          reviewService.getByUser(userId),
          commentService.getByUser(userId),
          movieService.getAll()
        ]);
        
        setUser(userData);
        setReviews(userReviews);
        setComments(userComments);
        
        const movieMap: {[key: number]: MovieResponse} = {};
        allMovies.forEach(m => movieMap[m.id] = m);
        setMovies(movieMap);

      } catch (error) {
        console.error("Failed to fetch user details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleToggleBan = async () => {
    if (!user) return;
    if(!window.confirm(`Are you sure you want to ${user.banned ? 'unban' : 'ban'} this user?`)) return;
    
    try {
        const updatedUser = await userService.setBanned(user.id, !user.banned);
        setUser(updatedUser);
    } catch (e) {
        alert("Failed to update ban status");
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if(!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;
    try {
        await reviewService.delete(reviewId);
        setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (e) {
        alert("Failed to delete review");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if(!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
        await commentService.delete(commentId);
        setComments(comments.filter(c => c.id !== commentId));
    } catch (e) {
        alert("Failed to delete comment");
    }
  }

  // Activity Chart Data
  const chartData = useMemo(() => {
    const grouped: {[key: string]: {reviews: number, comments: number}} = {};
    
    // Process Reviews
    reviews.forEach(r => {
        if(r.createdAt) {
            const date = new Date(r.createdAt);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!grouped[key]) grouped[key] = { reviews: 0, comments: 0 };
            grouped[key].reviews++;
        }
    });

    // Process Comments
    comments.forEach(c => {
        if(c.createdAt) {
            const date = new Date(c.createdAt);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!grouped[key]) grouped[key] = { reviews: 0, comments: 0 };
            grouped[key].comments++;
        }
    });

    return Object.entries(grouped)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => a.name.localeCompare(b.name));
  }, [reviews, comments]);

  if (loading) return <div className="text-center text-white pt-10">Loading...</div>;
  if (!user) return <div className="text-center text-white pt-10">User not found</div>;

  return (
    <div className="space-y-8 animate-fade-in">
        <Link to="/admin/users" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={18} className="mr-2" /> Back to User List
        </Link>

        {/* User Profile Card */}
        <div className="bg-brand-800 rounded-xl border border-brand-700 overflow-hidden p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-brand-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-brand-700">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-white">{user.username}</h1>
                            {user.banned && (
                                <span className="bg-red-900/50 text-red-400 text-xs px-2 py-0.5 rounded-full border border-red-900 font-medium">BANNED</span>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-2">
                            <span className="flex items-center gap-1"><Mail size={14} /> {user.email}</span>
                            <span className="flex items-center gap-1"><Shield size={14} /> {user.role || 'USER'}</span>
                            <span className="flex items-center gap-1"><Calendar size={14} /> Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {user.role !== 'ADMIN' && (
                    <button 
                        onClick={handleToggleBan}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                            user.banned 
                            ? 'bg-green-600 hover:bg-green-500 text-white' 
                            : 'bg-red-600 hover:bg-red-500 text-white'
                        }`}
                    >
                        {user.banned ? <CheckCircle size={18} /> : <Ban size={18} />}
                        {user.banned ? 'Unban User' : 'Ban User'}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-brand-700">
                 <div className="bg-brand-900/50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-brand-400">{reviews.length}</p>
                    <p className="text-xs text-gray-500 uppercase">Reviews Posted</p>
                 </div>
                 <div className="bg-brand-900/50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-brand-accent">{comments.length}</p>
                    <p className="text-xs text-gray-500 uppercase">Comments Posted</p>
                 </div>
            </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-brand-800 p-6 rounded-xl border border-brand-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Activity size={18} /> Activity Over Time
            </h3>
            {chartData.length > 0 ? (
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
                                itemStyle={{ color: '#60a5fa' }}
                            />
                            <Legend />
                            <Bar dataKey="reviews" fill="#60a5fa" name="Reviews" stackId="a" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="comments" fill="#f43f5e" name="Comments" stackId="a" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="h-[200px] flex items-center justify-center text-gray-500">
                    No activity data available.
                </div>
            )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
            {/* User Reviews List */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Star size={20} className="text-brand-400"/> Review History
                </h2>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {reviews.length > 0 ? reviews.map(review => (
                        <div key={review.id} className="bg-brand-800 p-6 rounded-xl border border-brand-700 relative group">
                            <button 
                                onClick={() => handleDeleteReview(review.id)}
                                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-400 hover:bg-brand-700 rounded-md transition-all opacity-0 group-hover:opacity-100"
                                title="Delete Review"
                            >
                                <Trash2 size={16} />
                            </button>
                            <div className="flex justify-between items-start mb-3 pr-8">
                                 <Link to={`/movie/${review.movieId}`} className="text-lg font-bold text-white hover:text-brand-400 transition-colors">
                                    {movies[review.movieId]?.title || `Movie #${review.movieId}`}
                                 </Link>
                                 <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} />
                                    ))}
                                 </div>
                            </div>
                            <p className="text-gray-300 text-sm mb-2">{review.content}</p>
                            <p className="text-xs text-gray-500 text-right">
                                {review.createdAt ? new Date(review.createdAt).toLocaleString() : ''}
                            </p>
                        </div>
                    )) : (
                        <div className="text-gray-500 text-center py-8 bg-brand-800 rounded-xl border border-brand-700 border-dashed">No reviews found.</div>
                    )}
                </div>
            </div>

             {/* User Comments List */}
             <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <MessageSquare size={20} className="text-brand-accent"/> Comment History
                </h2>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {comments.length > 0 ? comments.map(comment => (
                        <div key={comment.id} className="bg-brand-800 p-6 rounded-xl border border-brand-700 relative group">
                            <button 
                                onClick={() => handleDeleteComment(comment.id)}
                                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-400 hover:bg-brand-700 rounded-md transition-all opacity-0 group-hover:opacity-100"
                                title="Delete Comment"
                            >
                                <Trash2 size={16} />
                            </button>
                            <div className="mb-3 pr-8">
                                 <div className="text-sm text-gray-400 mb-1">
                                    Commented on review #{comment.reviewId}
                                 </div>
                                 <p className="text-gray-200 text-sm">{comment.content}</p>
                            </div>
                            <p className="text-xs text-gray-500 text-right">
                                {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}
                            </p>
                        </div>
                    )) : (
                        <div className="text-gray-500 text-center py-8 bg-brand-800 rounded-xl border border-brand-700 border-dashed">No comments found.</div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};