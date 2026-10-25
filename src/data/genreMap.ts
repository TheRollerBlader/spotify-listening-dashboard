export interface ArtistProfile {
  genre: string;
  danceability: number;
  energy: number;
  valence: number;
  acousticness: number;
  instrumentalness: number;
  tempoBpm: number;
  speechiness: number;
}

export const GENRE_COLORS: Record<string, string> = {
  'Synthwave / Electronic': '#00f2fe',
  'Indie Rock / Alternative': '#ff7675',
  'Hip-Hop / Rap': '#fdcb6e',
  'R&B / Soul': '#e17055',
  'Pop / Dance': '#1DB954',
  'Ambient / Lo-Fi': '#a29bfe',
  'Rock / Classic': '#d63031',
  'Classical / Cinematic': '#ffeaa7',
  'Jazz / Neo-Soul': '#fab1a0',
  'Folk / Acoustic': '#00b894',
  'Metal / Heavy': '#636e72',
  'Other / Eclectic': '#74b9ff',
};

export const DEFAULT_GENRE_PROFILES: Record<string, ArtistProfile> = {
  'Synthwave / Electronic': {
    genre: 'Synthwave / Electronic',
    danceability: 74,
    energy: 82,
    valence: 58,
    acousticness: 12,
    instrumentalness: 68,
    tempoBpm: 125,
    speechiness: 8,
  },
  'Indie Rock / Alternative': {
    genre: 'Indie Rock / Alternative',
    danceability: 52,
    energy: 68,
    valence: 46,
    acousticness: 34,
    instrumentalness: 24,
    tempoBpm: 120,
    speechiness: 6,
  },
  'Hip-Hop / Rap': {
    genre: 'Hip-Hop / Rap',
    danceability: 82,
    energy: 76,
    valence: 54,
    acousticness: 16,
    instrumentalness: 5,
    tempoBpm: 130,
    speechiness: 28,
  },
  'R&B / Soul': {
    genre: 'R&B / Soul',
    danceability: 68,
    energy: 55,
    valence: 62,
    acousticness: 42,
    instrumentalness: 8,
    tempoBpm: 105,
    speechiness: 12,
  },
  'Pop / Dance': {
    genre: 'Pop / Dance',
    danceability: 78,
    energy: 75,
    valence: 68,
    acousticness: 20,
    instrumentalness: 4,
    tempoBpm: 122,
    speechiness: 10,
  },
  'Ambient / Lo-Fi': {
    genre: 'Ambient / Lo-Fi',
    danceability: 35,
    energy: 28,
    valence: 38,
    acousticness: 78,
    instrumentalness: 86,
    tempoBpm: 84,
    speechiness: 4,
  },
  'Rock / Classic': {
    genre: 'Rock / Classic',
    danceability: 48,
    energy: 84,
    valence: 55,
    acousticness: 18,
    instrumentalness: 22,
    tempoBpm: 128,
    speechiness: 7,
  },
  'Classical / Cinematic': {
    genre: 'Classical / Cinematic',
    danceability: 20,
    energy: 32,
    valence: 30,
    acousticness: 90,
    instrumentalness: 92,
    tempoBpm: 92,
    speechiness: 3,
  },
  'Jazz / Neo-Soul': {
    genre: 'Jazz / Neo-Soul',
    danceability: 58,
    energy: 48,
    valence: 60,
    acousticness: 65,
    instrumentalness: 45,
    tempoBpm: 102,
    speechiness: 9,
  },
  'Folk / Acoustic': {
    genre: 'Folk / Acoustic',
    danceability: 45,
    energy: 42,
    valence: 48,
    acousticness: 82,
    instrumentalness: 15,
    tempoBpm: 108,
    speechiness: 5,
  },
  'Metal / Heavy': {
    genre: 'Metal / Heavy',
    danceability: 38,
    energy: 94,
    valence: 32,
    acousticness: 4,
    instrumentalness: 35,
    tempoBpm: 142,
    speechiness: 11,
  },
  'Other / Eclectic': {
    genre: 'Other / Eclectic',
    danceability: 60,
    energy: 60,
    valence: 50,
    acousticness: 40,
    instrumentalness: 30,
    tempoBpm: 115,
    speechiness: 8,
  },
};

export const KNOWN_ARTISTS: Record<string, ArtistProfile> = {
  // Synthwave / Electronic
  'Daft Punk': { genre: 'Synthwave / Electronic', danceability: 79, energy: 81, valence: 67, acousticness: 9, instrumentalness: 45, tempoBpm: 124, speechiness: 9 },
  'Kavinsky': { genre: 'Synthwave / Electronic', danceability: 68, energy: 86, valence: 52, acousticness: 6, instrumentalness: 72, tempoBpm: 118, speechiness: 5 },
  'The Midnight': { genre: 'Synthwave / Electronic', danceability: 64, energy: 78, valence: 55, acousticness: 14, instrumentalness: 38, tempoBpm: 116, speechiness: 6 },
  'Gunship': { genre: 'Synthwave / Electronic', danceability: 62, energy: 82, valence: 48, acousticness: 8, instrumentalness: 42, tempoBpm: 122, speechiness: 5 },
  'Odesza': { genre: 'Synthwave / Electronic', danceability: 66, energy: 72, valence: 51, acousticness: 22, instrumentalness: 54, tempoBpm: 118, speechiness: 7 },
  'Bonobo': { genre: 'Synthwave / Electronic', danceability: 62, energy: 65, valence: 42, acousticness: 35, instrumentalness: 78, tempoBpm: 112, speechiness: 5 },
  'Tycho': { genre: 'Synthwave / Electronic', danceability: 54, energy: 60, valence: 39, acousticness: 42, instrumentalness: 88, tempoBpm: 110, speechiness: 4 },
  'Fred again..': { genre: 'Synthwave / Electronic', danceability: 76, energy: 79, valence: 63, acousticness: 24, instrumentalness: 28, tempoBpm: 130, speechiness: 12 },
  'Disclosure': { genre: 'Synthwave / Electronic', danceability: 82, energy: 84, valence: 72, acousticness: 8, instrumentalness: 32, tempoBpm: 124, speechiness: 11 },
  'Aphex Twin': { genre: 'Synthwave / Electronic', danceability: 58, energy: 74, valence: 34, acousticness: 28, instrumentalness: 84, tempoBpm: 135, speechiness: 6 },
  'Deadmau5': { genre: 'Synthwave / Electronic', danceability: 72, energy: 86, valence: 44, acousticness: 5, instrumentalness: 76, tempoBpm: 128, speechiness: 6 },

  // Indie Rock / Alternative
  'Arctic Monkeys': { genre: 'Indie Rock / Alternative', danceability: 57, energy: 76, valence: 58, acousticness: 24, instrumentalness: 8, tempoBpm: 122, speechiness: 7 },
  'The Strokes': { genre: 'Indie Rock / Alternative', danceability: 58, energy: 82, valence: 64, acousticness: 12, instrumentalness: 14, tempoBpm: 126, speechiness: 6 },
  'Radiohead': { genre: 'Indie Rock / Alternative', danceability: 42, energy: 64, valence: 28, acousticness: 45, instrumentalness: 48, tempoBpm: 116, speechiness: 5 },
  'Tame Impala': { genre: 'Indie Rock / Alternative', danceability: 64, energy: 74, valence: 52, acousticness: 26, instrumentalness: 36, tempoBpm: 118, speechiness: 6 },
  'Phoenix': { genre: 'Indie Rock / Alternative', danceability: 68, energy: 81, valence: 72, acousticness: 16, instrumentalness: 18, tempoBpm: 132, speechiness: 7 },
  'The 1975': { genre: 'Indie Rock / Alternative', danceability: 69, energy: 71, valence: 61, acousticness: 28, instrumentalness: 12, tempoBpm: 119, speechiness: 8 },
  'Vampire Weekend': { genre: 'Indie Rock / Alternative', danceability: 65, energy: 75, valence: 74, acousticness: 32, instrumentalness: 10, tempoBpm: 125, speechiness: 7 },
  'Foals': { genre: 'Indie Rock / Alternative', danceability: 59, energy: 84, valence: 50, acousticness: 15, instrumentalness: 26, tempoBpm: 128, speechiness: 6 },
  'Glass Animals': { genre: 'Indie Rock / Alternative', danceability: 75, energy: 68, valence: 66, acousticness: 22, instrumentalness: 16, tempoBpm: 114, speechiness: 9 },
  'Florence + The Machine': { genre: 'Indie Rock / Alternative', danceability: 46, energy: 78, valence: 45, acousticness: 38, instrumentalness: 12, tempoBpm: 124, speechiness: 6 },

  // Hip-Hop / Rap
  'Kendrick Lamar': { genre: 'Hip-Hop / Rap', danceability: 74, energy: 78, valence: 56, acousticness: 18, instrumentalness: 4, tempoBpm: 128, speechiness: 32 },
  'Drake': { genre: 'Hip-Hop / Rap', danceability: 78, energy: 68, valence: 52, acousticness: 22, instrumentalness: 2, tempoBpm: 118, speechiness: 24 },
  'Kanye West': { genre: 'Hip-Hop / Rap', danceability: 70, energy: 80, valence: 58, acousticness: 14, instrumentalness: 6, tempoBpm: 122, speechiness: 26 },
  'J. Cole': { genre: 'Hip-Hop / Rap', danceability: 72, energy: 71, valence: 54, acousticness: 24, instrumentalness: 3, tempoBpm: 120, speechiness: 29 },
  'Tyler, The Creator': { genre: 'Hip-Hop / Rap', danceability: 68, energy: 76, valence: 62, acousticness: 28, instrumentalness: 14, tempoBpm: 116, speechiness: 22 },
  'Travis Scott': { genre: 'Hip-Hop / Rap', danceability: 75, energy: 82, valence: 38, acousticness: 12, instrumentalness: 8, tempoBpm: 132, speechiness: 18 },
  'Mac Miller': { genre: 'Hip-Hop / Rap', danceability: 70, energy: 62, valence: 50, acousticness: 36, instrumentalness: 9, tempoBpm: 114, speechiness: 20 },
  'A$AP Rocky': { genre: 'Hip-Hop / Rap', danceability: 76, energy: 74, valence: 48, acousticness: 18, instrumentalness: 6, tempoBpm: 124, speechiness: 22 },

  // R&B / Soul
  'Frank Ocean': { genre: 'R&B / Soul', danceability: 62, energy: 52, valence: 48, acousticness: 54, instrumentalness: 18, tempoBpm: 104, speechiness: 11 },
  'SZA': { genre: 'R&B / Soul', danceability: 71, energy: 64, valence: 58, acousticness: 36, instrumentalness: 3, tempoBpm: 110, speechiness: 14 },
  'The Weeknd': { genre: 'R&B / Soul', danceability: 74, energy: 78, valence: 62, acousticness: 16, instrumentalness: 6, tempoBpm: 120, speechiness: 9 },
  'Daniel Caesar': { genre: 'R&B / Soul', danceability: 58, energy: 44, valence: 52, acousticness: 68, instrumentalness: 5, tempoBpm: 98, speechiness: 7 },
  'Steve Lacy': { genre: 'R&B / Soul', danceability: 73, energy: 62, valence: 68, acousticness: 38, instrumentalness: 12, tempoBpm: 112, speechiness: 9 },
  'Leon Bridges': { genre: 'R&B / Soul', danceability: 65, energy: 54, valence: 70, acousticness: 56, instrumentalness: 8, tempoBpm: 106, speechiness: 6 },

  // Pop / Dance
  'Taylor Swift': { genre: 'Pop / Dance', danceability: 72, energy: 68, valence: 58, acousticness: 32, instrumentalness: 2, tempoBpm: 118, speechiness: 8 },
  'Dua Lipa': { genre: 'Pop / Dance', danceability: 84, energy: 86, valence: 78, acousticness: 10, instrumentalness: 2, tempoBpm: 124, speechiness: 9 },
  'Billie Eilish': { genre: 'Pop / Dance', danceability: 68, energy: 48, valence: 38, acousticness: 58, instrumentalness: 14, tempoBpm: 110, speechiness: 12 },
  'Charli xcx': { genre: 'Pop / Dance', danceability: 82, energy: 90, valence: 74, acousticness: 8, instrumentalness: 18, tempoBpm: 130, speechiness: 11 },
  'Harry Styles': { genre: 'Pop / Dance', danceability: 69, energy: 72, valence: 65, acousticness: 28, instrumentalness: 4, tempoBpm: 121, speechiness: 7 },
  'Olivia Rodrigo': { genre: 'Pop / Dance', danceability: 64, energy: 76, valence: 52, acousticness: 26, instrumentalness: 2, tempoBpm: 128, speechiness: 10 },
  'Beyoncé': { genre: 'Pop / Dance', danceability: 78, energy: 82, valence: 68, acousticness: 14, instrumentalness: 3, tempoBpm: 122, speechiness: 14 },
  'Chappell Roan': { genre: 'Pop / Dance', danceability: 76, energy: 84, valence: 72, acousticness: 18, instrumentalness: 2, tempoBpm: 126, speechiness: 8 },

  // Ambient / Lo-Fi
  'Brian Eno': { genre: 'Ambient / Lo-Fi', danceability: 24, energy: 22, valence: 28, acousticness: 82, instrumentalness: 92, tempoBpm: 78, speechiness: 3 },
  'Lofi Girl': { genre: 'Ambient / Lo-Fi', danceability: 54, energy: 36, valence: 44, acousticness: 72, instrumentalness: 88, tempoBpm: 84, speechiness: 5 },
  'Kiasmos': { genre: 'Ambient / Lo-Fi', danceability: 62, energy: 54, valence: 40, acousticness: 48, instrumentalness: 86, tempoBpm: 114, speechiness: 4 },
  'Nils Frahm': { genre: 'Ambient / Lo-Fi', danceability: 28, energy: 32, valence: 34, acousticness: 88, instrumentalness: 94, tempoBpm: 88, speechiness: 3 },
  'C418': { genre: 'Ambient / Lo-Fi', danceability: 38, energy: 26, valence: 42, acousticness: 84, instrumentalness: 90, tempoBpm: 80, speechiness: 3 },
  'Stars of the Lid': { genre: 'Ambient / Lo-Fi', danceability: 18, energy: 16, valence: 20, acousticness: 92, instrumentalness: 96, tempoBpm: 72, speechiness: 2 },

  // Classical / Cinematic
  'Ludovico Einaudi': { genre: 'Classical / Cinematic', danceability: 26, energy: 34, valence: 32, acousticness: 92, instrumentalness: 94, tempoBpm: 90, speechiness: 3 },
  'Hans Zimmer': { genre: 'Classical / Cinematic', danceability: 22, energy: 62, valence: 28, acousticness: 65, instrumentalness: 91, tempoBpm: 104, speechiness: 4 },
  'Max Richter': { genre: 'Classical / Cinematic', danceability: 24, energy: 30, valence: 26, acousticness: 94, instrumentalness: 95, tempoBpm: 82, speechiness: 3 },
  'Johann Sebastian Bach': { genre: 'Classical / Cinematic', danceability: 28, energy: 38, valence: 45, acousticness: 88, instrumentalness: 92, tempoBpm: 96, speechiness: 3 },
};

export function getArtistProfile(artistName: string): ArtistProfile {
  if (!artistName) return DEFAULT_GENRE_PROFILES['Other / Eclectic'];
  
  // Exact match
  if (KNOWN_ARTISTS[artistName]) {
    return KNOWN_ARTISTS[artistName];
  }

  // Case-insensitive match
  const lower = artistName.toLowerCase().trim();
  for (const [name, prof] of Object.entries(KNOWN_ARTISTS)) {
    if (name.toLowerCase() === lower || lower.includes(name.toLowerCase())) {
      return prof;
    }
  }

  // Fallback heuristics based on common words in artist name
  if (lower.includes('orchestra') || lower.includes('quartet') || lower.includes('philharmonic') || lower.includes('piano') || lower.includes('symphony')) {
    return DEFAULT_GENRE_PROFILES['Classical / Cinematic'];
  }
  if (lower.includes('dj') || lower.includes('remix') || lower.includes('electronic') || lower.includes('wave') || lower.includes('synth') || lower.includes('club')) {
    return DEFAULT_GENRE_PROFILES['Synthwave / Electronic'];
  }
  if (lower.includes('lofi') || lower.includes('chill') || lower.includes('sleep') || lower.includes('ambient') || lower.includes('beats')) {
    return DEFAULT_GENRE_PROFILES['Ambient / Lo-Fi'];
  }
  if (lower.includes('mc') || lower.includes('lil') || lower.includes('young') || lower.includes('big') || lower.includes('rap')) {
    return DEFAULT_GENRE_PROFILES['Hip-Hop / Rap'];
  }
  if (lower.includes('rock') || lower.includes('punk') || lower.includes('band')) {
    return DEFAULT_GENRE_PROFILES['Indie Rock / Alternative'];
  }
  if (lower.includes('jazz') || lower.includes('trio') || lower.includes('sax')) {
    return DEFAULT_GENRE_PROFILES['Jazz / Neo-Soul'];
  }

  // Pseudo-deterministic genre assignment based on string hash for realistic diversity
  const genreKeys = Object.keys(DEFAULT_GENRE_PROFILES);
  let hash = 0;
  for (let i = 0; i < lower.length; i++) {
    hash = (hash << 5) - hash + lower.charCodeAt(i);
    hash |= 0;
  }
  const chosenGenre = genreKeys[Math.abs(hash) % genreKeys.length];
  return DEFAULT_GENRE_PROFILES[chosenGenre];
}
