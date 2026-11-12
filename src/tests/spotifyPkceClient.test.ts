import { describe, expect, it } from 'vitest';
import {
  generateRandomString,
  base64UrlEncode,
  buildSpotifyAuthorizeUrl,
  isTokenExpired,
  normalizeRecentlyPlayedToStreamRecords,
} from '../utils/spotifyPkceClient';

describe('spotifyPkceClient', () => {
  it('generates random strings of requested length', () => {
    const s1 = generateRandomString(32);
    const s2 = generateRandomString(64);
    expect(s1).toHaveLength(32);
    expect(s2).toHaveLength(64);
    expect(s1).not.toBe(s2);
  });

  it('correctly constructs base64url encoded strings without padding', () => {
    const bytes = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
    const encoded = base64UrlEncode(bytes.buffer);
    expect(encoded).toBe('SGVsbG8');
    expect(encoded).not.toContain('=');
    expect(encoded).not.toContain('+');
    expect(encoded).not.toContain('/');
  });

  it('builds valid Spotify authorize URL with PKCE parameters', () => {
    const urlStr = buildSpotifyAuthorizeUrl(
      'mock_client_id_123',
      'http://localhost:5173/callback',
      'mock_code_challenge_xyz',
      'mock_state_456',
      ['user-read-recently-played']
    );

    const u = new URL(urlStr);
    expect(u.origin).toBe('https://accounts.spotify.com');
    expect(u.pathname).toBe('/authorize');
    expect(u.searchParams.get('client_id')).toBe('mock_client_id_123');
    expect(u.searchParams.get('response_type')).toBe('code');
    expect(u.searchParams.get('code_challenge_method')).toBe('S256');
    expect(u.searchParams.get('code_challenge')).toBe('mock_code_challenge_xyz');
    expect(u.searchParams.get('redirect_uri')).toBe('http://localhost:5173/callback');
    expect(u.searchParams.get('scope')).toBe('user-read-recently-played');
  });

  it('detects token expiration with buffer', () => {
    const now = Date.now();
    const expiredSession = {
      accessToken: 'token_1',
      expiresAtMs: now + 30 * 1000, // expires in 30 seconds
      tokenType: 'Bearer',
      scope: 'read',
    };
    // With 60s buffer, a token expiring in 30s should be considered expired
    expect(isTokenExpired(expiredSession, 60)).toBe(true);

    const validSession = {
      accessToken: 'token_2',
      expiresAtMs: now + 3600 * 1000, // expires in 1 hour
      tokenType: 'Bearer',
      scope: 'read',
    };
    expect(isTokenExpired(validSession, 60)).toBe(false);
  });

  it('normalizes Spotify recently played API payload into StreamRecords', () => {
    const mockPayload = {
      items: [
        {
          played_at: '2026-11-12T15:30:00Z',
          track: {
            id: 'track_123',
            name: 'Starboy',
            uri: 'spotify:track:track_123',
            duration_ms: 230000,
            artists: [{ name: 'The Weeknd' }],
            album: { name: 'Starboy' },
            type: 'track',
          },
        },
      ],
    };

    const records = normalizeRecentlyPlayedToStreamRecords(mockPayload);
    expect(records).toHaveLength(1);
    const r = records[0];
    expect(r.trackName).toBe('Starboy');
    expect(r.artistName).toBe('The Weeknd');
    expect(r.albumName).toBe('Starboy');
    expect(r.minutesPlayed).toBe(3.8);
    expect(r.isPodcast).toBe(false);
    expect(r.isoDate).toBe('2026-11-12');
  });
});
