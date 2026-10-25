import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { StreamRecord } from '../types/spotify';
import { aggregateArtists } from '../utils/aggregations';
import { FastForward, CheckCircle, ThumbsDown, Heart, AlertCircle } from 'lucide-react';

interface SkipRateAnalysisProps {
  records: StreamRecord[];
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const SkipRateAnalysis: React.FC<SkipRateAnalysisProps> = ({ records }) => {
  // 1. Hourly Skip Rate (0 - 23)
  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      label: `${String(i).padStart(2, '0')}:00`,
      total: 0,
      skips: 0,
      skipRate: 0,
    }));

    for (const r of records) {
      hours[r.hour].total += 1;
      if (r.skipped) hours[r.hour].skips += 1;
    }

    return hours.map((h) => ({
      ...h,
      skipRate: h.total > 0 ? Math.round((h.skips / h.total) * 100) : 0,
    }));
  }, [records]);

  // 2. Reason for End Breakdown
  const reasonEndData = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of records) {
      const reason = r.reasonEnd || (r.skipped ? 'fwdbtn' : 'trackdone');
      counts.set(reason, (counts.get(reason) || 0) + 1);
    }

    const palette: Record<string, string> = {
      trackdone: '#1DB954',
      fwdbtn: '#ff7675',
      endplay: '#fdcb6e',
      backbtn: '#74b9ff',
      unexpected_exit: '#d63031',
      unknown: '#636e72',
    };

    return Array.from(counts.entries())
      .map(([name, value]) => ({
        name: name === 'trackdone' ? 'Completed Naturally' : name === 'fwdbtn' ? 'Forward Button Skip' : name === 'endplay' ? 'App / Playback Stopped' : name,
        rawName: name,
        value,
        color: palette[name] || '#a29bfe',
        percent: records.length > 0 ? Math.round((value / records.length) * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [records]);

  // 3. Artist Loyalty & Skip Comparison
  const { loyalArtists, skippedArtists } = useMemo(() => {
    const artists = aggregateArtists(records, 'plays').filter((a) => a.playCount >= 5);

    const sortedBySkip = [...artists].sort((a, b) => b.skipRate - a.skipRate);
    const sortedByLoyalty = [...artists].sort((a, b) => a.skipRate - b.skipRate);

    return {
      skippedArtists: sortedBySkip.slice(0, 5),
      loyalArtists: sortedByLoyalty.slice(0, 5),
    };
  }, [records]);

  // Overall skip rate
  const overallSkipRate = useMemo(() => {
    if (records.length === 0) return 0;
    const skips = records.filter((r) => r.skipped).length;
    return Math.round((skips / records.length) * 100);
  }, [records]);

  return (
    <div className="bg-[#181818] border border-[#282828] rounded-2xl p-6 shadow-xl mb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-yellow-500/20 text-yellow-400">
              <FastForward className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Skip-Rate Analysis &amp; Listener Patience
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Identify your restlessness patterns, track conclusion triggers, and artist loyalty indices
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#121212] px-3 py-1.5 rounded-xl border border-[#2e2e2e] text-xs">
            <span className="text-gray-400">Average Skip Rate:</span>{' '}
            <strong className="text-yellow-400 font-mono text-sm">{overallSkipRate}%</strong>
          </div>
        </div>
      </div>

      {/* Main Grid: Hourly Bar Chart + Reasons Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Hourly Skip Rate Chart */}
        <div className="lg:col-span-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Skip Rate by Hour of the Day (0:00 - 23:00)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="label"
                  stroke="#666"
                  fontSize={10}
                  tickLine={false}
                  fontFamily="monospace"
                  interval={2}
                />
                <YAxis
                  stroke="#666"
                  fontSize={10}
                  tickLine={false}
                  unit="%"
                  domain={[0, 100]}
                  fontFamily="monospace"
                />
                <Tooltip
                  content={({ active, payload }: any) => {
                    if (!active || !payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-[#242424] border border-[#3e3e3e] rounded-xl p-3 text-xs shadow-2xl text-white">
                        <div className="font-bold text-gray-200 mb-1">{d.label}</div>
                        <div className="text-yellow-400 font-mono font-bold">
                          Skip Rate: {d.skipRate}%
                        </div>
                        <div className="text-gray-400 text-[11px] mt-0.5">
                          {d.skips} skipped out of {d.total} plays
                        </div>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="skipRate" radius={[4, 4, 0, 0]}>
                  {hourlyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.skipRate > 25 ? '#ff7675' : entry.skipRate > 15 ? '#fdcb6e' : '#1DB954'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">
            Bars colored <span className="text-[#1DB954] font-medium">green (&lt;15%)</span>,{' '}
            <span className="text-yellow-400 font-medium">yellow (15-25%)</span>, and{' '}
            <span className="text-red-400 font-medium">red (&gt;25%)</span> illustrate restlessness spikes.
          </p>
        </div>

        {/* Reason for Playback End */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Playback Conclusion Triggers
          </h3>
          <div className="space-y-2.5">
            {reasonEndData.map((item) => (
              <div key={item.name} className="bg-[#121212] p-3 rounded-xl border border-[#262626]">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-2 text-gray-300 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </span>
                  <span className="font-mono font-bold text-white">{item.percent}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#222] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                  />
                </div>
                <div className="text-[10px] text-gray-500 mt-1">
                  {item.value.toLocaleString()} occurrences
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Artist Loyalty vs Skip Ratio Duel */}
      <div className="pt-6 border-t border-[#242424] grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Loyal / Least Skipped */}
        <div className="bg-[#121212] rounded-2xl p-4 border border-[#262626]">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-[#1DB954]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              The "No-Skip" Artists (Highest Loyalty)
            </h4>
          </div>
          <div className="space-y-2">
            {loyalArtists.map((artist, idx) => (
              <div
                key={artist.artist}
                className="flex items-center justify-between p-2 rounded-lg bg-[#181818] text-xs hover:bg-[#202020] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-gray-500 w-4 text-center">#{idx + 1}</span>
                  <div>
                    <div className="font-bold text-white">{artist.artist}</div>
                    <div className="text-[10px] text-gray-500">{artist.playCount} total plays</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-[#1DB954] border border-emerald-500/30 font-mono font-bold">
                    {Math.round(artist.skipRate * 100)}% skip
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Skipped Artists */}
        <div className="bg-[#121212] rounded-2xl p-4 border border-[#262626]">
          <div className="flex items-center gap-2 mb-3">
            <ThumbsDown className="w-4 h-4 text-red-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Most Skipped Artists (Impatience Factor)
            </h4>
          </div>
          <div className="space-y-2">
            {skippedArtists.map((artist, idx) => (
              <div
                key={artist.artist}
                className="flex items-center justify-between p-2 rounded-lg bg-[#181818] text-xs hover:bg-[#202020] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-gray-500 w-4 text-center">#{idx + 1}</span>
                  <div>
                    <div className="font-bold text-white">{artist.artist}</div>
                    <div className="text-[10px] text-gray-500">{artist.playCount} total plays</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full bg-red-950/60 text-red-400 border border-red-500/30 font-mono font-bold">
                    {Math.round(artist.skipRate * 100)}% skip
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
