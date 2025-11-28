import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieService, genreService } from '../services/api';
import { MovieResponse, GenreResponse } from '../types';
import { Star, ArrowLeft, Tag, Film } from 'lucide-react';

export const Genres: React.FC = () => {
  const [genres, setGenres] = useState<GenreResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for selected genre view
  const [selectedGenre, setSelectedGenre] = useState<GenreResponse | null>(null);
  const [genreMovies, setGenreMovies] = useState<MovieResponse[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await genreService.getAll();
        setGenres(data);
      } catch (error) {
        console.error("Failed to fetch genres", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  const handleGenreClick = async (genre: GenreResponse) => {
    setSelectedGenre(genre);
    setLoadingMovies(true);
    try {
        const movies = await movieService.getByGenre(genre.id);
        setGenreMovies(movies);
    } catch (error) {
        console.error("Failed to fetch movies for genre", error);
    } finally {
        setLoadingMovies(false);
    }
  };

  const handleBack = () => {
    setSelectedGenre(null);
    setGenreMovies([]);
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-white">Loading...</div>;

  // View: List of Movies in Selected Genre
  if (selectedGenre) {
    return (
      <div className="space-y-8 animate-fade-in">
        <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
            <ArrowLeft size={20} /> Back to Genres
        </button>

        <div className="bg-brand-800 rounded-xl p-8 border border-brand-700 relative overflow-hidden">
             {selectedGenre.thumbnailUrl ? (
                 <div className="absolute inset-0 z-0">
                     <img src={selectedGenre.thumbnailUrl} alt={selectedGenre.name} className="w-full h-full object-cover opacity-20" />
                     <div className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-900/90 to-transparent"></div>
                 </div>
             ) : (
                <div className="absolute right-0 top-0 p-8 opacity-5 transform rotate-12">
                    <Tag size={150} />
                </div>
             )}
            <div className="relative z-10">
                <h1 className="text-4xl font-bold text-white mb-2">{selectedGenre.name}</h1>
                <p className="text-xl text-gray-400">{selectedGenre.description || `Explore our collection of ${selectedGenre.name} movies.`}</p>
                <div className="mt-4 inline-flex items-center gap-2 bg-brand-700 px-3 py-1 rounded-full text-xs font-medium text-brand-200">
                    {genreMovies.length} Titles Available
                </div>
            </div>
        </div>

        {loadingMovies ? (
             <div className="flex justify-center py-20"><div className="animate-spin h-10 w-10 border-4 border-brand-500 border-t-transparent rounded-full"></div></div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {genreMovies.map(movie => (
                  <Link 
                    to={`/movie/${movie.id}`} 
                    key={movie.id} 
                    className="group bg-brand-800 rounded-lg overflow-hidden border border-brand-700 hover:border-brand-500 transition-all hover:-translate-y-1 shadow-md block"
                  >
                    <div className="aspect-[2/3] overflow-hidden relative">
                      <img 
                         src={movie.posterUrl || `https://picsum.photos/seed/${movie.id + 100}/300/450`} 
                         alt={movie.title}
                         className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-8">
                        <div className="flex items-center gap-1 text-yellow-400 font-bold text-xs">
                           <Star size={12} fill="currentColor" />
                           {movie.rating ? movie.rating.toFixed(1) : 'N/A'}
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-white truncate mb-1" title={movie.title}>{movie.title}</h3>
                      <p className="text-xs text-gray-500">{movie.releaseYear}</p>
                    </div>
                  </Link>
                ))}
                {genreMovies.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-brand-800/50 rounded-xl border border-dashed border-brand-700">
                        <Film className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No movies found in this genre yet.</p>
                    </div>
                )}
            </div>
        )}
      </div>
    );
  }

  // View: List of Genres
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-brand-800 rounded-xl p-8 border border-brand-700">
        <h1 className="text-3xl font-bold text-white mb-2">Browse Categories</h1>
        <p className="text-gray-400">Select a genre to find your next favorite movie.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {genres.map(genre => (
          <div 
            key={genre.id}
            onClick={() => handleGenreClick(genre)}
            className="group cursor-pointer bg-brand-800 hover:bg-brand-750 p-6 rounded-xl border border-brand-700 hover:border-brand-500 transition-all hover:-translate-y-1 relative overflow-hidden"
          >
            {genre.thumbnailUrl && (
                <div className="absolute inset-0 z-0">
                    <img src={genre.thumbnailUrl} alt={genre.name} className="w-full h-full object-cover opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                </div>
            )}
            
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-white transform rotate-[-15deg] transition-transform group-hover:scale-110 group-hover:rotate-0">
               {genre.thumbnailUrl ? <img src={genre.thumbnailUrl} alt="" className="w-40 h-40 object-cover rounded-full blur-sm" /> : <Tag size={120} />}
            </div>
            
            <div className="relative z-10">
                <div className="w-12 h-12 bg-brand-700 rounded-lg flex items-center justify-center text-brand-400 mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                    {genre.thumbnailUrl ? <img src={genre.thumbnailUrl} alt="" className="w-full h-full object-cover rounded-lg" /> : <Film size={24} />}
                </div>
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">{genre.name}</h2>
                <p className="text-sm text-gray-400 line-clamp-2">{genre.description || "Discover movies in this category."}</p>
                <div className="mt-4 flex items-center gap-2 text-brand-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    Browse Movies <ArrowLeft size={16} className="rotate-180" />
                </div>
            </div>
          </div>
        ))}
      </div>
      
      {genres.length === 0 && (
        <div className="text-center text-gray-500 py-12">No genres found.</div>
      )}
    </div>
  );
};