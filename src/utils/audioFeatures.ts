import { StreamRecord, AudioFeatures } from '../types/spotify';
import { getArtistProfile } from '../data/genreMap';

export function calculateAudioFeatures(records: StreamRecord[]): AudioFeatures {
  if (records.length === 0) {
    return {
      danceability: 50,
      energy: 50,
      valence: 50,
      acousticness: 30,
      instrumentalness: 20,
      tempoBpm: 120,
      speechiness: 10,
    };
  }

  let totalMs = 0;
  let weightedDance = 0;
  let weightedEnergy = 0;
  let weightedValence = 0;
  let weightedAcoustic = 0;
  let weightedInstrumental = 0;
  let weightedTempo = 0;
  let weightedSpeech = 0;

  for (const r of records) {
    const prof = getArtistProfile(r.artistName);
    const weight = r.msPlayed; // weight by duration listened

    totalMs += weight;
    weightedDance += prof.danceability * weight;
    weightedEnergy += prof.energy * weight;
    weightedValence += prof.valence * weight;
    weightedAcoustic += prof.acousticness * weight;
    weightedInstrumental += prof.instrumentalness * weight;
    weightedTempo += prof.tempoBpm * weight;
    weightedSpeech += prof.speechiness * weight;
  }

  if (totalMs === 0) {
    return {
      danceability: 50,
      energy: 50,
      valence: 50,
      acousticness: 30,
      instrumentalness: 20,
      tempoBpm: 120,
      speechiness: 10,
    };
  }

  return {
    danceability: Math.round(weightedDance / totalMs),
    energy: Math.round(weightedEnergy / totalMs),
    valence: Math.round(weightedValence / totalMs),
    acousticness: Math.round(weightedAcoustic / totalMs),
    instrumentalness: Math.round(weightedInstrumental / totalMs),
    tempoBpm: Math.round(weightedTempo / totalMs),
    speechiness: Math.round(weightedSpeech / totalMs),
  };
}

export function getAudioFeatureDescriptions(features: AudioFeatures): {
  headline: string;
  moodTag: string;
  insights: string[];
} {
  const insights: string[] = [];

  let moodTag = 'Dynamic & Balanced';
  if (features.energy > 75 && features.danceability > 70) {
    moodTag = 'High-Voltage Club & Groove';
    insights.push('Your catalog leans heavily into punchy rhythms, driving basslines, and uptempo beats.');
  } else if (features.acousticness > 60 || features.instrumentalness > 60) {
    moodTag = 'Atmospheric & Contemplative';
    insights.push('Rich textures, acoustic instrumentation, and cinematic arrangements dominate your sessions.');
  } else if (features.valence > 65) {
    moodTag = 'Euphoric & Upbeat';
    insights.push('High melodic brightness with positive, uplifting emotional resonance.');
  } else if (features.valence < 40) {
    moodTag = 'Moody & Introspective';
    insights.push('Deeper, minor-key emotional palette favoring melancholy and bittersweet tones.');
  }

  insights.push(`Average tempo rests at ${features.tempoBpm} BPM — ideal for energetic flow and rhythm synchronization.`);
  insights.push(`${features.acousticness}% acoustic character with ${features.instrumentalness}% instrumental texture.`);

  return {
    headline: moodTag,
    moodTag,
    insights,
  };
}
