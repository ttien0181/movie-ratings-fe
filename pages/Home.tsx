import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Film } from 'lucide-react';
import { movieService, genreService } from '../services/api';
import { MovieResponse, GenreResponse } from '../types';
import { GenreBubbles } from '../components/Visuals';

export const Home: React.FC = () => {
  const [movies, setMovies] = useState<MovieResponse[]>([]);
  const [genres, setGenres] = useState<GenreResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesData, genresData] = await Promise.all([
          movieService.getAll(),
          genreService.getAll()
        ]);
        setMovies(moviesData);
        setGenres(genresData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Create a map for easy genre name lookup since movie only has genreId
  const genreMap = useMemo(() => {
    const map: Record<number, string> = {};
    genres.forEach(g => map[g.id] = g.name);
    return map;
  }, [genres]);

  const filteredMovies = movies.filter(m => {
    const matchesGenre = selectedGenre ? m.genreId === selectedGenre : true;
    // Check title or actors
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (m.actors && m.actors.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGenre && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative bg-brand-800 rounded-2xl overflow-hidden border border-brand-700 shadow-2xl p-6 md:p-12">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Film size={200} />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Discover <span className="text-brand-accent">Cinema</span>
          </h1>
          <p className="text-brand-400 text-lg max-w-xl mb-8">
            Rate, review, and explore the world's finest collection of movies. Join the community today.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search movies, actors..."
                className="w-full bg-brand-900 border border-brand-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Visual Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-white">Recent Uploads</h2>
            <span className="text-sm text-gray-400">{filteredMovies.length} Movies found</span>
           </div>
           
           {loading ? (
             <div className="flex justify-center p-12"><div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full"></div></div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredMovies.map(movie => (
                 <Link to={`/movie/${movie.id}`} key={movie.id} className="group bg-brand-800 rounded-xl overflow-hidden border border-brand-700 hover:border-brand-500 transition-all hover:-translate-y-1 shadow-lg">
                   <div className="aspect-[2/3] overflow-hidden relative">
                     <img 
                        src={movie.posterUrl || `https://picsum.photos/seed/${movie.id + 100}/400/600`} 
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                     />
                     <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 text-yellow-400 font-bold border border-white/10">
                        <Star size={14} fill="currentColor" />
                        {movie.rating ? movie.rating.toFixed(1) : 'N/A'}
                     </div>
                   </div>
                   <div className="p-4">
                     <h3 className="font-bold text-lg text-white truncate mb-1">{movie.title}</h3>
                     <div className="flex justify-between items-center text-sm text-gray-400">
                        <span>{movie.releaseYear}</span>
                        <span className="bg-brand-700 px-2 py-0.5 rounded text-xs text-brand-200">
                            {genreMap[movie.genreId] || 'General'}
                        </span>
                     </div>
                   </div>
                 </Link>
               ))}
               {filteredMovies.length === 0 && (
                 <div className="col-span-full text-center py-12 text-gray-500">
                   No movies found matching your criteria.
                 </div>
               )}
             </div>
           )}
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <div>
             <h3 className="text-lg font-semibold text-white mb-3">Browse by Genre</h3>
             <GenreBubbles 
                genres={genres} 
                onSelectGenre={setSelectedGenre} 
                selectedGenreId={selectedGenre} 
             />
          </div>
          
          <div className="bg-brand-800 p-6 rounded-xl border border-brand-700">
            <h3 className="text-lg font-semibold text-white mb-3">Platform Stats</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-brand-900 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-brand-400">{movies.length}</p>
                    <p className="text-xs text-gray-500 uppercase">Movies</p>
                </div>
                <div className="bg-brand-900 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-brand-accent">{genres.length}</p>
                    <p className="text-xs text-gray-500 uppercase">Genres</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
