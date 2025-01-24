'use client';

import PlaylistForm from '@/components/PlaylistForm';
import { Music } from 'lucide-react';
import Link from 'next/link';

export default function CreatePlaylistPage() {
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
        <div className="mb-8 flex items-center gap-2">
          <Music className="text-purple-400" />
          <h1 className="text-2xl font-semibold">Create New Playlist</h1>
        </div>
        
        <PlaylistForm />
      </main>
    </div>
  );
}
