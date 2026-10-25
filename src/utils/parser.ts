import { SpotifyExtendedRecord, SpotifyClassicRecord, StreamRecord } from '../types/spotify';
import { getArtistProfile } from '../data/genreMap';

export function normalizeRecord(raw: any, index: number): StreamRecord | null {
  if (!raw) return null;

  // Case 1: Spotify Extended Streaming History (endsong_*.json)
  if ('ts' in raw && 'ms_played' in raw) {
    const ext = raw as SpotifyExtendedRecord;
    const trackName = ext.master_metadata_track_name || ext.episode_name || 'Unknown Track';
    const artistName = ext.master_metadata_album_artist_name || ext.episode_show_name || 'Unknown Artist';
    const albumName = ext.master_metadata_album_album_name || 'Unknown Album';
    const isPodcast = Boolean(ext.episode_name || ext.spotify_episode_uri);

    const date = new Date(ext.ts);
    if (isNaN(date.getTime())) return null;

    const msPlayed = Number(ext.ms_played) || 0;
    const minutesPlayed = msPlayed / 60000;

    // Reason end skip detection: if skipped is true, or reason_end is 'fwdbtn', or played < 30 seconds
    const isSkipped = Boolean(ext.skipped || ext.reason_end === 'fwdbtn' || (msPlayed < 30000 && ext.reason_end !== 'endplay'));

    const profile = getArtistProfile(artistName);

    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(date.getUTCDate()).padStart(2, '0');
    const isoDate = `${year}-${monthStr}-${dayStr}`;
    const yearMonth = `${year}-${monthStr}`;

    return {
      id: `stream_${index}_${date.getTime()}`,
      timestamp: date,
      isoDate,
      year,
      month,
      yearMonth,
      hour: date.getUTCHours(),
      dayOfWeek: date.getUTCDay(),
      msPlayed,
      minutesPlayed,
      trackName,
      artistName,
      albumName,
      trackUri: ext.spotify_track_uri || undefined,
      reasonStart: ext.reason_start || undefined,
      reasonEnd: ext.reason_end || undefined,
      shuffle: ext.shuffle ?? false,
      skipped: isSkipped,
      isPodcast,
      genre: profile.genre,
    };
  }

  // Case 2: Spotify Classic Streaming History (StreamingHistory*.json)
  if ('endTime' in raw && 'artistName' in raw && 'trackName' in raw) {
    const classic = raw as SpotifyClassicRecord;
    const date = new Date(classic.endTime.replace(' ', 'T') + ':00Z');
    if (isNaN(date.getTime())) return null;

    const msPlayed = Number(classic.msPlayed) || 0;
    const minutesPlayed = msPlayed / 60000;
    const isSkipped = msPlayed < 30000;

    const profile = getArtistProfile(classic.artistName);

    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(date.getUTCDate()).padStart(2, '0');
    const isoDate = `${year}-${monthStr}-${dayStr}`;
    const yearMonth = `${year}-${monthStr}`;

    return {
      id: `stream_${index}_${date.getTime()}`,
      timestamp: date,
      isoDate,
      year,
      month,
      yearMonth,
      hour: date.getUTCHours(),
      dayOfWeek: date.getUTCDay(),
      msPlayed,
      minutesPlayed,
      trackName: classic.trackName,
      artistName: classic.artistName,
      albumName: 'Unknown Album',
      reasonStart: 'unknown',
      reasonEnd: isSkipped ? 'fwdbtn' : 'trackdone',
      shuffle: false,
      skipped: isSkipped,
      isPodcast: false,
      genre: profile.genre,
    };
  }

  return null;
}

/**
 * Parses raw JSON files from Spotify Export, deduplicates, and sorts chronologically.
 */
export async function parseSpotifyFiles(files: File[]): Promise<StreamRecord[]> {
  const allRecords: StreamRecord[] = [];
  let indexCounter = 0;

  for (const file of files) {
    if (!file.name.endsWith('.json')) continue;
    try {
      const text = await file.text();
      const json = JSON.parse(text);

      if (Array.isArray(json)) {
        for (const item of json) {
          const norm = normalizeRecord(item, indexCounter++);
          if (norm && norm.artistName && norm.trackName) {
            allRecords.push(norm);
          }
        }
      }
    } catch (err) {
      console.warn(`Failed to parse file ${file.name}:`, err);
    }
  }

  // Sort chronologically
  allRecords.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  return allRecords;
}
