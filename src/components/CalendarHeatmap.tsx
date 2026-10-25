import React, { useState, useMemo } from 'react';
import { StreamRecord, DailyActivity } from '../types/spotify';
import { computeDailyActivities } from '../utils/aggregations';
import { Calendar, Flame, Trophy, Activity } from 'lucide-react';

interface CalendarHeatmapProps {
  records: StreamRecord[];
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

export const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({ records }) => {
  // Available years in dataset
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(records.map((r) => r.year))).sort((a, b) => b - a);
    return years.length > 0 ? years : [new Date().getFullYear()];
  }, [records]);

  const [selectedYear, setSelectedYear] = useState<number>(availableYears[0]);
  const [hoveredDay, setHoveredDay] = useState<DailyActivity | null>(null);

  const { days, currentStreak, longestStreak, totalDaysListened } = useMemo(() => {
    return computeDailyActivities(records, selectedYear);
  }, [records, selectedYear]);

  // Total minutes for this year
  const totalYearMinutes = useMemo(() => {
    return days.reduce((acc, d) => acc + d.minutes, 0);
  }, [days]);

  const dailyAverage = totalDaysListened > 0 ? Math.round(totalYearMinutes / totalDaysListened) : 0;

  // Organize days into weeks (53 columns x 7 days)
  const { weeks, monthLabels } = useMemo(() => {
    const w: (DailyActivity | null)[][] = [];
    let currentWeek: (DailyActivity | null)[] = new Array(7).fill(null);

    // Month label positions (week index)
    const mLabels: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    days.forEach((day, idx) => {
      const dOfWeek = day.dayOfWeek; // 0 (Sun) - 6 (Sat)
      currentWeek[dOfWeek] = day;

      if (day.month !== lastMonth) {
        mLabels.push({
          month: MONTH_NAMES[day.month],
          weekIndex: w.length,
        });
        lastMonth = day.month;
      }

      if (dOfWeek === 6 || idx === days.length - 1) {
        w.push(currentWeek);
        currentWeek = new Array(7).fill(null);
      }
    });

    return { weeks: w, monthLabels: mLabels };
  }, [days]);

  const getLevelColor = (level: DailyActivity['level']) => {
    switch (level) {
      case 4:
        return '#1DB954'; // Peak green
      case 3:
        return '#1aa345';
      case 2:
        return '#14632b';
      case 1:
        return '#0e3d1c';
      default:
        return '#161616'; // Inactive day
    }
  };

  return (
    <div className="bg-[#181818] border border-[#282828] rounded-2xl p-6 shadow-xl mb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-[#1DB954]">
              <Calendar className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Listening Calendar Heatmap (52-Week Activity)
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            GitHub-style daily listening velocity grid and consistency streak tracker
          </p>
        </div>

        {/* Year Selector */}
        {availableYears.length > 1 && (
          <div className="flex items-center gap-1.5 bg-[#121212] p-1 rounded-xl border border-[#2e2e2e]">
            {availableYears.map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono transition-all ${
                  selectedYear === yr
                    ? 'bg-[#1DB954] text-black shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Streak & Velocity Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-[#121212] p-3 rounded-xl border border-[#262626]">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
            <span>Longest Streak</span>
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          </div>
          <div className="text-xl font-extrabold text-white font-mono">
            {longestStreak}{' '}
            <span className="text-xs font-normal text-gray-400">days</span>
          </div>
        </div>

        <div className="bg-[#121212] p-3 rounded-xl border border-[#262626]">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
            <span>Active Days</span>
            <Activity className="w-3.5 h-3.5 text-[#1DB954]" />
          </div>
          <div className="text-xl font-extrabold text-white font-mono">
            {totalDaysListened}{' '}
            <span className="text-xs font-normal text-gray-400">/ 365</span>
          </div>
        </div>

        <div className="bg-[#121212] p-3 rounded-xl border border-[#262626]">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
            <span>Daily Average</span>
            <Flame className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="text-xl font-extrabold text-white font-mono">
            {dailyAverage}{' '}
            <span className="text-xs font-normal text-gray-400">min/day</span>
          </div>
        </div>

        <div className="bg-[#121212] p-3 rounded-xl border border-[#262626]">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
            <span>Year Minutes</span>
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-extrabold text-white font-mono">
            {totalYearMinutes.toLocaleString()}{' '}
            <span className="text-xs font-normal text-gray-400">min</span>
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="relative overflow-x-auto pb-2">
        <div className="min-w-[780px]">
          {/* Month labels header */}
          <div className="flex pl-8 mb-1.5 text-[10px] font-mono text-gray-400">
            {weeks.map((_, wIdx) => {
              const match = monthLabels.find((m) => m.weekIndex === wIdx);
              return (
                <div key={`month-${wIdx}`} className="w-3.5 mr-1 text-left shrink-0">
                  {match ? match.month : ''}
                </div>
              );
            })}
          </div>

          {/* 7 Days of Week Rows */}
          <div className="flex">
            {/* Day labels column */}
            <div className="w-8 shrink-0 flex flex-col justify-between py-0.5 text-[10px] font-mono text-gray-500">
              {DAY_LABELS.map((lbl, idx) => (
                <div key={`lbl-${idx}`} className="h-3.5 leading-none">
                  {lbl}
                </div>
              ))}
            </div>

            {/* Weeks Columns */}
            <div className="flex gap-1">
              {weeks.map((week, wIdx) => (
                <div key={`week-${wIdx}`} className="flex flex-col gap-1">
                  {week.map((day, dIdx) => {
                    if (!day) {
                      return <div key={`empty-${wIdx}-${dIdx}`} className="w-3.5 h-3.5" />;
                    }

                    const isHovered = hoveredDay?.date === day.date;

                    return (
                      <div
                        key={`day-${day.date}`}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        className="w-3.5 h-3.5 rounded-sm cursor-pointer transition-all duration-100"
                        style={{
                          backgroundColor: getLevelColor(day.level),
                          outline: isHovered ? '2px solid #fff' : 'none',
                          transform: isHovered ? 'scale(1.25)' : 'none',
                          zIndex: isHovered ? 20 : 1,
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend & Hover Inspector */}
      <div className="mt-4 pt-4 border-t border-[#242424] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-gray-400">
        {/* Hover Inspector Display */}
        <div className="min-h-[22px]">
          {hoveredDay ? (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white font-mono">{hoveredDay.date}:</span>
              <span className="text-[#1DB954] font-mono font-bold">
                {hoveredDay.minutes} min ({hoveredDay.plays} streams)
              </span>
              {hoveredDay.topTrack && (
                <span className="text-gray-300 truncate max-w-xs">
                  • Top song: <em>"{hoveredDay.topTrack}"</em> by {hoveredDay.topArtist}
                </span>
              )}
            </div>
          ) : (
            <span className="text-gray-500">Hover over any square for daily track and minute specifics.</span>
          )}
        </div>

        {/* Heat intensity legend */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] text-gray-500 mr-1">Less</span>
          <div className="w-3 h-3 rounded-sm bg-[#161616] border border-[#2a2a2a]" />
          <div className="w-3 h-3 rounded-sm bg-[#0e3d1c]" />
          <div className="w-3 h-3 rounded-sm bg-[#14632b]" />
          <div className="w-3 h-3 rounded-sm bg-[#1aa345]" />
          <div className="w-3 h-3 rounded-sm bg-[#1DB954]" />
          <span className="text-[11px] text-gray-500 ml-1">More (120m+)</span>
        </div>
      </div>
    </div>
  );
};
