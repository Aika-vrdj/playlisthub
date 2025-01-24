'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Playlist, Song, User } from './types';
import { supabase } from './supabase';

// Define the structure of our application's state
interface AppState {
  playlists: Playlist[];
  users: User[];
  currentUser: User | null;
  addPlaylist: (playlist: Playlist) => void;
  addSong: (playlistId: string, song: Song) => void;
  voteSong: (playlistId: string, songId: string, value: number) => void;
  setCurrentUser: (user: User | null) => void;
}

const defaultPlaylists: Playlist[] = [
  {
    id: 'edm-hits',
    title: 'EDM Hits',
    description: 'Top electronic dance music hits',
    category: 'EDM',
    createdBy: 'system',
    createdAt: Date.now(),
    songs: [],
    isPreset: true
  },
  {
    id: 'community-favorites',
    title: 'Community Favorites',
    description: 'A collection of community-curated songs',
    category: 'Mixed',
    createdBy: 'community',
    createdAt: Date.now(),
    songs: [],
    isPreset: false
  },
  {
    id: 'rock-classics',
    title: 'Rock Classics',
    description: 'Timeless rock anthems',
    category: 'Rock',
    createdBy: 'system',
    createdAt: Date.now(),
    songs: [],
    isPreset: true
  },
  {
    id: 'pop-hits',
    title: 'Pop Hits',
    description: 'Current pop music favorites',
    category: 'Pop',
    createdBy: 'system',
    createdAt: Date.now(),
    songs: [],
    isPreset: true
  }
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      playlists: defaultPlaylists,
      users: [],
      currentUser: null,
      addPlaylist: (playlist) => {
        // Create the playlist page file
        const pageContent = `
'use client';
import { useStore } from '@/lib/store';
import { Music, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import AddSong from '@/components/AddSong';
import SongList from '@/components/SongList';

export default function PlaylistPage() {
  const playlist = useStore((state) => 
    state.playlists.find((p) => p.id === '${playlist.id}')
  );

  if (!playlist) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black text-white p-8">
      <header className="max-w-6xl mx-auto mb-12">
        <div className="flex justify-between items-center">
          <Link 
            href="/"
            className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
          >
            Playlist Collaborator
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8"
        >
          <ArrowLeft size={20} />
          Back to Playlists
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{playlist.title}</h1>
          <p className="text-zinc-400">{playlist.description}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-zinc-800 text-sm">
              {playlist.category}
            </span>
            <span className="text-zinc-400 text-sm">
              Created {new Date(playlist.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <AddSong playlistId={playlist.id} />
        <SongList playlistId={playlist.id} songs={playlist.songs} />
      </main>
    </div>
  );
}`;

        // In a real app, we would handle file creation server-side
        // For now, we'll just update the store

        set((state) => ({
          playlists: [...state.playlists, playlist]
        }));
      },
      addSong: async (playlistId, song) => {
        try {
          const { data, error } = await supabase
            .from('songs')
            .insert([{ ...song, playlist_id: playlistId }])
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            playlists: state.playlists.map((p) =>
              p.id === playlistId
                ? { ...p, songs: [...p.songs, data] }
                : p
            )
          }));
        } catch (error) {
          console.error('Error adding song:', error);
        }
      },
      voteSong: async (playlistId, songId, value) => {
        try {
          const voteKey = `vote_${playlistId}_${songId}`;
          const hasVoted = localStorage.getItem(voteKey);
          
          if (hasVoted === String(value)) {
            // Remove vote
            localStorage.removeItem(voteKey);
            
            const { error } = await supabase
              .from('song_votes')
              .delete()
              .match({ song_id: songId, user_id: 'anonymous' });

            if (error) throw error;

            set((state) => ({
              playlists: state.playlists.map((p) =>
                p.id === playlistId
                  ? {
                      ...p,
                      songs: p.songs.map((s) =>
                        s.id === songId
                          ? { ...s, votes: s.votes - value }
                          : s
                      )
                    }
                  : p
              )
            }));
          } else {
            // Add new vote
            localStorage.setItem(voteKey, String(value));
            
            if (hasVoted) {
              // Remove old vote first
              await supabase
                .from('song_votes')
                .delete()
                .match({ song_id: songId, user_id: 'anonymous' });
            }
            
            const { error } = await supabase
              .from('song_votes')
              .insert([{
                song_id: songId,
                user_id: 'anonymous',
                value: value
              }]);

            if (error) throw error;

            set((state) => ({
              playlists: state.playlists.map((p) =>
                p.id === playlistId
                  ? {
                      ...p,
                      songs: p.songs.map((s) =>
                        s.id === songId
                          ? { ...s, votes: s.votes + value }
                          : s
                      )
                    }
                  : p
              )
            }));
          }
        } catch (error) {
          console.error('Error voting:', error);
        }
      },
      setCurrentUser: (user) => set({ currentUser: user })
    }),
    {
      name: 'playlist-storage'
    }
  )
);
