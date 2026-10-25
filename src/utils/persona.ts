import { StreamRecord, ArtistSummary, GenreDistribution, ListeningPersona } from '../types/spotify';

export function calculateListeningPersona(
  records: StreamRecord[],
  artists: ArtistSummary[],
  genres: GenreDistribution[]
): ListeningPersona {
  if (records.length === 0) {
    return {
      title: 'The Silent Observer',
      subtitle: 'Awaiting your soundwaves',
      badge: 'Uncharted',
      avatarIcon: 'Headphones',
      description: 'Upload your streaming history files to reveal your musical footprint and listening identity.',
      traits: [
        { label: 'Exploration', value: '0%', score: 0 },
        { label: 'Loyalty', value: '0%', score: 0 },
        { label: 'Nocturnal', value: '0%', score: 0 },
      ],
      highlightMetric: 'No streams logged',
      color: '#636e72',
    };
  }

  // Calculate metrics
  let nightPlays = 0; // 22:00 to 04:00
  let morningPlays = 0; // 06:00 to 10:00
  let totalPlays = records.length;

  for (const r of records) {
    if (r.hour >= 22 || r.hour <= 4) nightPlays++;
    if (r.hour >= 6 && r.hour <= 10) morningPlays++;
  }

  const nightRatio = nightPlays / totalPlays;
  const morningRatio = morningPlays / totalPlays;

  const topArtistShare = artists.length > 0 && totalPlays > 0 ? artists[0].playCount / totalPlays : 0;
  const uniqueArtistRatio = artists.length / totalPlays;
  const topGenre = genres[0]?.genre || '';

  // 1. Dedicated Loyalist
  if (topArtistShare >= 0.28 && artists.length > 0) {
    return {
      title: 'The Dedicated Loyalist',
      subtitle: 'Unshakable devotion to the craft',
      badge: 'Tier 1 Stan',
      avatarIcon: 'HeartHandshake',
      description: `When you fall in love with an artist, you make them your entire soundtrack. ${artists[0].artist} commands ${Math.round(topArtistShare * 100)}% of your streams.`,
      traits: [
        { label: 'Artist Devotion', value: `${Math.round(topArtistShare * 100)}%`, score: 95 },
        { label: 'Repeat Factor', value: 'High', score: 88 },
        { label: 'Catalog Depth', value: `${artists[0].uniqueTracks} Tracks`, score: 85 },
      ],
      highlightMetric: `${artists[0].artist} is your anchor`,
      color: '#ff7675',
    };
  }

  // 2. Nocturnal Sonic Explorer
  if (nightRatio >= 0.32) {
    return {
      title: 'The Nocturnal Explorer',
      subtitle: 'Music hits deepest when the city sleeps',
      badge: 'Night Owl',
      avatarIcon: 'Moon',
      description: 'Your peak sonic journeys occur past twilight. Whether coding, driving down neon highways, or unwinding, night hours are your creative sanctuary.',
      traits: [
        { label: 'Night Owl Bias', value: `${Math.round(nightRatio * 100)}% Night`, score: 92 },
        { label: 'Introspection', value: 'High', score: 86 },
        { label: 'Mood Density', value: 'Atmospheric', score: 80 },
      ],
      highlightMetric: `${Math.round(nightRatio * 100)}% of listening happens after dark`,
      color: '#a29bfe',
    };
  }

  // 3. The Genre Nomad
  if (genres.length >= 4 && uniqueArtistRatio > 0.15) {
    return {
      title: 'The Genre Nomad',
      subtitle: 'Borders are merely suggestions',
      badge: 'Eclectic Voyager',
      avatarIcon: 'Compass',
      description: 'You refuse to be pinned down by Spotify algorithmic boxes. Your queue leaps effortlessly from synthwave arpeggios to indie rock riffs and deep basslines.',
      traits: [
        { label: 'Genre Breadth', value: `${genres.length} Distinct Styles`, score: 96 },
        { label: 'Novelty Hunger', value: 'Very High', score: 90 },
        { label: 'Algorithm Immunity', value: 'Supreme', score: 92 },
      ],
      highlightMetric: `Flowing between ${genres.slice(0, 3).map(g => g.genre.split('/')[0].trim()).join(', ')}`,
      color: '#00f2fe',
    };
  }

  // 4. The Morning Ritualist
  if (morningRatio >= 0.25) {
    return {
      title: 'The Dawn Luminary',
      subtitle: 'Soundtracks for sunrise momentum',
      badge: 'Early Riser',
      avatarIcon: 'Sun',
      description: 'Your morning begins with rhythm. While others hit snooze, your headphones are already setting the tempo for the day ahead.',
      traits: [
        { label: 'Morning Velocity', value: `${Math.round(morningRatio * 100)}% AM`, score: 89 },
        { label: 'Consistency', value: 'High', score: 84 },
        { label: 'Energy Surge', value: 'Elevated', score: 82 },
      ],
      highlightMetric: 'Peak productivity fueled by music',
      color: '#fdcb6e',
    };
  }

  // 5. Ambient Zen Master
  if (topGenre.includes('Ambient') || topGenre.includes('Classical')) {
    return {
      title: 'The Focus Architect',
      subtitle: 'Flow state in sonic form',
      badge: 'Zen Master',
      avatarIcon: 'Sparkles',
      description: 'You treat music as an atmospheric tool for hyper-focus, deep thought, and tranquil reflection without intrusive distractions.',
      traits: [
        { label: 'Focus Score', value: '98%', score: 98 },
        { label: 'Acoustic Purity', value: 'High', score: 88 },
        { label: 'Flow Induction', value: 'Zen', score: 94 },
      ],
      highlightMetric: 'Masters the art of focused auditory immersion',
      color: '#00b894',
    };
  }

  // 6. Default: The Rhythm Alchemist
  return {
    title: 'The Rhythm Alchemist',
    subtitle: 'Curating sonic gold in high rotation',
    badge: 'Trend Setter',
    avatarIcon: 'Flame',
    description: 'You possess a balanced ear with high appreciation for dynamic production, groove, and unforgettable vocal hooks across modern soundscapes.',
    traits: [
      { label: 'Beat Resonance', value: '91%', score: 91 },
      { label: 'Palette Range', value: `${artists.length} Artists`, score: 84 },
      { label: 'Energy Index', value: 'Vibrant', score: 87 },
    ],
    highlightMetric: 'Master curator of infectious modern grooves',
    color: '#1DB954',
  };
}
