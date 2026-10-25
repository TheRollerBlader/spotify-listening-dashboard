import {
  StreamRecord,
  FilterState,
  ArtistSummary,
  TrackSummary,
  GenreDistribution,
  BumpRankItem,
  RadialClockCell,
  DailyActivity,
  WrappedOverview,
} from '../types/spotify';
import { GENRE_COLORS } from '../data/genreMap';
import { calculateListeningPersona } from './persona';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function filterRecords(records: StreamRecord[], filters: FilterState): StreamRecord[] {
  const [minDateStr, maxDateStr] = filters.dateRange;
  const minTime = minDateStr ? new Date(`${minDateStr}T00:00:00Z`).getTime() : 0;
  const maxTime = maxDateStr ? new Date(`${maxDateStr}T23:59:59Z`).getTime() : Infinity;

  const query = filters.searchQuery.toLowerCase().trim();

  return records.filter(r => {
    // Threshold filter (e.g. ignore brief accidiental clicks under X ms)
    if (r.msPlayed < filters.minStreamMs) return false;

    // Date range
    const t = r.timestamp.getTime();
    if (t < minTime || t > maxTime) return false;

    // Search query
    if (query) {
      const matchArtist = r.artistName.toLowerCase().includes(query);
      const matchTrack = r.trackName.toLowerCase().includes(query);
      const matchAlbum = r.albumName.toLowerCase().includes(query);
      if (!matchArtist && !matchTrack && !matchAlbum) return false;
    }

    // Genre filter
    if (filters.selectedGenre && r.genre !== filters.selectedGenre) {
      return false;
    }

    // Artist filter
    if (filters.selectedArtist && r.artistName !== filters.selectedArtist) {
      return false;
    }

    return true;
  });
}

export function aggregateArtists(records: StreamRecord[], sortBy: 'minutes' | 'plays' = 'minutes'): ArtistSummary[] {
  const map = new Map<string, {
    totalMs: number;
    playCount: number;
    tracks: Map<string, number>;
    skipCount: number;
    genre: string;
  }>();

  for (const r of records) {
    let item = map.get(r.artistName);
    if (!item) {
      item = {
        totalMs: 0,
        playCount: 0,
        tracks: new Map(),
        skipCount: 0,
        genre: r.genre,
      };
      map.set(r.artistName, item);
    }
    item.totalMs += r.msPlayed;
    item.playCount += 1;
    if (r.skipped) item.skipCount += 1;
    item.tracks.set(r.trackName, (item.tracks.get(r.trackName) || 0) + 1);
  }

  const results: ArtistSummary[] = [];
  for (const [artist, data] of map.entries()) {
    // Find top track
    let topTrack = '';
    let topTrackCount = -1;
    for (const [tName, count] of data.tracks.entries()) {
      if (count > topTrackCount) {
        topTrackCount = count;
        topTrack = tName;
      }
    }

    results.push({
      artist,
      totalMs: data.totalMs,
      totalMinutes: Math.round(data.totalMs / 60000),
      playCount: data.playCount,
      uniqueTracks: data.tracks.size,
      skipCount: data.skipCount,
      skipRate: data.playCount > 0 ? data.skipCount / data.playCount : 0,
      genre: data.genre,
      topTrack,
    });
  }

  results.sort((a, b) => (sortBy === 'minutes' ? b.totalMinutes - a.totalMinutes : b.playCount - a.playCount));
  return results;
}

export function aggregateTracks(records: StreamRecord[], sortBy: 'minutes' | 'plays' = 'minutes'): TrackSummary[] {
  const map = new Map<string, {
    artist: string;
    album: string;
    totalMs: number;
    playCount: number;
    skipCount: number;
    genre: string;
  }>();

  for (const r of records) {
    const key = `${r.trackName}:::${r.artistName}`;
    let item = map.get(key);
    if (!item) {
      item = {
        artist: r.artistName,
        album: r.albumName,
        totalMs: 0,
        playCount: 0,
        skipCount: 0,
        genre: r.genre,
      };
      map.set(key, item);
    }
    item.totalMs += r.msPlayed;
    item.playCount += 1;
    if (r.skipped) item.skipCount += 1;
  }

  const results: TrackSummary[] = [];
  for (const [key, data] of map.entries()) {
    const track = key.split(':::')[0];
    results.push({
      track,
      artist: data.artist,
      album: data.album,
      totalMs: data.totalMs,
      totalMinutes: Math.round(data.totalMs / 60000),
      playCount: data.playCount,
      skipCount: data.skipCount,
      skipRate: data.playCount > 0 ? data.skipCount / data.playCount : 0,
      genre: data.genre,
    });
  }

  results.sort((a, b) => (sortBy === 'minutes' ? b.totalMinutes - a.totalMinutes : b.playCount - a.playCount));
  return results;
}

export function aggregateGenres(records: StreamRecord[]): GenreDistribution[] {
  const map = new Map<string, { totalMs: number; playCount: number }>();
  let totalAllMs = 0;

  for (const r of records) {
    const g = r.genre || 'Other / Eclectic';
    let item = map.get(g);
    if (!item) {
      item = { totalMs: 0, playCount: 0 };
      map.set(g, item);
    }
    item.totalMs += r.msPlayed;
    item.playCount += 1;
    totalAllMs += r.msPlayed;
  }

  const list: GenreDistribution[] = [];
  for (const [genre, data] of map.entries()) {
    const totalMinutes = Math.round(data.totalMs / 60000);
    const percentage = totalAllMs > 0 ? (data.totalMs / totalAllMs) * 100 : 0;
    list.push({
      genre,
      color: GENRE_COLORS[genre] || '#1DB954',
      totalMinutes,
      playCount: data.playCount,
      percentage: Number(percentage.toFixed(1)),
    });
  }

  list.sort((a, b) => b.totalMinutes - a.totalMinutes);
  return list;
}

export function aggregateRadialClock(records: StreamRecord[], metric: 'minutes' | 'plays' = 'minutes'): RadialClockCell[] {
  const grid: {
    minutes: number;
    plays: number;
    skips: number;
  }[][] = Array.from({ length: 7 }, () =>
    Array.from({ length: 24 }, () => ({ minutes: 0, plays: 0, skips: 0 }))
  );

  let maxVal = 0;

  for (const r of records) {
    const d = r.dayOfWeek;
    const h = r.hour;
    grid[d][h].minutes += r.minutesPlayed;
    grid[d][h].plays += 1;
    if (r.skipped) grid[d][h].skips += 1;
  }

  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      const v = metric === 'minutes' ? grid[d][h].minutes : grid[d][h].plays;
      if (v > maxVal) maxVal = v;
    }
  }

  const cells: RadialClockCell[] = [];
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      const val = metric === 'minutes' ? grid[d][h].minutes : grid[d][h].plays;
      const skipRate = grid[d][h].plays > 0 ? grid[d][h].skips / grid[d][h].plays : 0;
      cells.push({
        dayOfWeek: d,
        dayName: DAY_NAMES[d],
        hour: h,
        minutes: Math.round(grid[d][h].minutes),
        plays: grid[d][h].plays,
        skipRate: Number(skipRate.toFixed(2)),
        intensity: maxVal > 0 ? val / maxVal : 0,
      });
    }
  }

  return cells;
}

export function computeBumpData(
  records: StreamRecord[],
  mode: 'artists' | 'tracks',
  metric: 'minutes' | 'plays',
  topN = 8
): { items: BumpRankItem[]; periods: string[] } {
  // 1. Group records by month (YYYY-MM)
  const periodMap = new Map<string, StreamRecord[]>();
  for (const r of records) {
    const ym = r.yearMonth;
    if (!periodMap.has(ym)) periodMap.set(ym, []);
    periodMap.get(ym)!.push(r);
  }

  const sortedPeriods = Array.from(periodMap.keys()).sort();
  if (sortedPeriods.length === 0) return { items: [], periods: [] };

  // 2. Identify top overall candidates
  const overallTally = new Map<string, number>();
  for (const r of records) {
    const name = mode === 'artists' ? r.artistName : `${r.trackName} (${r.artistName})`;
    const val = metric === 'minutes' ? r.minutesPlayed : 1;
    overallTally.set(name, (overallTally.get(name) || 0) + val);
  }

  const topOverallNames = Array.from(overallTally.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(e => e[0]);

  // Vivid palette for bump charts
  const colors = [
    '#1DB954', // Spotify Green
    '#00d2d3', // Cyan
    '#ff9f43', // Orange
    '#ee5253', // Red
    '#5f27cd', // Purple
    '#ff6b6b', // Coral
    '#54a0ff', // Light Blue
    '#feca57', // Yellow
    '#10ac84', // Dark Cyan
    '#ff9ff3', // Pink
  ];

  const items: BumpRankItem[] = topOverallNames.map((name, i) => ({
    name,
    color: colors[i % colors.length],
    ranks: [],
  }));

  // 3. For each period, calculate ranks of all items in that period
  for (const p of sortedPeriods) {
    const recs = periodMap.get(p) || [];
    const pTally = new Map<string, number>();

    for (const r of recs) {
      const name = mode === 'artists' ? r.artistName : `${r.trackName} (${r.artistName})`;
      const val = metric === 'minutes' ? r.minutesPlayed : 1;
      pTally.set(name, (pTally.get(name) || 0) + val);
    }

    // Rank all entries in this period
    const sortedPeriodEntries = Array.from(pTally.entries()).sort((a, b) => b[1] - a[1]);
    const rankLookup = new Map<string, { rank: number; value: number }>();
    sortedPeriodEntries.forEach((entry, idx) => {
      rankLookup.set(entry[0], { rank: idx + 1, value: Math.round(entry[1]) });
    });

    // Assign rank to our top tracked items
    for (const item of items) {
      const found = rankLookup.get(item.name);
      if (found && found.rank <= topN + 3) {
        item.ranks.push({ period: p, rank: found.rank, value: found.value });
      } else {
        // Unranked in this period (position at topN + 1)
        item.ranks.push({ period: p, rank: topN + 1, value: found ? found.value : 0 });
      }
    }
  }

  return { items, periods: sortedPeriods };
}

export function computeDailyActivities(records: StreamRecord[], targetYear?: number): {
  days: DailyActivity[];
  currentStreak: number;
  longestStreak: number;
  totalDaysListened: number;
} {
  // Determine year
  let year = targetYear;
  if (!year && records.length > 0) {
    // default to year with most streams
    const yearCounts = new Map<number, number>();
    for (const r of records) {
      yearCounts.set(r.year, (yearCounts.get(r.year) || 0) + 1);
    }
    let maxCount = -1;
    for (const [y, cnt] of yearCounts.entries()) {
      if (cnt > maxCount) {
        maxCount = cnt;
        year = y;
      }
    }
  }
  if (!year) year = new Date().getFullYear();

  // Aggregate daily records
  const dayStats = new Map<string, {
    minutes: number;
    plays: number;
    tracks: Map<string, number>;
    artists: Map<string, number>;
  }>();

  let maxDailyMinutes = 0;

  for (const r of records) {
    if (r.year !== year) continue;
    let stat = dayStats.get(r.isoDate);
    if (!stat) {
      stat = { minutes: 0, plays: 0, tracks: new Map(), artists: new Map() };
      dayStats.set(r.isoDate, stat);
    }
    stat.minutes += r.minutesPlayed;
    stat.plays += 1;
    stat.tracks.set(r.trackName, (stat.tracks.get(r.trackName) || 0) + 1);
    stat.artists.set(r.artistName, (stat.artists.get(r.artistName) || 0) + 1);

    if (stat.minutes > maxDailyMinutes) {
      maxDailyMinutes = stat.minutes;
    }
  }

  // Generate all 365/366 days
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const totalDays = isLeap ? 366 : 365;

  const days: DailyActivity[] = [];
  const startOfYear = new Date(Date.UTC(year, 0, 1));

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let totalDaysListened = 0;

  for (let d = 0; d < totalDays; d++) {
    const curDate = new Date(startOfYear);
    curDate.setUTCDate(startOfYear.getUTCDate() + d);

    const y = curDate.getUTCFullYear();
    const m = String(curDate.getUTCMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(curDate.getUTCDate()).padStart(2, '0');
    const isoDate = `${y}-${m}-${dayOfMonth}`;

    const stat = dayStats.get(isoDate);
    const minutes = stat ? Math.round(stat.minutes) : 0;
    const plays = stat ? stat.plays : 0;

    let topTrack = '';
    let topArtist = '';
    if (stat) {
      let tCount = -1;
      for (const [t, c] of stat.tracks.entries()) {
        if (c > tCount) { tCount = c; topTrack = t; }
      }
      let aCount = -1;
      for (const [a, c] of stat.artists.entries()) {
        if (c > aCount) { aCount = c; topArtist = a; }
      }
    }

    // Determine heat level (0 - 4)
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (minutes > 0) {
      totalDaysListened++;
      tempStreak++;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
      if (minutes >= 120) level = 4;
      else if (minutes >= 60) level = 3;
      else if (minutes >= 25) level = 2;
      else level = 1;
    } else {
      tempStreak = 0;
    }

    days.push({
      date: isoDate,
      dayOfWeek: curDate.getUTCDay(),
      month: curDate.getUTCMonth(),
      year,
      minutes,
      plays,
      topTrack: topTrack || undefined,
      topArtist: topArtist || undefined,
      level,
    });
  }

  // Calculate current streak backwards from latest day with listens
  let cur = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].minutes > 0) cur++;
    else if (cur > 0) break;
  }
  currentStreak = cur;

  return { days, currentStreak, longestStreak, totalDaysListened };
}

export function computeWrappedOverview(records: StreamRecord[]): WrappedOverview {
  let totalMs = 0;
  let skipCount = 0;
  const artistsSet = new Set<string>();
  const tracksSet = new Set<string>();
  const albumsSet = new Set<string>();

  const dayTotals = new Map<string, number>();
  const hourTotals = new Array(24).fill(0);

  for (const r of records) {
    totalMs += r.msPlayed;
    if (r.skipped) skipCount++;
    artistsSet.add(r.artistName);
    tracksSet.add(`${r.trackName}:::${r.artistName}`);
    if (r.albumName) albumsSet.add(r.albumName);

    dayTotals.set(r.isoDate, (dayTotals.get(r.isoDate) || 0) + r.msPlayed);
    hourTotals[r.hour] += r.msPlayed;
  }

  const artists = aggregateArtists(records, 'minutes');
  const tracks = aggregateTracks(records, 'minutes');
  const genres = aggregateGenres(records);

  // Peak day
  let peakDay = { date: 'N/A', minutes: 0 };
  for (const [d, ms] of dayTotals.entries()) {
    const mins = Math.round(ms / 60000);
    if (mins > peakDay.minutes) {
      peakDay = { date: d, minutes: mins };
    }
  }

  // Peak hour
  let peakHour = 0;
  let maxHourMs = -1;
  for (let h = 0; h < 24; h++) {
    if (hourTotals[h] > maxHourMs) {
      maxHourMs = hourTotals[h];
      peakHour = h;
    }
  }

  const totalMinutes = Math.round(totalMs / 60000);
  const persona = calculateListeningPersona(records, artists, genres);

  return {
    totalMinutes,
    totalHours: Number((totalMinutes / 60).toFixed(1)),
    totalDays: Number((totalMinutes / 1440).toFixed(1)),
    totalStreams: records.length,
    uniqueArtists: artistsSet.size,
    uniqueTracks: tracksSet.size,
    uniqueAlbums: albumsSet.size,
    overallSkipRate: records.length > 0 ? Number((skipCount / records.length).toFixed(3)) : 0,
    topArtist: artists.length > 0 ? artists[0] : null,
    topTrack: tracks.length > 0 ? tracks[0] : null,
    topGenre: genres.length > 0 ? genres[0].genre : 'Eclectic',
    peakListeningDay: peakDay,
    peakListeningHour: peakHour,
    persona,
  };
}
