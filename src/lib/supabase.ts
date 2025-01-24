'use client';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qqrytredypjcqzrlzzez.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxcnl0cmVkeXBqY3F6cmx6emV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2ODQ4MTYsImV4cCI6MjA1MzI2MDgxNn0.W1cPvk3x3zp66UtaVINBRHIOXw2gAbVdysL228s_-5E';

export const supabase = createClient(supabaseUrl, supabaseKey);
