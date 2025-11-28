import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { genreService } from '../../services/api';
import { Tag, FileText, Plus, Image } from 'lucide-react';

export const AddGenre: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await genreService.create({
        name,
        description,
        thumbnailUrl
      });
      navigate('/genres');
    } catch (error) {
      console.error("Failed to create genre", error);
      alert("Failed to create genre. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-brand-800 rounded-xl border border-brand-700 shadow-xl overflow-hidden">
        <div className="bg-brand-900/50 px-8 py-6 border-b border-brand-700">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Plus className="text-brand-400" /> Add New Genre
          </h1>
          <p className="text-gray-400 text-sm mt-1">Create a new movie category with a thumbnail.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Genre Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="block w-full pl-10 bg-brand-900 border border-brand-700 rounded-lg py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                placeholder="e.g. Sci-Fi"
              />
            </div>
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Thumbnail URL</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Image className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="url"
                value={thumbnailUrl}
                onChange={e => setThumbnailUrl(e.target.value)}
                className="block w-full pl-10 bg-brand-900 border border-brand-700 rounded-lg py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                placeholder="https://example.com/genre-image.jpg"
              />
            </div>
            {thumbnailUrl && (
                <div className="mt-2 h-32 w-full rounded-lg overflow-hidden border border-brand-700">
                    <img src={thumbnailUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')}/>
                </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FileText className="h-5 w-5 text-gray-500" />
              </div>
              <textarea
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="block w-full pl-10 bg-brand-900 border border-brand-700 rounded-lg py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                placeholder="Description of the genre..."
              />
            </div>
          </div>

          <div className="pt-6 border-t border-brand-700 flex justify-end gap-4">
             <button
                type="button"
                onClick={() => navigate('/genres')}
                className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-brand-700 transition-colors"
             >
                Cancel
             </button>
             <button
                type="submit"
                disabled={loading}
                className="bg-brand-500 hover:bg-brand-400 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-brand-500/30 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
             >
                {loading ? 'Creating...' : 'Create Genre'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};