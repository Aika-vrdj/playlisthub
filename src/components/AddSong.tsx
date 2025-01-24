'use client';

// Import necessary dependencies
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Plus } from 'lucide-react';

// Props type definition - requires a playlist ID
type AddSongProps = {
  playlistId: string;
};

// Component for adding new songs to a playlist
export default function AddSong({ playlistId }: AddSongProps) {
  // State to store the YouTube URL input
  const [url, setUrl] = useState('');
  // Get the addSong function from the global store
  const addSong = useStore((state) => state.addSong);

  // Handle form submission when adding a new song
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Extract video ID from YouTube URL
    const videoId = url.split('v=')[1]?.split('&')[0];
    if (!videoId) {
      alert('Please enter a valid YouTube URL');
      return;
    }

    // Create new song
    const song = {
      id: Math.random().toString(36).substring(7),
      title: 'YouTube Video', // In a real app, we'd fetch this from YouTube API
      url: videoId,
      thumbnail: `https://img.youtube.com/vi/${videoId}/0.jpg`,
      votes: 0,
      addedAt: Date.now()
    };

    addSong(playlistId, song);
    setUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
      <input
        type="text"
        placeholder="Paste YouTube video URL"
        className="flex-1 px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        type="submit"
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
      >
        <Plus size={20} />
        Add Song
      </button>
    </form>
  );
}
