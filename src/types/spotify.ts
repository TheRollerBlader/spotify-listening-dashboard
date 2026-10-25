export interface SpotifyExtendedRecord {
  ts: string; // ISO 8601 e.g. "2023-11-20T14:32:00Z"
  username?: string;
  platform?: string;
  ms_played: number;
  conn_country?: string;
  ip_addr_decrypted?: string;
  user_agent_decrypted?: string;
  master_metadata_track_name?: string | null;
  master_metadata_album_artist_name?: string | null;
  master_metadata_album_album_name?: string | null;
  spotify_track_uri?: string | null;
  episode_name?: string | null;
  episode_show_name?: string | null;
  spotify_episode_uri?: string | null;
  reason_start?: string | null;
  reason_end?: string | null;
  shuffle?: boolean | null;
  skipped?: boolean | null;
  offline?: boolean | null;
  offline_timestamp?: number | null;
  incognito_mode?: boolean | null;
}

export interface SpotifyClassicRecord {
  endTime: string; // "2023-11-20 14:32"
  artistName: string;
  trackName: string;
  msPlayed: number;
}

export interface StreamRecord {
  id: string;
  timestamp: Date;
  isoDate: string; // YYYY-MM-DD
  year: number;
  month: number; // 0-11
  yearMonth: string; // YYYY-MM
  hour: number; // 0-23
  dayOfWeek: number; // 0 (Sun) - 6 (Sat)
  msPlayed: number;
  minutesPlayed: number;
  trackName: string;
  artistName: string;
  albumName: string;
  trackUri?: string;
  reasonStart?: string;
  reasonEnd?: string;
  shuffle?: boolean;
  skipped: boolean;
  isPodcast: boolean;
  genre: string;
}

export interface FilterState {
  dateRange: [string, string]; // [minDate, maxDate] YYYY-MM-DD
  preset: 'all' | '2024' | '2023' | '2022' | 'last12m' | 'last6m' | 'custom';
  metric: 'minutes' | 'plays';
  searchQuery: string;
  selectedGenre: string | null;
  selectedArtist: string | null;
  minStreamMs: number; // Threshold for filtering accidental skips (e.g., > 10000ms or 0)
}

export interface ArtistSummary {
  artist: string;
  totalMs: number;
  totalMinutes: number;
  playCount: number;
  uniqueTracks: number;
  skipCount: number;
  skipRate: number; // 0 to 1
  genre: string;
  topTrack: string;
}

export interface TrackSummary {
  track: string;
  artist: string;
  album: string;
  totalMs: number;
  totalMinutes: number;
  playCount: number;
  skipCount: number;
  skipRate: number;
  genre: string;
}

export interface GenreDistribution {
  genre: string;
  color: string;
  totalMinutes: number;
  playCount: number;
  percentage: number;
}

export interface BumpRankItem {
  name: string;
  color: string;
  ranks: { period: string; rank: number; value: number }[];
}

export interface RadialClockCell {
  dayOfWeek: number; // 0-6
  dayName: string;
  hour: number; // 0-23
  minutes: number;
  plays: number;
  skipRate: number;
  intensity: number; // 0-1 normalized
}

export interface AudioFeatures {
  danceability: number; // 0-100
  energy: number; // 0-100
  valence: number; // 0-100 (musical positiveness)
  acousticness: number; // 0-100
  instrumentalness: number; // 0-100
  tempoBpm: number; // e.g. 118
  speechiness: number; // 0-100
}

export interface ListeningPersona {
  title: string;
  subtitle: string;
  badge: string;
  avatarIcon: string;
  description: string;
  traits: { label: string; value: string; score: number }[];
  highlightMetric: string;
  color: string;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  dayOfWeek: number;
  month: number;
  year: number;
  minutes: number;
  plays: number;
  topTrack?: string;
  topArtist?: string;
  level: 0 | 1 | 2 | 3 | 4; // GitHub-style heat bucket
}

export interface WrappedOverview {
  totalMinutes: number;
  totalHours: number;
  totalDays: number;
  totalStreams: number;
  uniqueArtists: number;
  uniqueTracks: number;
  uniqueAlbums: number;
  overallSkipRate: number;
  topArtist: ArtistSummary | null;
  topTrack: TrackSummary | null;
  topGenre: string;
  peakListeningDay: { date: string; minutes: number };
  peakListeningHour: number;
  persona: ListeningPersona;
}
