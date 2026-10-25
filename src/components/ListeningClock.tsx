import React, { useState, useMemo } from 'react';
import { StreamRecord, RadialClockCell } from '../types/spotify';
import { aggregateRadialClock } from '../utils/aggregations';
import { Clock, Sun, Moon, Sparkles, Grid } from 'lucide-react';

interface ListeningClockProps {
  records: StreamRecord[];
  metric: 'minutes' | 'plays';
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const ListeningClock: React.FC<ListeningClockProps> = ({ records, metric }) => {
  const [viewMode, setViewMode] = useState<'radial' | 'matrix'>('radial');
  const [hoveredCell, setHoveredCell] = useState<RadialClockCell | null>(null);

  const cells = useMemo(() => {
    return aggregateRadialClock(records, metric);
  }, [records, metric]);

  // Dimensions for radial polar clock
  const size = 520;
  const center = size / 2;
  const innerRadius = 55;
  const outerRadius = 220;
  const ringWidth = (outerRadius - innerRadius) / 7;

  // Peak metrics calculation
  const { peakCell, nightPercent, morningPercent } = useMemo(() => {
    let max = -1;
    let peak: RadialClockCell | null = null;
    let nightSum = 0;
    let morningSum = 0;
    let total = 0;

    for (const c of cells) {
      const v = metric === 'minutes' ? c.minutes : c.plays;
      if (v > max) {
        max = v;
        peak = c;
      }
      total += v;
      if (c.hour >= 22 || c.hour <= 4) nightSum += v;
      if (c.hour >= 6 && c.hour <= 10) morningSum += v;
    }

    return {
      peakCell: peak,
      nightPercent: total > 0 ? Math.round((nightSum / total) * 100) : 0,
      morningPercent: total > 0 ? Math.round((morningSum / total) * 100) : 0,
    };
  }, [cells, metric]);

  // Color interpolator for heat intensity (dark charcoal -> dark green -> bright spotify green -> neon glow)
  const getHeatColor = (intensity: number) => {
    if (intensity === 0) return '#1a1a1a';
    if (intensity < 0.25) return '#0e3d1c';
    if (intensity < 0.5) return '#14632b';
    if (intensity < 0.75) return '#1aa345';
    if (intensity < 0.9) return '#1DB954';
    return '#1ed760'; // max glow
  };

  // Helper to generate SVG arc path for sector
  const describeArc = (
    cx: number,
    cy: number,
    rIn: number,
    rOut: number,
    startAngleDeg: number,
    endAngleDeg: number
  ) => {
    const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
    const startRad = toRad(startAngleDeg);
    const endRad = toRad(endAngleDeg);

    const x1 = cx + rIn * Math.cos(startRad);
    const y1 = cy + rIn * Math.sin(startRad);
    const x2 = cx + rOut * Math.cos(startRad);
    const y2 = cy + rOut * Math.sin(startRad);
    const x3 = cx + rOut * Math.cos(endRad);
    const y3 = cy + rOut * Math.sin(endRad);
    const x4 = cx + rIn * Math.cos(endRad);
    const y4 = cy + rIn * Math.sin(endRad);

    const largeArc = endAngleDeg - startAngleDeg > 180 ? 1 : 0;

    return `M ${x1} ${y1} L ${x2} ${y2} A ${rOut} ${rOut} 0 ${largeArc} 1 ${x3} ${y3} L ${x4} ${y4} A ${rIn} ${rIn} 0 ${largeArc} 0 ${x1} ${y1} Z`;
  };

  return (
    <div className="bg-[#181818] border border-[#282828] rounded-2xl p-6 shadow-xl mb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#1DB954]/20 text-[#1DB954]">
              <Clock className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              The Listening Clock (Radial Heatmap)
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Polar coordinate visualization of your weekly listening rhythm across 24 hours of the day
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-[#121212] p-1 rounded-xl border border-[#2e2e2e]">
          <button
            onClick={() => setViewMode('radial')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'radial'
                ? 'bg-[#1DB954] text-black shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Radial Polar</span>
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'matrix'
                ? 'bg-[#1DB954] text-black shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>7×24 Matrix</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Visualizer Display */}
        <div className="lg:col-span-8 flex justify-center relative">
          {viewMode === 'radial' ? (
            <div className="relative">
              <svg width={size} height={size} className="select-none overflow-visible max-w-full h-auto">
                {/* Background Guide Circles */}
                <circle cx={center} cy={center} r={outerRadius} fill="none" stroke="#252525" strokeWidth={1} />
                <circle cx={center} cy={center} r={innerRadius} fill="#141414" stroke="#252525" strokeWidth={1} />

                {/* 24 Hour Radial Wedges x 7 Days */}
                {cells.map((cell) => {
                  const rIn = innerRadius + cell.dayOfWeek * ringWidth;
                  const rOut = rIn + ringWidth - 1.5; // slight gap
                  const hourAngle = 360 / 24;
                  const startAngle = cell.hour * hourAngle + 0.8;
                  const endAngle = startAngle + hourAngle - 1.6;

                  const pathD = describeArc(center, cy_fix(center), rIn, rOut, startAngle, endAngle);
                  const isHovered =
                    hoveredCell?.dayOfWeek === cell.dayOfWeek && hoveredCell?.hour === cell.hour;

                  return (
                    <path
                      key={`arc-${cell.dayOfWeek}-${cell.hour}`}
                      d={pathD}
                      fill={getHeatColor(cell.intensity)}
                      stroke={isHovered ? '#fff' : '#141414'}
                      strokeWidth={isHovered ? 2 : 0.8}
                      className="cursor-pointer transition-all duration-150 hover:brightness-125"
                      onMouseEnter={() => setHoveredCell(cell)}
                      onMouseLeave={() => setHoveredCell(null)}
                    />
                  );
                })}

                {/* 24 Hour Hour Markers around edge */}
                {Array.from({ length: 24 }).map((_, h) => {
                  const angleDeg = h * (360 / 24);
                  const rad = ((angleDeg - 90) * Math.PI) / 180;
                  const labelRadius = outerRadius + 18;
                  const lx = center + labelRadius * Math.cos(rad);
                  const ly = center + labelRadius * Math.sin(rad);

                  // Only show key hours: 0, 3, 6, 9, 12, 15, 18, 21
                  if (h % 3 !== 0) return null;

                  return (
                    <text
                      key={`hour-lbl-${h}`}
                      x={lx}
                      y={ly + 4}
                      textAnchor="middle"
                      fill="#888"
                      fontSize={10}
                      fontFamily="monospace"
                    >
                      {String(h).padStart(2, '0')}:00
                    </text>
                  );
                })}

                {/* Center Badge / Hover Feedback */}
                <g transform={`translate(${center}, ${center})`} pointerEvents="none">
                  {hoveredCell ? (
                    <>
                      <text
                        y={-6}
                        textAnchor="middle"
                        fill="#1DB954"
                        fontSize={13}
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {String(hoveredCell.hour).padStart(2, '0')}:00
                      </text>
                      <text y={10} textAnchor="middle" fill="#ccc" fontSize={10}>
                        {hoveredCell.dayName.substring(0, 3)}
                      </text>
                    </>
                  ) : (
                    <>
                      <text y={-4} textAnchor="middle" fill="#aaa" fontSize={10} fontWeight="bold">
                        24H
                      </text>
                      <text y={10} textAnchor="middle" fill="#1DB954" fontSize={9} fontFamily="monospace">
                        CLOCK
                      </text>
                    </>
                  )}
                </g>
              </svg>
            </div>
          ) : (
            /* Matrix Grid View (7 Days x 24 Hours) */
            <div className="w-full overflow-x-auto">
              <div className="min-w-[650px] space-y-1.5 py-2">
                {/* Hour Header */}
                <div className="flex items-center gap-1 pl-12 text-[10px] font-mono text-gray-500 mb-2">
                  {Array.from({ length: 24 }).map((_, h) => (
                    <div key={`h-hdr-${h}`} className="flex-1 text-center">
                      {h % 2 === 0 ? h : ''}
                    </div>
                  ))}
                </div>

                {/* 7 Days Rows */}
                {DAY_LABELS.map((dayName, dayIdx) => (
                  <div key={dayName} className="flex items-center gap-1">
                    <span className="w-10 text-xs font-mono text-gray-400 text-right pr-2">
                      {dayName}
                    </span>
                    <div className="flex-1 flex items-center gap-1">
                      {Array.from({ length: 24 }).map((_, hour) => {
                        const cell = cells.find(
                          (c) => c.dayOfWeek === dayIdx && c.hour === hour
                        );
                        if (!cell) return null;

                        const isHovered =
                          hoveredCell?.dayOfWeek === dayIdx && hoveredCell?.hour === hour;

                        return (
                          <div
                            key={`matrix-${dayIdx}-${hour}`}
                            onMouseEnter={() => setHoveredCell(cell)}
                            onMouseLeave={() => setHoveredCell(null)}
                            className="flex-1 h-6 rounded cursor-pointer transition-all duration-100"
                            style={{
                              backgroundColor: getHeatColor(cell.intensity),
                              outline: isHovered ? '2px solid #fff' : 'none',
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info & Hover Inspector */}
        <div className="lg:col-span-4 space-y-4">
          {/* Inspection Card */}
          <div className="bg-[#121212] rounded-2xl p-5 border border-[#2e2e2e]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#1DB954]" />
              <span>Interval Inspector</span>
            </h3>

            {hoveredCell ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-white">
                    {hoveredCell.dayName} at {String(hoveredCell.hour).padStart(2, '0')}:00
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#1DB954]/20 text-[#1DB954] font-semibold">
                    {Math.round(hoveredCell.intensity * 100)}% Heat
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#1a1a1a] p-2.5 rounded-xl">
                    <div className="text-gray-400">Minutes</div>
                    <div className="text-base font-bold text-white font-mono mt-0.5">
                      {hoveredCell.minutes.toLocaleString()} m
                    </div>
                  </div>
                  <div className="bg-[#1a1a1a] p-2.5 rounded-xl">
                    <div className="text-gray-400">Streams</div>
                    <div className="text-base font-bold text-white font-mono mt-0.5">
                      {hoveredCell.plays.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-400">
                  Skip Rate during this slot:{' '}
                  <strong className="text-yellow-400">
                    {Math.round(hoveredCell.skipRate * 100)}%
                  </strong>
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-400 leading-relaxed py-2">
                Hover over any segment on the radial clock or matrix grid to inspect precise listening duration and skip rates for that specific day &amp; hour.
              </div>
            )}
          </div>

          {/* Temporal Habit Diagnostics */}
          <div className="bg-[#121212] rounded-2xl p-5 border border-[#2e2e2e] space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#252525]">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-purple-400" />
                <span>Night Owl Streams (10PM-4AM)</span>
              </span>
              <span className="font-bold text-purple-300 font-mono">{nightPercent}%</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-[#252525]">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Morning Energy (6AM-10AM)</span>
              </span>
              <span className="font-bold text-amber-300 font-mono">{morningPercent}%</span>
            </div>

            {peakCell && (
              <div className="pt-1">
                <div className="text-gray-400">Peak Sonic Rhythm:</div>
                <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                  {peakCell.dayName} at {String(peakCell.hour).padStart(2, '0')}:00
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  {peakCell.minutes.toLocaleString()} minutes streamed in this slot
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function cy_fix(c: number) {
  return c;
}
