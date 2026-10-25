import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { StreamRecord, GenreDistribution } from '../types/spotify';
import { aggregateGenres } from '../utils/aggregations';
import { GENRE_COLORS } from '../data/genreMap';
import { Layers, PieChart } from 'lucide-react';

interface GenreStreamgraphProps {
  records: StreamRecord[];
  metric: 'minutes' | 'plays';
}

export const GenreStreamgraph: React.FC<GenreStreamgraphProps> = ({ records, metric }) => {
  const [displayMode, setDisplayMode] = useState<'stacked' | 'expand'>('stacked'); // 'stacked' = absolute, 'expand' = 100% normalized

  const genreTotals: GenreDistribution[] = useMemo(() => {
    return aggregateGenres(records);
  }, [records]);

  // Group by month and calculate value for top genres
  const { chartData, topGenresList } = useMemo(() => {
    const topGenres = genreTotals.slice(0, 7).map((g) => g.genre);

    // map: month -> { month: 'YYYY-MM', [genre]: number }
    const monthMap = new Map<string, Record<string, any>>();

    for (const r of records) {
      const ym = r.yearMonth;
      if (!monthMap.has(ym)) {
        const initObj: Record<string, any> = { month: ym };
        topGenres.forEach((g) => (initObj[g] = 0));
        initObj['Other / Eclectic'] = 0;
        monthMap.set(ym, initObj);
      }

      const obj = monthMap.get(ym)!;
      const g = topGenres.includes(r.genre) ? r.genre : 'Other / Eclectic';
      const val = metric === 'minutes' ? r.minutesPlayed : 1;
      obj[g] = (obj[g] || 0) + val;
    }

    const sortedMonths = Array.from(monthMap.keys()).sort();
    const data = sortedMonths.map((m) => {
      const row = monthMap.get(m)!;
      const roundedRow: Record<string, any> = { month: m };
      let sum = 0;
      for (const k in row) {
        if (k !== 'month') {
          roundedRow[k] = Math.round(row[k]);
          sum += roundedRow[k];
        }
      }
      roundedRow.__sum = sum;
      return roundedRow;
    });

    const activeGenres = [...topGenres];
    if (!activeGenres.includes('Other / Eclectic')) {
      activeGenres.push('Other / Eclectic');
    }

    return { chartData: data, topGenresList: activeGenres };
  }, [records, genreTotals, metric]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-[#242424] border border-[#3e3e3e] rounded-xl p-3 text-xs shadow-2xl text-white">
        <div className="font-bold text-gray-200 border-b border-[#333] pb-1.5 mb-2 font-mono">
          {label}
        </div>
        <div className="space-y-1">
          {payload.map((entry: any) => {
            const val = entry.value;
            const color = entry.color;
            if (val === 0) return null;
            return (
              <div key={entry.name} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <span>{entry.name}</span>
                </span>
                <span className="font-mono font-semibold text-white">
                  {val.toLocaleString()} {metric === 'minutes' ? 'min' : 'plays'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#181818] border border-[#282828] rounded-2xl p-6 shadow-xl mb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Layers className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Genre Distribution Over Time (Streamgraph)
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Observe the sonic evolution of your genres across seasons and months
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-[#121212] p-1 rounded-xl border border-[#2e2e2e]">
          <button
            onClick={() => setDisplayMode('stacked')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              displayMode === 'stacked'
                ? 'bg-[#1DB954] text-black shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Volume Stream
          </button>
          <button
            onClick={() => setDisplayMode('expand')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              displayMode === 'expand'
                ? 'bg-[#1DB954] text-black shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            100% Share
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-72 w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              stackOffset={displayMode === 'expand' ? 'expand' : 'none'}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                {topGenresList.map((genre) => {
                  const color = GENRE_COLORS[genre] || '#1DB954';
                  const id = `genre-grad-${genre.replace(/[^a-zA-Z0-9]/g, '')}`;
                  return (
                    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={color} stopOpacity={0.2} />
                    </linearGradient>
                  );
                })}
              </defs>
              <XAxis
                dataKey="month"
                stroke="#666"
                fontSize={11}
                tickLine={false}
                fontFamily="monospace"
              />
              <YAxis
                stroke="#666"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => (displayMode === 'expand' ? `${Math.round(v * 100)}%` : `${v}`)}
                fontFamily="monospace"
              />
              <Tooltip content={<CustomTooltip />} />
              {topGenresList.map((genre) => {
                const color = GENRE_COLORS[genre] || '#1DB954';
                const id = `genre-grad-${genre.replace(/[^a-zA-Z0-9]/g, '')}`;
                return (
                  <Area
                    key={genre}
                    type="monotone"
                    dataKey={genre}
                    stackId="1"
                    stroke={color}
                    fill={`url(#${id})`}
                    strokeWidth={1.5}
                  />
                );
              })}
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 text-xs">
            No genre data available for the selected filters.
          </div>
        )}
      </div>

      {/* Genre share badges row */}
      <div className="mt-6 pt-4 border-t border-[#242424] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {genreTotals.slice(0, 6).map((g) => (
          <div key={g.genre} className="bg-[#121212] rounded-xl p-3 border border-[#262626]">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: g.color }} />
              <span className="text-xs font-bold text-white truncate" title={g.genre}>
                {g.genre.split('/')[0].trim()}
              </span>
            </div>
            <div className="text-base font-extrabold text-white font-mono">{g.percentage}%</div>
            <div className="text-[11px] text-gray-400 font-mono">
              {metric === 'minutes' ? `${g.totalMinutes.toLocaleString()} min` : `${g.playCount.toLocaleString()} plays`}
            </div>
            {/* Tiny progress bar */}
            <div className="mt-2 w-full h-1 bg-[#222] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${g.percentage}%`, backgroundColor: g.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
