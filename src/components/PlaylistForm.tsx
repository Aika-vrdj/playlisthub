'use client';

// Import necessary dependencies
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion'; // For animations
import { Music, Save } from 'lucide-react'; // Icons
import { useRouter } from 'next/navigation';

// Available music categories for playlists
const categories = ['Pop', 'Rock', 'EDM', 'Hip-Hop', 'Jazz', 'Classical', 'Other'];

// Component for creating new playlists
export default function PlaylistForm() {
  const router = useRouter();
  const addPlaylist = useStore((state) => state.addPlaylist);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: string;
  }>({
    title: '',
    description: '',
    category: 'Pop' // Explicitly set default category
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const playlistId = Math.random().toString(36).substring(7);
    const playlist = {
      id: playlistId,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      createdBy: 'user',
      createdAt: Date.now(),
      songs: []
    };
    addPlaylist(playlist);
    
    // In a real app, we would handle file creation server-side
    // For now, we'll just navigate to the playlist page
    router.push('/');
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-2xl mx-auto bg-zinc-800/50 p-8 rounded-xl backdrop-blur-sm border border-zinc-700/50"
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-200">Playlist Title</label>
        <input
          type="text"
          required
          className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-200">Description</label>
        <textarea
          className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-200">Category</label>
        <select
          className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
      >
        <Save size={20} />
        Create Playlist
      </button>
    </motion.form>
  );
}
