'use client';

// Import necessary dependencies and components
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion'; // For animations
import { Plus, Music2, ThumbsUp, ChevronDown } from 'lucide-react'; // Icons
import Link from 'next/link';
import { useState } from 'react';
import YouTube from 'react-youtube'; // YouTube player component
import AddSong from '@/components/AddSong';
import SongList from '@/components/SongList';

// Main home page component
export default function HomePage() {
  // Get playlists from the global store
  const { playlists } = useStore();
  
  // State to track which playlist is expanded and which video is playing
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  
  // Split playlists into preset (default) and user-created ones
  const presetPlaylists = playlists.filter(p => p.isPreset);
  const userPlaylists = playlists.filter(p => !p.isPreset);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black text-white p-8">
      <header className="max-w-6xl mx-auto mb-12">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Playlist Collaborator
          </h1>
          <Link
            href="/create"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition-colors px-4 py-2 rounded-full"
          >
            <Plus size={20} />
            Create Playlist
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto space-y-12">
        {currentVideo && (
          <div className="w-full bg-zinc-800/50 rounded-lg overflow-hidden mb-8">
            <div className="relative w-full pt-[56.25%]">
              <div className="absolute inset-0">
                <YouTube
                  videoId={currentVideo}
                  opts={{
                    width: '100%',
                    height: '100%',
                    playerVars: {
                      autoplay: 1,
                      rel: 0,
                    },
                  }}
                  className="absolute top-0 left-0 w-full h-full"
                  iframeClassName="w-full h-full"
                  onEnd={() => {
                    const activePlaylist = document.querySelector('[data-active="true"]');
                    if (activePlaylist) {
                      const songList = activePlaylist.querySelector('div[data-songlist]');
                      const songListEl = songList as any;
                      if (songListEl?.playNextFn) {
                        songListEl.playNextFn();
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <section>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Music2 className="text-purple-400" />
            Featured Playlists
          </h2>
          <div className="space-y-4">
            {presetPlaylists.map((playlist) => (
              <motion.div
                key={playlist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-800/50 rounded-lg overflow-hidden border border-zinc-700/50"
                data-active={selectedPlaylist === playlist.id}
              >
                <button
                  onClick={() => setSelectedPlaylist(selectedPlaylist === playlist.id ? null : playlist.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-zinc-700/20 transition-colors"
                >
                  <div>
                    <h3 className="text-xl font-semibold">{playlist.title}</h3>
                    <p className="text-zinc-400 text-sm">{playlist.description}</p>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-zinc-400 transition-transform ${
                      selectedPlaylist === playlist.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {selectedPlaylist === playlist.id && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="border-t border-zinc-700/50"
                  >
                    <div className="p-6">
                      <AddSong playlistId={playlist.id} />
                      <SongList
                        playlistId={playlist.id}
                        songs={playlist.songs}
                        onPlay={setCurrentVideo}
                      />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Music2 className="text-purple-400" />
            Community Playlists
          </h2>
          <div className="space-y-4">
            {userPlaylists.map((playlist) => (
              <motion.div
                key={playlist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-800/50 rounded-lg overflow-hidden border border-zinc-700/50"
              >
                <button
                  onClick={() => setSelectedPlaylist(selectedPlaylist === playlist.id ? null : playlist.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-zinc-700/20 transition-colors"
                >
                  <div>
                    <h3 className="text-xl font-semibold">{playlist.title}</h3>
                    <p className="text-zinc-400 text-sm">{playlist.description}</p>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-zinc-400 transition-transform ${
                      selectedPlaylist === playlist.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {selectedPlaylist === playlist.id && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="border-t border-zinc-700/50"
                  >
                    <div className="p-6">
                      <AddSong playlistId={playlist.id} />
                      <SongList
                        playlistId={playlist.id}
                        songs={playlist.songs}
                        onPlay={setCurrentVideo}
                      />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
