'use client';

// Import necessary dependencies and types
import { Song } from '@/lib/types';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion'; // For animations
import { ThumbsUp, ThumbsDown, Play } from 'lucide-react'; // Icons
import YouTube from 'react-youtube';
import { useState, useRef } from 'react';

// Props type definition for the SongList component
type SongListProps = {
  playlistId: string;     // ID of the playlist
  songs: Song[];          // Array of songs in the playlist
  onPlay?: (videoId: string) => void;  // Callback when a song is played
};

// Component for displaying and managing a list of songs
export default function SongList({ playlistId, songs, onPlay }: SongListProps) {
  const voteSong = useStore((state) => state.voteSong);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(-1);
  const playNextRef = useRef<{ element: HTMLDivElement | null; fn: () => void }>({
    element: null,
    fn: () => {
      if (currentSongIndex < songs.length - 1) {
        const nextIndex = currentSongIndex + 1;
        setCurrentSongIndex(nextIndex);
        onPlay?.(songs[nextIndex]!.url);
      }
    }
  });

  const handleVote = (songId: string, value: number) => {
    voteSong(playlistId, songId, value);
  };

  const handlePlay = (songId: string) => {
    const index = songs.findIndex(s => s.url === songId);
    setCurrentSongIndex(index);
    onPlay?.(songId);
  };

  return (
    <div 
      className="space-y-4" 
      data-songlist 
      ref={(el) => {
        playNextRef.current.element = el;
        if (el) {
          (el as any).playNextFn = playNextRef.current.fn;
        }
      }}
    >

      {songs.map((song) => (
        <motion.div
          key={song.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 bg-zinc-800/50 p-4 rounded-lg border border-zinc-700/50"
        >
          <img
            src={song.thumbnail}
            alt={song.title}
            className="w-16 h-16 object-cover rounded"
          />
          
          <div className="flex-1">
            <h3 className="font-medium text-white">{song.title}</h3>
            <p className="text-sm text-zinc-400">
              Added {new Date(song.addedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleVote(song.id, 1)}
              className={`p-2 hover:bg-zinc-700 rounded-full transition-colors ${
                localStorage.getItem(`vote_${playlistId}_${song.id}`) === '1' 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : ''
              }`}
            >
              <ThumbsUp size={20} className={
                localStorage.getItem(`vote_${playlistId}_${song.id}`) === '1'
                  ? 'text-white'
                  : 'text-zinc-400'
              } />
            </button>
            <span className="text-zinc-400 min-w-[3ch] text-center">
              {song.votes}
            </span>
            <button
              onClick={() => handleVote(song.id, -1)}
              className={`p-2 hover:bg-zinc-700 rounded-full transition-colors ${
                localStorage.getItem(`vote_${playlistId}_${song.id}`) === '-1'
                  ? 'bg-red-600 hover:bg-red-700'
                  : ''
              }`}
            >
              <ThumbsDown size={20} className={
                localStorage.getItem(`vote_${playlistId}_${song.id}`) === '-1'
                  ? 'text-white'
                  : 'text-zinc-400'
              } />
            </button>
            <button
              onClick={() => handlePlay(song.url)}
              className="p-2 hover:bg-purple-700 bg-purple-600 rounded-full transition-colors ml-4"
            >
              <Play size={20} className="text-white" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
