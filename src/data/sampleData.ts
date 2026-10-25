import { SpotifyExtendedRecord } from '../types/spotify';

interface ArtistCatalogItem {
  artist: string;
  genre: string;
  albums: {
    name: string;
    tracks: { title: string; durationMs: number; popularityWeight: number }[];
  }[];
}

const CATALOG: ArtistCatalogItem[] = [
  {
    artist: 'Daft Punk',
    genre: 'Synthwave / Electronic',
    albums: [
      {
        name: 'Random Access Memories',
        tracks: [
          { title: 'Get Lucky', durationMs: 248000, popularityWeight: 10 },
          { title: 'Instant Crush', durationMs: 337000, popularityWeight: 9 },
          { title: 'Lose Yourself to Dance', durationMs: 353000, popularityWeight: 7 },
          { title: 'Give Life Back to Music', durationMs: 274000, popularityWeight: 6 },
          { title: 'Giorgio by Moroder', durationMs: 544000, popularityWeight: 5 },
          { title: 'Touch', durationMs: 498000, popularityWeight: 4 },
        ],
      },
      {
        name: 'Discovery',
        tracks: [
          { title: 'One More Time', durationMs: 320000, popularityWeight: 9 },
          { title: 'Harder, Better, Faster, Stronger', durationMs: 224000, popularityWeight: 8 },
          { title: 'Digital Love', durationMs: 301000, popularityWeight: 7 },
          { title: 'Something About Us', durationMs: 231000, popularityWeight: 8 },
        ],
      },
    ],
  },
  {
    artist: 'Arctic Monkeys',
    genre: 'Indie Rock / Alternative',
    albums: [
      {
        name: 'AM',
        tracks: [
          { title: 'Do I Wanna Know?', durationMs: 272000, popularityWeight: 10 },
          { title: 'R U Mine?', durationMs: 201000, popularityWeight: 9 },
          { title: 'Why\'d You Only Call Me When You\'re High?', durationMs: 161000, popularityWeight: 8 },
          { title: 'Arabella', durationMs: 207000, popularityWeight: 6 },
          { title: 'Snap Out Of It', durationMs: 192000, popularityWeight: 7 },
          { title: 'I Wanna Be Yours', durationMs: 183000, popularityWeight: 9 },
        ],
      },
      {
        name: 'Favourite Worst Nightmare',
        tracks: [
          { title: '505', durationMs: 253000, popularityWeight: 9 },
          { title: 'Fluorescent Adolescent', durationMs: 177000, popularityWeight: 8 },
          { title: 'Brianstorm', durationMs: 172000, popularityWeight: 5 },
        ],
      },
    ],
  },
  {
    artist: 'Kendrick Lamar',
    genre: 'Hip-Hop / Rap',
    albums: [
      {
        name: 'DAMN.',
        tracks: [
          { title: 'HUMBLE.', durationMs: 177000, popularityWeight: 10 },
          { title: 'DNA.', durationMs: 185000, popularityWeight: 8 },
          { title: 'LOVE. FEAT. ZACARI.', durationMs: 213000, popularityWeight: 7 },
          { title: 'LOYALTY. FEAT. RIHANNA.', durationMs: 227000, popularityWeight: 6 },
          { title: 'ELEMENT.', durationMs: 208000, popularityWeight: 6 },
        ],
      },
      {
        name: 'good kid, m.A.A.d city',
        tracks: [
          { title: 'Money Trees', durationMs: 386000, popularityWeight: 9 },
          { title: 'Bitch, Don’t Kill My Vibe', durationMs: 310000, popularityWeight: 8 },
          { title: 'Swimming Pools (Drank)', durationMs: 313000, popularityWeight: 8 },
          { title: 'm.A.A.d city', durationMs: 350000, popularityWeight: 7 },
        ],
      },
    ],
  },
  {
    artist: 'Frank Ocean',
    genre: 'R&B / Soul',
    albums: [
      {
        name: 'Blonde',
        tracks: [
          { title: 'Nikes', durationMs: 314000, popularityWeight: 7 },
          { title: 'Ivy', durationMs: 249000, popularityWeight: 9 },
          { title: 'Pink + White', durationMs: 184000, popularityWeight: 10 },
          { title: 'Solo', durationMs: 257000, popularityWeight: 6 },
          { title: 'Self Control', durationMs: 249000, popularityWeight: 9 },
          { title: 'Nights', durationMs: 307000, popularityWeight: 10 },
          { title: 'White Ferrari', durationMs: 248000, popularityWeight: 8 },
          { title: 'Godspeed', durationMs: 177000, popularityWeight: 7 },
        ],
      },
      {
        name: 'Channel Orange',
        tracks: [
          { title: 'Thinkin Bout You', durationMs: 200000, popularityWeight: 9 },
          { title: 'Lost', durationMs: 234000, popularityWeight: 9 },
          { title: 'Pyramids', durationMs: 592000, popularityWeight: 7 },
        ],
      },
    ],
  },
  {
    artist: 'The Midnight',
    genre: 'Synthwave / Electronic',
    albums: [
      {
        name: 'Endless Summer',
        tracks: [
          { title: 'Sunset', durationMs: 326000, popularityWeight: 10 },
          { title: 'Vampires', durationMs: 317000, popularityWeight: 8 },
          { title: 'Jason (feat. Nikki Flores)', durationMs: 331000, popularityWeight: 7 },
          { title: 'Days of Thunder', durationMs: 329000, popularityWeight: 6 },
          { title: 'Memories', durationMs: 379000, popularityWeight: 6 },
        ],
      },
      {
        name: 'Monsters',
        tracks: [
          { title: 'Deep Blue', durationMs: 238000, popularityWeight: 8 },
          { title: 'Prom Night', durationMs: 312000, popularityWeight: 7 },
          { title: 'Brooklyn. Friday. Love.', durationMs: 254000, popularityWeight: 6 },
        ],
      },
    ],
  },
  {
    artist: 'Tame Impala',
    genre: 'Indie Rock / Alternative',
    albums: [
      {
        name: 'Currents',
        tracks: [
          { title: 'The Less I Know The Better', durationMs: 216000, popularityWeight: 10 },
          { title: 'Let It Happen', durationMs: 467000, popularityWeight: 9 },
          { title: 'Eventually', durationMs: 319000, popularityWeight: 7 },
          { title: 'New Person, Same Old Mistakes', durationMs: 362000, popularityWeight: 8 },
        ],
      },
      {
        name: 'The Slow Rush',
        tracks: [
          { title: 'Borderline', durationMs: 237000, popularityWeight: 9 },
          { title: 'Lost in Yesterday', durationMs: 249000, popularityWeight: 7 },
          { title: 'Breathe Deeper', durationMs: 372000, popularityWeight: 8 },
        ],
      },
    ],
  },
  {
    artist: 'Fred again..',
    genre: 'Synthwave / Electronic',
    albums: [
      {
        name: 'Actual Life 3',
        tracks: [
          { title: 'Delilah (pull me out of this)', durationMs: 250000, popularityWeight: 9 },
          { title: 'Kammy (like i do)', durationMs: 238000, popularityWeight: 7 },
          { title: 'Danielle (smile on my face)', durationMs: 201000, popularityWeight: 8 },
          { title: 'Bleu (better with time)', durationMs: 198000, popularityWeight: 6 },
        ],
      },
      {
        name: 'USB',
        tracks: [
          { title: 'Rumble (feat. Flowdan)', durationMs: 146000, popularityWeight: 10 },
          { title: 'Jungle', durationMs: 198000, popularityWeight: 8 },
          { title: 'leavemealone (feat. Baby Keem)', durationMs: 222000, popularityWeight: 9 },
        ],
      },
    ],
  },
  {
    artist: 'Dua Lipa',
    genre: 'Pop / Dance',
    albums: [
      {
        name: 'Future Nostalgia',
        tracks: [
          { title: 'Don\'t Start Now', durationMs: 183000, popularityWeight: 10 },
          { title: 'Levitating', durationMs: 203000, popularityWeight: 10 },
          { title: 'Physical', durationMs: 193000, popularityWeight: 8 },
          { title: 'Break My Heart', durationMs: 221000, popularityWeight: 7 },
          { title: 'Hallucinate', durationMs: 208000, popularityWeight: 6 },
        ],
      },
    ],
  },
  {
    artist: 'SZA',
    genre: 'R&B / Soul',
    albums: [
      {
        name: 'SOS',
        tracks: [
          { title: 'Kill Bill', durationMs: 153000, popularityWeight: 10 },
          { title: 'Snooze', durationMs: 201000, popularityWeight: 10 },
          { title: 'Nobody Gets Me', durationMs: 180000, popularityWeight: 7 },
          { title: 'Low', durationMs: 181000, popularityWeight: 7 },
          { title: 'Ghost in the Machine', durationMs: 218000, popularityWeight: 6 },
        ],
      },
    ],
  },
  {
    artist: 'Brian Eno',
    genre: 'Ambient / Lo-Fi',
    albums: [
      {
        name: 'Ambient 1: Music for Airports',
        tracks: [
          { title: '1/1', durationMs: 1020000, popularityWeight: 8 },
          { title: '2/1', durationMs: 510000, popularityWeight: 6 },
          { title: '1/2', durationMs: 720000, popularityWeight: 5 },
        ],
      },
    ],
  },
  {
    artist: 'Kiasmos',
    genre: 'Ambient / Lo-Fi',
    albums: [
      {
        name: 'Kiasmos',
        tracks: [
          { title: 'Looped', durationMs: 376000, popularityWeight: 9 },
          { title: 'Held', durationMs: 301000, popularityWeight: 8 },
          { title: 'Thrown', durationMs: 497000, popularityWeight: 7 },
          { title: 'Blurred', durationMs: 310000, popularityWeight: 6 },
        ],
      },
    ],
  },
  {
    artist: 'Ludovico Einaudi',
    genre: 'Classical / Cinematic',
    albums: [
      {
        name: 'Una Mattina',
        tracks: [
          { title: 'Nuvole Bianche', durationMs: 357000, popularityWeight: 10 },
          { title: 'Una Mattina', durationMs: 206000, popularityWeight: 8 },
          { title: 'Divenire', durationMs: 402000, popularityWeight: 8 },
          { title: 'Experience', durationMs: 315000, popularityWeight: 9 },
        ],
      },
    ],
  },
];

// Seeded pseudorandom number generator for reproducible high-quality sample data
class SeededRNG {
  private s: number;
  constructor(seed = 133742) {
    this.s = seed;
  }
  next(): number {
    this.s = (this.s * 16807) % 2147483647;
    return (this.s - 1) / 2147483646;
  }
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
  choice<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }
}

/**
 * Generates an extensive, authentic Spotify Extended Streaming History dataset
 * covering 15 months (Jan 2023 - Mar 2024), ~2,800 listening events.
 */
export function generateSampleExtendedHistory(): SpotifyExtendedRecord[] {
  const rng = new SeededRNG(424242);
  const records: SpotifyExtendedRecord[] = [];

  const platforms = ['iOS 17.2 (iPhone14,2)', 'OSX 14.1 (MacBookPro18,1)', 'Web Player (Chrome/120.0)', 'Sonos Beam'];
  const startReasons = ['trackdone', 'fwdbtn', 'clickrow', 'appload', 'playbtn'];
  
  // Weight artists over time to produce realistic rankings transition in the bump chart!
  // e.g., Arctic Monkeys dominates Q1-Q2, Daft Punk peaks in Summer, Fred again.. spikes in Autumn, Frank Ocean dominates Winter.
  
  const startDate = new Date('2023-01-01T07:30:00Z');
  const endDate = new Date('2024-03-31T23:00:00Z');

  let currentDate = new Date(startDate.getTime());

  while (currentDate <= endDate) {
    const month = currentDate.getUTCMonth(); // 0 - 11
    const dayOfWeek = currentDate.getUTCDay(); // 0 (Sun) - 6 (Sat)
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Number of tracks to listen today: 3 to 14 tracks, with occasional binge days
    const dailyTracksCount = isWeekend ? Math.floor(rng.range(6, 16)) : Math.floor(rng.range(4, 12));

    // Determine hour slots with peak hours: 8-10am (morning), 14-16pm (afternoon work), 20-23pm (evening/night)
    for (let i = 0; i < dailyTracksCount; i++) {
      // Pick hour with probability distribution
      const r = rng.next();
      let hour: number;
      if (r < 0.25) {
        hour = Math.floor(rng.range(8, 11)); // morning
      } else if (r < 0.55) {
        hour = Math.floor(rng.range(13, 17)); // afternoon
      } else if (r < 0.90) {
        hour = Math.floor(rng.range(19, 24)); // evening
      } else {
        hour = Math.floor(rng.range(0, 4)); // late night owl
      }

      const minute = Math.floor(rng.range(0, 59));
      const second = Math.floor(rng.range(0, 59));

      const eventDate = new Date(currentDate);
      eventDate.setUTCHours(hour, minute, second);

      // Select artist based on seasonal trend + catalog
      let artistWeightMap: { [artist: string]: number } = {};
      if (month <= 2) {
        // Winter: Frank Ocean, Arctic Monkeys, Brian Eno
        artistWeightMap = { 'Frank Ocean': 35, 'Arctic Monkeys': 30, 'Brian Eno': 15, 'Tame Impala': 10, 'SZA': 10 };
      } else if (month <= 5) {
        // Spring: Arctic Monkeys, Tame Impala, Kendrick Lamar, Dua Lipa
        artistWeightMap = { 'Arctic Monkeys': 30, 'Tame Impala': 25, 'Kendrick Lamar': 20, 'Dua Lipa': 15, 'Kiasmos': 10 };
      } else if (month <= 8) {
        // Summer: Daft Punk, The Midnight, Fred again.., Dua Lipa
        artistWeightMap = { 'Daft Punk': 35, 'The Midnight': 25, 'Fred again..': 20, 'Dua Lipa': 10, 'Kendrick Lamar': 10 };
      } else {
        // Autumn: Fred again.., The Midnight, Frank Ocean, Ludovico Einaudi
        artistWeightMap = { 'Fred again..': 30, 'The Midnight': 25, 'Frank Ocean': 20, 'Ludovico Einaudi': 15, 'Arctic Monkeys': 10 };
      }

      // Pick artist
      const artistsList = CATALOG.map(c => c.artist);
      const chosenArtistName = rng.choice(artistsList);
      const catalogItem = CATALOG.find(c => c.artist === chosenArtistName) || CATALOG[0];
      const album = rng.choice(catalogItem.albums);
      const track = rng.choice(album.tracks);

      // Determine skip behavior
      // Higher skip rate during morning rush or late night browsing
      const isSkipHour = hour >= 22 || hour <= 2 || (hour >= 8 && hour <= 9);
      const skipProb = isSkipHour ? 0.28 : 0.12;
      const isSkipped = rng.next() < skipProb;

      let msPlayed: number;
      let reasonEnd: string;
      if (isSkipped) {
        // Skipped in first 5-45 seconds
        msPlayed = Math.floor(rng.range(4000, 45000));
        reasonEnd = 'fwdbtn';
      } else {
        // Played full or near end
        msPlayed = track.durationMs;
        reasonEnd = rng.next() > 0.85 ? 'endplay' : 'trackdone';
      }

      records.push({
        ts: eventDate.toISOString(),
        username: 'sonic_curator',
        platform: rng.choice(platforms),
        ms_played: msPlayed,
        conn_country: 'US',
        ip_addr_decrypted: '192.168.1.1',
        user_agent_decrypted: 'Spotify/8.8.84 iOS/17.2',
        master_metadata_track_name: track.title,
        master_metadata_album_artist_name: catalogItem.artist,
        master_metadata_album_album_name: album.name,
        spotify_track_uri: `spotify:track:${Math.abs(Math.sin(i) * 1000000).toFixed(0)}`,
        episode_name: null,
        episode_show_name: null,
        spotify_episode_uri: null,
        reason_start: rng.choice(startReasons),
        reason_end: reasonEnd,
        shuffle: rng.next() > 0.4,
        skipped: isSkipped,
        offline: false,
        offline_timestamp: 0,
        incognito_mode: false,
      });
    }

    // Advance 1 day
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  // Sort ascending by timestamp
  return records.sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime());
}

export const SAMPLE_EXTENDED_HISTORY: SpotifyExtendedRecord[] = generateSampleExtendedHistory();
