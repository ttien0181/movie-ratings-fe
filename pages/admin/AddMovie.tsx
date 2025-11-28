import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { movieService, genreService } from '../../services/api';
import { GenreResponse } from '../../types';
import { Film, Calendar, FileText, Image, Users, Plus, Check } from 'lucide-react';

export const AddMovie: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<GenreResponse[]>([]);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [releaseYear, setReleaseYear] = useState(new Date().getFullYear());
  const [posterUrl, setPosterUrl] = useState('');
  const [actors, setActors] = useState('');
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await genreService.getAll();
        setGenres(data);
      } catch (error) {
        console.error("Failed to fetch genres", error);
      }
    };
    fetchGenres();
  }, []);

  const toggleGenre = (id: number) => {
    setSelectedGenreIds(prev => 
      prev.includes(id) ? prev.filter(gId => gId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await movieService.create({
        title,
        description,
        releaseYear,
        posterUrl,
        actors,
        genreIds: selectedGenreIds
      });
      navigate('/movies');
    } catch (error) {
      console.error("Failed to create movie", error);
      alert("Failed to create movie. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="bg-brand-800 rounded-xl border border-brand-700 shadow-xl overflow-hidden">
        <div className="bg-brand-900/50 px-8 py-6 border-b border-brand-700">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Plus className="text-brand-400" /> Add New Movie
          </h1>
          <p className="text-gray-400 text-sm mt-1">Create a new entry in the database.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Movie Title</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Film className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="block w-full pl-10 bg-brand-900 border border-brand-700 rounded-lg py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  placeholder="e.g. Inception"
                />
              </div>
            </div>

            {/* Release Year */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Release Year</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="number"
                  required
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  value={releaseYear}
                  onChange={e => setReleaseYear(Number(e.target.value))}
                  className="block w-full pl-10 bg-brand-900 border border-brand-700 rounded-lg py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </div>

            {/* Poster URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Poster URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Image className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="url"
                  value={posterUrl}
                  onChange={e => setPosterUrl(e.target.value)}
                  className="block w-full pl-10 bg-brand-900 border border-brand-700 rounded-lg py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  placeholder="https://example.com/poster.jpg"
                />
              </div>
            </div>

            {/* Actors */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Cast / Actors</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  value={actors}
                  onChange={e => setActors(e.target.value)}
                  className="block w-full pl-10 bg-brand-900 border border-brand-700 rounded-lg py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  placeholder="e.g. Leonardo DiCaprio, Joseph Gordon-Levitt"
                />
              </div>
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-500" />
                </div>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="block w-full pl-10 bg-brand-900 border border-brand-700 rounded-lg py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  placeholder="Movie synopsis..."
                />
              </div>
            </div>

            {/* Genres */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-3">Select Genres</label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar p-1">
                {genres.map(genre => {
                  const isSelected = selectedGenreIds.includes(genre.id);
                  return (
                    <button
                      key={genre.id}
                      type="button"
                      onClick={() => toggleGenre(genre.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        isSelected 
                          ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20 ring-1 ring-brand-400' 
                          : 'bg-brand-900 text-gray-400 border border-brand-700 hover:border-brand-500 hover:text-white'
                      }`}
                    >
                      {isSelected && <Check size={14} />}
                      {genre.name}
                    </button>
                  );
                })}
              </div>
              {selectedGenreIds.length === 0 && <p className="text-xs text-red-400 mt-2">Please select at least one genre.</p>}
            </div>
          </div>

          <div className="pt-6 border-t border-brand-700 flex justify-end gap-4">
             <button
                type="button"
                onClick={() => navigate('/movies')}
                className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-brand-700 transition-colors"
             >
                Cancel
             </button>
             <button
                type="submit"
                disabled={loading}
                className="bg-brand-500 hover:bg-brand-400 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-brand-500/30 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
             >
                {loading ? 'Creating...' : 'Create Movie'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};