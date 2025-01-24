// Type definition for a song in a playlist
export type Song = {
  id: string;           // Unique identifier for the song
  title: string;        // Song title
  url: string;          // YouTube video ID
  thumbnail: string;    // URL to song thumbnail image
  votes: number;        // Number of votes (likes/dislikes)
  addedAt: number;      // Timestamp when song was added
};

// Type definition for a playlist
export type Playlist = {
  id: string;           // Unique identifier for the playlist
  title: string;        // Playlist title
  description: string;  // Playlist description
  category: string;     // Music category (Pop, Rock, etc)
  createdBy: string;    // User who created the playlist
  createdAt: number;    // Timestamp when playlist was created
  songs: Song[];        // Array of songs in the playlist
  isPreset?: boolean;   // Whether this is a default playlist
};

// Type definition for a user
export type User = {
  id: string;                    // Unique identifier for the user
  name: string;                  // User's display name
  bio: string;                   // User's biography/description
  isAdmin: boolean;              // Whether user has admin privileges
  createdPlaylists: string[];    // IDs of playlists created by user
  contributedPlaylists: string[]; // IDs of playlists user added songs to
};
