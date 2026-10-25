import React, { useState, useMemo } from 'react';
import { StreamRecord, BumpRankItem } from '../types/spotify';
import { computeBumpData } from '../utils/aggregations';
import { TrendingUp, Users, Music } from 'lucide-react';

interface BumpChartProps {
  records: StreamRecord[];
  metric: 'minutes' | 'plays';
}

export const BumpChart: React.FC<BumpChartProps> = ({ records, metric }) => {
  const [mode, setMode] = useState<'artists' | 'tracks'>('artists');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [topN, setTopN] = useState<number>(8);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    name: string;
    period: string;
    rank: number;
    value: number;
  } | null>(null);

  const { items, periods } = useMemo(() => {
    return computeBumpData(records, mode, metric, topN);
  }, [records, mode, metric, topN]);

  // Dimensions
  const width = 860;
  const height = 380;
  const margin = { top: 30, right: 120, bottom: 40, left: 50 };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Scales
  const getX = (periodIndex: number) => {
    if (periods.length <= 1) return innerWidth / 2;
    return (periodIndex / (periods.length - 1)) * innerWidth;
  };

  const maxRank = topN + 1; // last rank is unranked
  const getY = (rank: number) => {
    // 1 at top, maxRank at bottom
    return ((rank - 1) / (maxRank - 1)) * innerHeight;
  };

  // Build cubic bezier path string
  const createRibbonPath = (ranks: { period: string; rank: number; value: number }[]) => {
    if (ranks.length === 0) return '';
    let d = '';

    ranks.forEach((pt, i) => {
      const x = getX(i);
      const y = getY(pt.rank);

      if (i === 0) {
        d = `M ${x} ${y}`;
      } else {
        const prevX = getX(i - 1);
        const prevY = getY(ranks[i - 1].rank);
        const c1X = prevX + (x - prevX) / 2;
        const c1Y = prevY;
        const c2X = prevX + (x - prevX) / 2;
        const c2Y = y;
        d += ` C ${c1X} ${c1Y}, ${c2X} ${c2Y}, ${x} ${y}`;
      }
    });

    return d;
  };

  if (periods.length < 2 || items.length === 0) {
    return (
      <div className="bg-[#181818] border border-[#282828] rounded-2xl p-6 text-center text-gray-400">
        <TrendingUp className="w-8 h-8 mx-auto mb-2 text-gray-500" />
        <p className="text-sm">Not enough monthly data to render ranking transitions.</p>
        <p className="text-xs text-gray-500 mt-1">Select a broader date range or upload additional history files.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#181818] border border-[#282828] rounded-2xl p-6 shadow-xl mb-10">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#1DB954]/20 text-[#1DB954]">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Ranking Transitions Over Time (Bump Chart)
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Visualize how your top {mode} battled for the #1 spot month by month
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Mode Switcher */}
          <div className="flex items-center bg-[#121212] p-1 rounded-xl border border-[#2e2e2e]">
            <button
              onClick={() => setMode('artists')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'artists'
                  ? 'bg-[#1DB954] text-black shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>Artists</span>
            </button>
            <button
              onClick={() => setMode('tracks')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'tracks'
                  ? 'bg-[#1DB954] text-black shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Music className="w-3 h-3" />
              <span>Tracks</span>
            </button>
          </div>

          {/* Top N filter */}
          <select
            value={topN}
            onChange={(e) => setTopN(Number(e.target.value))}
            className="bg-[#121212] border border-[#2e2e2e] text-xs font-medium text-gray-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#1DB954]"
          >
            <option value={5}>Top 5</option>
            <option value={8}>Top 8</option>
            <option value={10}>Top 10</option>
          </select>
        </div>
      </div>

      {/* Responsive SVG Chart */}
      <div className="relative overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[700px] select-none"
        >
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* Rank horizontal grid lines & labels */}
            {Array.from({ length: topN }).map((_, idx) => {
              const rank = idx + 1;
              const y = getY(rank);
              return (
                <g key={`grid-rank-${rank}`}>
                  <line
                    x1={0}
                    y1={y}
                    x2={innerWidth}
                    y2={y}
                    stroke="#262626"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                  />
                  <text
                    x={-15}
                    y={y + 4}
                    textAnchor="end"
                    fill={rank === 1 ? '#1DB954' : '#888'}
                    fontSize={11}
                    fontWeight={rank === 1 ? 'bold' : 'normal'}
                    fontFamily="monospace"
                  >
                    #{rank}
                  </text>
                </g>
              );
            })}

            {/* Period vertical grid lines & labels */}
            {periods.map((p, i) => {
              const x = getX(i);
              return (
                <g key={`period-${p}`}>
                  <line
                    x1={x}
                    y1={0}
                    x2={x}
                    y2={innerHeight}
                    stroke="#222"
                    strokeWidth={1}
                  />
                  <text
                    x={x}
                    y={innerHeight + 24}
                    textAnchor="middle"
                    fill="#aaa"
                    fontSize={11}
                    fontFamily="monospace"
                  >
                    {p}
                  </text>
                </g>
              );
            })}

            {/* Ribbons / Paths for each candidate */}
            {items.map((item) => {
              const isHovered = hoveredItem === item.name;
              const isDimmed = hoveredItem !== null && !isHovered;
              const pathD = createRibbonPath(item.ranks);

              return (
                <g
                  key={`ribbon-${item.name}`}
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => {
                    setHoveredItem(null);
                    setTooltip(null);
                  }}
                  className="cursor-pointer transition-opacity duration-200"
                  opacity={isDimmed ? 0.15 : 1}
                >
                  {/* Outer glow stroke when hovered */}
                  {isHovered && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke={item.color}
                      strokeWidth={10}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={0.3}
                    />
                  )}

                  {/* Main smooth curve */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={item.color}
                    strokeWidth={isHovered ? 4 : 2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Ranking Nodes (Circles with rank numbers) */}
                  {item.ranks.map((pt, i) => {
                    const cx = getX(i);
                    const cy = getY(pt.rank);
                    const isRanked = pt.rank <= topN;

                    return (
                      <g
                        key={`node-${item.name}-${pt.period}`}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltip({
                            x: cx + margin.left,
                            y: cy + margin.top,
                            name: item.name,
                            period: pt.period,
                            rank: pt.rank,
                            value: pt.value,
                          });
                        }}
                      >
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isHovered ? 7 : 5}
                          fill={isRanked ? item.color : '#333'}
                          stroke="#181818"
                          strokeWidth={2}
                        />
                      </g>
                    );
                  })}

                  {/* Right-hand End Label */}
                  {item.ranks.length > 0 && (
                    <text
                      x={innerWidth + 12}
                      y={getY(item.ranks[item.ranks.length - 1].rank) + 4}
                      fill={isHovered ? '#fff' : item.color}
                      fontSize={11}
                      fontWeight={isHovered ? 'bold' : 'normal'}
                      className="transition-colors"
                    >
                      {item.name.length > 18 ? item.name.substring(0, 16) + '...' : item.name}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Hover Tooltip */}
        {tooltip && (
          <div
            className="absolute z-30 pointer-events-none bg-[#242424] border border-[#3e3e3e] rounded-xl px-3 py-2 text-xs shadow-2xl text-white transform -translate-x-1/2 -translate-y-full mb-2"
            style={{ left: `${tooltip.x}px`, top: `${tooltip.y - 10}px` }}
          >
            <div className="font-bold text-[#1DB954]">{tooltip.name}</div>
            <div className="text-gray-300">
              Period: <span className="font-mono text-white">{tooltip.period}</span>
            </div>
            <div className="text-gray-300">
              Rank:{' '}
              <strong className="text-white">
                {tooltip.rank <= topN ? `#${tooltip.rank}` : 'Unranked'}
              </strong>
            </div>
            <div className="text-gray-300">
              {metric === 'minutes' ? 'Minutes' : 'Streams'}:{' '}
              <strong className="text-emerald-400 font-mono">
                {tooltip.value.toLocaleString()}
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Legend */}
      <div className="mt-4 pt-4 border-t border-[#242424] flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-500 mr-2">Focus item:</span>
        {items.map((item) => (
          <button
            key={item.name}
            onClick={() => setHoveredItem(hoveredItem === item.name ? null : item.name)}
            onMouseEnter={() => setHoveredItem(item.name)}
            onMouseLeave={() => setHoveredItem(null)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all ${
              hoveredItem === item.name
                ? 'bg-[#333] text-white ring-1 ring-white/40'
                : 'bg-[#141414] text-gray-300 hover:bg-[#242424]'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="truncate max-w-[130px]">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
