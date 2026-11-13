/**
 * Audio feature extraction, weighted duration aggregation, and mood classification tests.
 * Scheduled Milestone: Testing & Verification (2026-11-13).
 *
 * Validates:
 * 1. Default fallback feature vector on empty stream records or zero play time.
 * 2. Duration-weighted audio feature averages across tracks.
 * 3. Mood tag and headline classification thresholds (Euphoric, Moody, High-Voltage).
 */

import { describe, expect, it } from 'vitest';
import { calculateAudioFeatures, getAudioFeatureDescriptions } from '../utils/audioFeatures';
import type { StreamRecord, AudioFeatures } from '../types/spotify';

describe('Audio Feature Aggregation & Mood Inference', () => {
  describe('calculateAudioFeatures', () => {
    it('returns nominal baseline defaults when record list is empty', () => {
      const defaults = calculateAudioFeatures([]);
      expect(defaults.danceability).toBe(50);
      expect(defaults.energy).toBe(50);
      expect(defaults.valence).toBe(50);
      expect(defaults.tempoBpm).toBe(120);
    });

    it('returns nominal baseline defaults when total playtime is 0 ms', () => {
      const zeroPlayRecord: StreamRecord = {
        endTime: '2026-01-01 12:00',
        artistName: 'Unknown Artist',
        trackName: 'Skip Track',
        msPlayed: 0,
      };

      const result = calculateAudioFeatures([zeroPlayRecord]);
      expect(result.danceability).toBe(50);
      expect(result.energy).toBe(50);
      expect(result.tempoBpm).toBe(120);
    });

    it('weights audio features by listening duration rather than raw track count', () => {
      // 10 minutes (600,000 ms) of heavy listening vs 10 seconds (10,000 ms) of quick sample
      const records: StreamRecord[] = [
        {
          endTime: '2026-01-01 12:00',
          artistName: 'Daft Punk',
          trackName: 'One More Time',
          msPlayed: 600000,
        },
        {
          endTime: '2026-01-01 12:10',
          artistName: 'Chopin',
          trackName: 'Nocturne',
          msPlayed: 10000,
        },
      ];

      const features = calculateAudioFeatures(records);
      // Because Daft Punk has 60x the duration weight, danceability and energy must heavily lean toward electronic/dance
      expect(features.energy).toBeGreaterThan(60);
      expect(features.danceability).toBeGreaterThan(60);
    });
  });

  describe('getAudioFeatureDescriptions', () => {
    it('identifies High-Voltage Club & Groove for energetic dance music', () => {
      const features: AudioFeatures = {
        danceability: 82,
        energy: 88,
        valence: 70,
        acousticness: 10,
        instrumentalness: 15,
        tempoBpm: 128,
        speechiness: 8,
      };

      const desc = getAudioFeatureDescriptions(features);
      expect(desc.moodTag).toBe('High-Voltage Club & Groove');
      expect(desc.insights.length).toBeGreaterThanOrEqual(2);
      expect(desc.insights[0]).toContain('driving basslines');
    });

    it('identifies Atmospheric & Contemplative for acoustic or ambient sessions', () => {
      const features: AudioFeatures = {
        danceability: 40,
        energy: 35,
        valence: 45,
        acousticness: 75,
        instrumentalness: 65,
        tempoBpm: 85,
        speechiness: 4,
      };

      const desc = getAudioFeatureDescriptions(features);
      expect(desc.moodTag).toBe('Atmospheric & Contemplative');
    });

    it('identifies Moody & Introspective for low-valence melancholic tracks', () => {
      const features: AudioFeatures = {
        danceability: 45,
        energy: 40,
        valence: 25,
        acousticness: 30,
        instrumentalness: 20,
        tempoBpm: 95,
        speechiness: 5,
      };

      const desc = getAudioFeatureDescriptions(features);
      expect(desc.moodTag).toBe('Moody & Introspective');
    });
  });
});
