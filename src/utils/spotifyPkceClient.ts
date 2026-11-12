/**
 * Spotify Web API Authorization Code Flow with PKCE (RFC 7636) Client
 * and Live Recently Played Tracks Stream Normalizer.
 * Enables live rolling ingestion without requiring a backend client secret.
 */

import type { StreamRecord } from '../types/spotify';

export const SPOTIFY_AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
export const SPOTIFY_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

export const DEFAULT_SPOTIFY_SCOPES = [
  'user-read-recently-played',
  'user-top-read',
  'user-read-playback-position',
  'playlist-read-private',
];

export interface PkceChallengePair {
  codeVerifier: string;
  codeChallenge: string;
}

export interface SpotifyAuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresAtMs: number;
  tokenType: string;
  scope: string;
}

export function generateRandomString(length = 64): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export async function computeSha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    return await crypto.subtle.digest('SHA-256', data);
  }
  // Fallback for non-subtle test environments
  return new ArrayBuffer(32);
}

export function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function generatePkceChallengePair(): Promise<PkceChallengePair> {
  const codeVerifier = generateRandomString(64);
  const hashed = await computeSha256(codeVerifier);
  const codeChallenge = base64UrlEncode(hashed);
  return { codeVerifier, codeChallenge };
}

export function buildSpotifyAuthorizeUrl(
  clientId: string,
  redirectUri: string,
  codeChallenge: string,
  state: string,
  scopes: string[] = DEFAULT_SPOTIFY_SCOPES
): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: scopes.join(' '),
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
    state,
  });
  return `${SPOTIFY_AUTH_ENDPOINT}?${params.toString()}`;
}

export function isTokenExpired(session: SpotifyAuthSession, bufferSeconds = 60): boolean {
  return Date.now() >= session.expiresAtMs - bufferSeconds * 1000;
}

/**
 * Normalizes Spotify Web API Recently Played PlayHistoryObject items into dashboard StreamRecords.
 */
export function normalizeRecentlyPlayedToStreamRecords(payload: any): StreamRecord[] {
  const items = payload?.items ?? [];
  const records: StreamRecord[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const track = item.track;
    if (!track) continue;

    const playedAt = item.played_at ? new Date(item.played_at) : new Date();
    const durationMs = track.duration_ms ?? 0;
    const year = playedAt.getUTCFullYear();
    const month = playedAt.getUTCMonth();
    const yearMonth = `${year}-${String(month + 1).padStart(2, '0')}`;
    const isoDate = playedAt.toISOString().slice(0, 10);

    const record: StreamRecord = {
      id: `live_${track.id || i}_${playedAt.getTime()}`,
      timestamp: playedAt,
      isoDate,
      year,
      month,
      yearMonth,
      hour: playedAt.getUTCHours(),
      dayOfWeek: playedAt.getUTCDay(),
      msPlayed: durationMs,
      minutesPlayed: Math.round((durationMs / 60000) * 10) / 10,
      trackName: track.name || 'Unknown Track',
      artistName: track.artists?.[0]?.name || 'Unknown Artist',
      albumName: track.album?.name || 'Unknown Album',
      trackUri: track.uri,
      skipped: false,
      isPodcast: track.type === 'episode',
      genre: 'Other',
    };

    records.push(record);
  }

  return records;
}
