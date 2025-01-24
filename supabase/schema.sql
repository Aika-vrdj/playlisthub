-- Create tables
CREATE TABLE playlists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  is_preset BOOLEAN DEFAULT false
);

CREATE TABLE songs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE song_votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  value INTEGER NOT NULL CHECK (value IN (-1, 1)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  UNIQUE(song_id, user_id)
);

-- Create indexes
CREATE INDEX idx_playlists_category ON playlists(category);
CREATE INDEX idx_songs_playlist_id ON songs(playlist_id);
CREATE INDEX idx_song_votes_song_id ON song_votes(song_id);
CREATE INDEX idx_song_votes_user_id ON song_votes(user_id);

-- Add RLS policies
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE song_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public playlists are viewable by everyone"
ON playlists FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create playlists"
ON playlists FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Public songs are viewable by everyone"
ON songs FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can add songs"
ON songs FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Public votes are viewable by everyone"
ON song_votes FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can vote"
ON song_votes FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can only modify their own votes"
ON song_votes FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own votes"
ON song_votes FOR DELETE
USING (auth.uid() = user_id);
