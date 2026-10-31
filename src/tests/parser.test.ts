import { describe, it, expect } from 'vitest';
import { normalizeRecord } from '../utils/parser';

describe('Spotify Record Normalization', () => {
  it('normalizes Extended Streaming History record correctly', () => {
    const rawExtended = {
      ts: '2026-03-15T14:32:00Z',
      ms_played: 184000,
      master_metadata_track_name: 'Starboy',
      master_metadata_album_artist_name: 'The Weeknd',
      master_metadata_album_album_name: 'Starboy',
      spotify_track_uri: 'spotify:track:7MXVkk9YM5FZwb9zqyRfBh',
      reason_start: 'clickrow',
      reason_end: 'trackdone',
      shuffle: false,
      skipped: false
    };

    const record = normalizeRecord(rawExtended, 0);
    expect(record).not.toBeNull();
    expect(record?.trackName).toBe('Starboy');
    expect(record?.artistName).toBe('The Weeknd');
    expect(record?.albumName).toBe('Starboy');
    expect(record?.minutesPlayed).toBeCloseTo(184000 / 60000, 2);
    expect(record?.skipped).toBe(false);
    expect(record?.isPodcast).toBe(false);
    expect(record?.year).toBe(2026);
    expect(record?.isoDate).toBe('2026-03-15');
  });

  it('detects skipped track when played under 30 seconds with forward button', () => {
    const rawSkipped = {
      ts: '2026-04-10T10:00:00Z',
      ms_played: 12000,
      master_metadata_track_name: 'Skip Me',
      master_metadata_album_artist_name: 'Test Artist',
      master_metadata_album_album_name: 'Test Album',
      reason_end: 'fwdbtn'
    };

    const record = normalizeRecord(rawSkipped, 1);
    expect(record).not.toBeNull();
    expect(record?.skipped).toBe(true);
  });

  it('normalizes Classic Streaming History format', () => {
    const rawClassic = {
      endTime: '2026-05-01 18:45',
      artistName: 'Daft Punk',
      trackName: 'Get Lucky',
      msPlayed: 248000
    };

    const record = normalizeRecord(rawClassic, 2);
    expect(record).not.toBeNull();
    expect(record?.artistName).toBe('Daft Punk');
    expect(record?.trackName).toBe('Get Lucky');
    expect(record?.skipped).toBe(false);
    expect(record?.minutesPlayed).toBeCloseTo(248000 / 60000, 2);
  });

  it('returns null for invalid or empty inputs', () => {
    expect(normalizeRecord(null, 0)).toBeNull();
    expect(normalizeRecord({}, 0)).toBeNull();
    expect(normalizeRecord({ ts: 'invalid-date', ms_played: 5000 }, 0)).toBeNull();
  });
});
