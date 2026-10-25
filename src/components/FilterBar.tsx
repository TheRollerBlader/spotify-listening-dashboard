import React from 'react';
import { Search, Calendar, SlidersHorizontal, Clock, Disc3, X, Filter } from 'lucide-react';
import { FilterState, GenreDistribution } from '../types/spotify';

interface FilterBarProps {
  filters: FilterState;
  genres: GenreDistribution[];
  onFilterChange: (updates: Partial<FilterState>) => void;
  availableYears: number[];
  minDate: string;
  maxDate: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  genres,
  onFilterChange,
  availableYears,
  minDate,
  maxDate,
}) => {
  const handlePreset = (preset: FilterState['preset']) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    if (preset === 'all') {
      onFilterChange({ preset: 'all', dateRange: [minDate, maxDate] });
    } else if (preset === '2024') {
      onFilterChange({ preset: '2024', dateRange: ['2024-01-01', '2024-12-31'] });
    } else if (preset === '2023') {
      onFilterChange({ preset: '2023', dateRange: ['2023-01-01', '2023-12-31'] });
    } else if (preset === '2022') {
      onFilterChange({ preset: '2022', dateRange: ['2022-01-01', '2022-12-31'] });
    } else if (preset === 'last12m') {
      const d = new Date();
      d.setFullYear(d.getFullYear() - 1);
      onFilterChange({ preset: 'last12m', dateRange: [d.toISOString().split('T')[0], todayStr] });
    } else if (preset === 'last6m') {
      const d = new Date();
      d.setMonth(d.getMonth() - 6);
      onFilterChange({ preset: 'last6m', dateRange: [d.toISOString().split('T')[0], todayStr] });
    }
  };

  const hasActiveFilters =
    filters.preset !== 'all' ||
    Boolean(filters.searchQuery) ||
    Boolean(filters.selectedGenre) ||
    Boolean(filters.selectedArtist) ||
    filters.minStreamMs > 0;

  const clearAllFilters = () => {
    onFilterChange({
      preset: 'all',
      dateRange: [minDate, maxDate],
      searchQuery: '',
      selectedGenre: null,
      selectedArtist: null,
      minStreamMs: 0,
    });
  };

  return (
    <div className="bg-[#181818] border border-[#282828] rounded-2xl p-4 shadow-xl mb-8 space-y-4">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search bar */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Search artist, song, or album..."
            className="w-full bg-[#121212] border border-[#2e2e2e] rounded-xl pl-10 pr-9 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#1DB954] transition-colors"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Metric Toggle (Minutes vs Plays) */}
        <div className="flex items-center self-start sm:self-auto bg-[#121212] p-1 rounded-xl border border-[#2e2e2e]">
          <button
            onClick={() => onFilterChange({ metric: 'minutes' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filters.metric === 'minutes'
                ? 'bg-[#1DB954] text-black shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Minutes Listened</span>
          </button>
          <button
            onClick={() => onFilterChange({ metric: 'plays' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filters.metric === 'plays'
                ? 'bg-[#1DB954] text-black shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Disc3 className="w-3.5 h-3.5" />
            <span>Play Count</span>
          </button>
        </div>

        {/* Genre Selector */}
        <div className="flex items-center gap-2">
          <select
            value={filters.selectedGenre || ''}
            onChange={(e) => onFilterChange({ selectedGenre: e.target.value || null })}
            className="bg-[#121212] border border-[#2e2e2e] text-xs font-medium text-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#1DB954]"
          >
            <option value="">All Musical Genres ({genres.length})</option>
            {genres.map((g) => (
              <option key={g.genre} value={g.genre}>
                {g.genre} ({g.percentage}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date Presets and Filters Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#242424] text-xs">
        {/* Preset chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-gray-400 mr-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Timeframe:
          </span>
          {(['all', '2024', '2023', 'last12m', 'last6m'] as const).map((p) => (
            <button
              key={p}
              onClick={() => handlePreset(p)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filters.preset === p
                  ? 'bg-[#282828] text-[#1DB954] border border-[#1DB954]/50 shadow-sm'
                  : 'bg-[#121212] text-gray-400 hover:text-gray-200 border border-transparent'
              }`}
            >
              {p === 'all'
                ? 'All Time'
                : p === 'last12m'
                ? 'Last 12 Mos'
                : p === 'last6m'
                ? 'Last 6 Mos'
                : p}
            </button>
          ))}
        </div>

        {/* Active Filter Indicators & Reset */}
        <div className="flex items-center gap-3">
          {filters.selectedArtist && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[#1DB954] font-medium">
              Artist: {filters.selectedArtist}
              <button
                onClick={() => onFilterChange({ selectedArtist: null })}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.selectedGenre && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-medium">
              {filters.selectedGenre}
              <button
                onClick={() => onFilterChange({ selectedGenre: null })}
                className="hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-gray-400 hover:text-white underline underline-offset-2 flex items-center gap-1"
            >
              <RotateCcwIcon className="w-3 h-3" />
              <span>Clear filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

function RotateCcwIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
