
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Calendar, User, MessageSquare, ArrowLeft, Send, Film } from 'lucide-react';
import { movieService, reviewService, commentService } from '../services/api';
import { MovieResponse, ReviewResponse, CommentResponse } from '../types';
import { RatingChart } from '../components/Visuals';
import { useAuth } from '../context/AuthContext';

export const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieResponse | null>(null);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Review Form State
  const [newReviewContent, setNewReviewContent] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  
  // Comment Form State (tracked by review ID)
  const [activeCommentInput, setActiveCommentInput] = useState<number | null>(null);
  const [commentInputs, setCommentInputs] = useState<{[key: number]: string}>({});
  const [commentsMap, setCommentsMap] = useState<{[key: number]: CommentResponse[]}>({});

  const movieId = Number(id);

  const loadData = useCallback(async () => {
    try {
      const movieData = await movieService.getById(movieId);
      setMovie(movieData);

      const reviewsData = await reviewService.getByMovie(movieId);
      setReviews(reviewsData);
      
      // Load comments for all reviews
      reviewsData.forEach(async (r) => {
          try {
            const comments = await commentService.getByReview(r.id);
            setCommentsMap(prev => ({...prev, [r.id]: comments}));
          } catch(e) { /* ignore */ }
      });

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Please login to review");
    
    try {
        await reviewService.create({
            movieId,
            userId: user.id,
            content: newReviewContent,
            rating: newReviewRating
        });
        setNewReviewContent('');
        await loadData(); // Refresh
    } catch (e) {
        alert('Failed to post review');
    }
  };

  const handlePostComment = async (reviewId: number) => {
    const content = commentInputs[reviewId];
    if(!content) return;
    if (!user) return alert("Please login to comment");
    
    try {
        await commentService.create({
            reviewId,
            userId: user.id,
            content
        });
        setCommentInputs(prev => ({...prev, [reviewId]: ''}));
        // Refresh comments for this review
        const updatedComments = await commentService.getByReview(reviewId);
        setCommentsMap(prev => ({...prev, [reviewId]: updatedComments}));
    } catch (e) {
        alert("Failed to post comment");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-white">Loading...</div>;
  if (!movie) return <div className="text-center text-white pt-20">Movie not found</div>;

  return (
    <div className="animate-fade-in">
      <Link to="/movies" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={18} className="mr-2" /> Back to Movies
      </Link>

      {/* Movie Header */}
      <div className="bg-brand-800 rounded-2xl overflow-hidden border border-brand-700 shadow-2xl mb-8">
        <div className="grid md:grid-cols-3 gap-0">
            <div className="md:col-span-1 h-[400px] md:h-auto relative">
                <img 
                    src={movie.posterUrl || `https://picsum.photos/seed/${movie.id + 100}/500/750`} 
                    alt={movie.title}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="md:col-span-2 p-8 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Film size={300} />
                </div>
                <div className="relative z-10">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        {movie.genres && movie.genres.length > 0 ? (
                           movie.genres.map(g => (
                            <span key={g.id} className="bg-brand-accent px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                                {g.name}
                            </span>
                           ))
                        ) : (
                            <span className="bg-brand-700 px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                                Movie
                            </span>
                        )}
                        <span className="flex items-center gap-1 text-gray-300 text-sm ml-2">
                            <Calendar size={14} /> {movie.releaseYear}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{movie.title}</h1>
                    <p className="text-gray-400 text-lg mb-6 leading-relaxed">{movie.description}</p>
                    
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500 uppercase tracking-wider">Actors</span>
                            <span className="text-white font-medium">{movie.actors || 'N/A'}</span>
                        </div>
                        <div className="h-10 w-px bg-brand-700"></div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500 uppercase tracking-wider">Rating</span>
                            <div className="flex items-center gap-2">
                                <Star className="text-yellow-400 fill-yellow-400" size={20} />
                                <span className="text-2xl font-bold text-white">{movie.rating?.toFixed(1) || 'N/A'}</span>
                                <span className="text-sm text-gray-500">/ 5 ({movie.totalRate || 0})</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Reviews Section */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-end border-b border-brand-700 pb-4">
                <h2 className="text-2xl font-bold text-white">Reviews <span className="text-gray-500 text-lg ml-2">({reviews.length})</span></h2>
            </div>

            {/* Add Review Form */}
            <form onSubmit={handlePostReview} className="bg-brand-800 p-6 rounded-xl border border-brand-700">
                <h3 className="text-lg font-semibold text-white mb-4">Write a Review</h3>
                <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Your Rating</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button 
                                key={star} 
                                type="button"
                                onClick={() => setNewReviewRating(star)}
                                className="focus:outline-none"
                            >
                                <Star 
                                    size={24} 
                                    className={star <= newReviewRating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} 
                                />
                            </button>
                        ))}
                    </div>
                </div>
                <textarea
                    value={newReviewContent}
                    onChange={e => setNewReviewContent(e.target.value)}
                    placeholder="Share your thoughts on this movie..."
                    className="w-full bg-brand-900 border border-brand-700 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-brand-500 min-h-[100px] mb-4"
                    required
                />
                <div className="flex justify-end">
                    <button type="submit" className="bg-brand-500 hover:bg-brand-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                        <Send size={16} /> Post Review
                    </button>
                </div>
            </form>

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.map(review => (
                    <div key={review.id} className="bg-brand-800 rounded-xl border border-brand-700 p-6">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-700 flex items-center justify-center text-brand-400 font-bold">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-white font-medium">User #{review.userId}</p>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={12} className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <span className="text-xs text-gray-500">
                                {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Just now'}
                            </span>
                        </div>
                        
                        <p className="text-gray-300 mb-4 pl-12">{review.content}</p>

                        {/* Comments Section */}
                        <div className="pl-12 pt-4 border-t border-brand-700/50">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 cursor-pointer hover:text-brand-400 transition-colors" 
                                 onClick={() => setActiveCommentInput(activeCommentInput === review.id ? null : review.id)}>
                                <MessageSquare size={14} />
                                <span>{commentsMap[review.id]?.length || 0} Comments</span>
                            </div>

                            {activeCommentInput === review.id && (
                                <div className="animate-fade-in-down">
                                    {commentsMap[review.id]?.map(comment => (
                                        <div key={comment.id} className="bg-brand-900/50 p-3 rounded-lg mb-2 border border-brand-700/30">
                                            <div className="flex justify-between">
                                                <span className="text-xs font-bold text-brand-400">User #{comment.userId}</span>
                                                <span className="text-[10px] text-gray-600">
                                                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Just now'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-300 mt-1">{comment.content}</p>
                                        </div>
                                    ))}
                                    
                                    <div className="flex gap-2 mt-3">
                                        <input 
                                            type="text" 
                                            value={commentInputs[review.id] || ''}
                                            onChange={(e) => setCommentInputs(prev => ({...prev, [review.id]: e.target.value}))}
                                            placeholder="Write a comment..."
                                            className="flex-grow bg-brand-900 border border-brand-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                                        />
                                        <button 
                                            onClick={() => handlePostComment(review.id)}
                                            className="bg-brand-700 hover:bg-brand-600 text-white px-3 py-2 rounded-md text-sm"
                                        >
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {reviews.length === 0 && <div className="text-center text-gray-500 py-8">No reviews yet. Be the first!</div>}
            </div>
        </div>

        {/* Sidebar Statistics */}
        <div className="lg:col-span-1">
            <div className="bg-brand-800 p-6 rounded-xl border border-brand-700 sticky top-6">
                <h3 className="text-lg font-semibold text-white mb-4">Rating Distribution</h3>
                <RatingChart reviews={reviews} />
                
                <div className="mt-6 pt-6 border-t border-brand-700">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Facts</h4>
                    <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-gray-500">Total Reviews</dt>
                            <dd className="text-white font-medium">{reviews.length}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-gray-500">Avg Score</dt>
                            <dd className="text-yellow-400 font-bold">{movie.rating?.toFixed(1) || 0}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
