import { describe, it, expect } from 'vitest';
import { filterRecords } from '../utils/aggregations';
import { normalizeRecord } from '../utils/parser';
import type { FilterState, StreamRecord } from '../types/spotify';

describe('Filter Records Aggregations', () => {
  const sampleStreams: StreamRecord[] = [
    normalizeRecord(
      {
        ts: '2026-01-10T12:00:00Z',
        ms_played: 200000,
        master_metadata_track_name: 'Blinding Lights',
        master_metadata_album_artist_name: 'The Weeknd',
        master_metadata_album_album_name: 'After Hours'
      },
      0
    )!,
    normalizeRecord(
      {
        ts: '2026-02-15T15:00:00Z',
        ms_played: 15000, // Short stream
        master_metadata_track_name: 'Short Snippet',
        master_metadata_album_artist_name: 'Ambient Sound',
        master_metadata_album_album_name: 'Relax'
      },
      1
    )!,
    normalizeRecord(
      {
        ts: '2026-03-20T18:00:00Z',
        ms_played: 240000,
        master_metadata_track_name: 'One More Time',
        master_metadata_album_artist_name: 'Daft Punk',
        master_metadata_album_album_name: 'Discovery'
      },
      2
    )!
  ];

  const defaultFilters: FilterState = {
    dateRange: ['', ''],
    preset: 'all',
    metric: 'minutes',
    selectedGenre: null,
    selectedArtist: null,
    searchQuery: '',
    minStreamMs: 30000
  };

  it('filters out tracks below minStreamMs threshold', () => {
    const filtered = filterRecords(sampleStreams, defaultFilters);
    expect(filtered.length).toBe(2);
    expect(filtered.map(r => r.trackName)).not.toContain('Short Snippet');
  });

  it('filters records by search query across artist or track name', () => {
    const queryFilters: FilterState = { ...defaultFilters, searchQuery: 'daft' };
    const filtered = filterRecords(sampleStreams, queryFilters);
    expect(filtered.length).toBe(1);
    expect(filtered[0].artistName).toBe('Daft Punk');
  });

  it('filters records by ISO date range boundary', () => {
    const dateFilters: FilterState = {
      ...defaultFilters,
      dateRange: ['2026-01-01', '2026-01-31']
    };
    const filtered = filterRecords(sampleStreams, dateFilters);
    expect(filtered.length).toBe(1);
    expect(filtered[0].trackName).toBe('Blinding Lights');
  });
});
