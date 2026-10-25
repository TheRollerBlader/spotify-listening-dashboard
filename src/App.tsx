import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SAMPLE_EXTENDED_HISTORY } from './data/sampleData';
import { normalizeRecord } from './utils/parser';
import { filterRecords, computeWrappedOverview, aggregateGenres } from './utils/aggregations';
import { StreamRecord, FilterState } from './types/spotify';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { WrappedSummary } from './components/WrappedSummary';
import { BumpChart } from './components/BumpChart';
import { GenreStreamgraph } from './components/GenreStreamgraph';
import { ListeningClock } from './components/ListeningClock';
import { AudioRadarChart } from './components/AudioRadarChart';
import { SkipRateAnalysis } from './components/SkipRateAnalysis';
import { CalendarHeatmap } from './components/CalendarHeatmap';
import { TrackTable } from './components/TrackTable';
import { FileUploader } from './components/FileUploader';
import { ExportModal } from './components/ExportModal';
import { ShieldCheck, Sparkles, Layers, TrendingUp, Clock, Activity, FastForward, Calendar, Music } from 'lucide-react';

export function App() {
  // Parse initial sample data
  const initialRecords = useMemo(() => {
    return SAMPLE_EXTENDED_HISTORY.map((r, i) => normalizeRecord(r, i)).filter(
      (r): r is StreamRecord => r !== null
    );
  }, []);

  const [records, setRecords] = useState<StreamRecord[]>(initialRecords);
  const [isSampleData, setIsSampleData] = useState<boolean>(true);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Overall dates
  const minDate = useMemo(() => {
    if (records.length === 0) return '2023-01-01';
    return records[0].isoDate;
  }, [records]);

  const maxDate = useMemo(() => {
    if (records.length === 0) return '2024-12-31';
    return records[records.length - 1].isoDate;
  }, [records]);

  const availableYears = useMemo(() => {
    return Array.from(new Set(records.map((r) => r.year))).sort((a, b) => b - a);
  }, [records]);

  // Global filters
  const [filters, setFilters] = useState<FilterState>({
    dateRange: [minDate, maxDate],
    preset: 'all',
    metric: 'minutes',
    searchQuery: '',
    selectedGenre: null,
    selectedArtist: null,
    minStreamMs: 0,
  });

  // Keep dateRange updated if records change
  useEffect(() => {
    if (filters.preset === 'all') {
      setFilters((prev) => ({ ...prev, dateRange: [minDate, maxDate] }));
    }
  }, [minDate, maxDate, filters.preset]);

  const handleFilterChange = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return filterRecords(records, filters);
  }, [records, filters]);

  // Aggregated data
  const overview = useMemo(() => {
    return computeWrappedOverview(filteredRecords);
  }, [filteredRecords]);

  const genres = useMemo(() => {
    return aggregateGenres(filteredRecords);
  }, [filteredRecords]);

  // Confetti trigger
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1DB954', '#1ed760', '#00f2fe', '#fdcb6e', '#ff7675'],
    });
  };

  const handleCustomDataLoaded = (newRecords: StreamRecord[]) => {
    setRecords(newRecords);
    setIsSampleData(false);
    triggerConfetti();
  };

  const handleResetToSample = () => {
    setRecords(initialRecords);
    setIsSampleData(true);
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-gray-100 flex flex-col font-sans">
      {/* Navigation */}
      <Navbar
        streamCount={filteredRecords.length}
        isSampleData={isSampleData}
        onResetToSample={handleResetToSample}
        onOpenUpload={() => setIsUploadOpen(true)}
        onExport={() => setIsExportOpen(true)}
        onTriggerConfetti={triggerConfetti}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Controls */}
        <FilterBar
          filters={filters}
          genres={genres}
          onFilterChange={handleFilterChange}
          availableYears={availableYears}
          minDate={minDate}
          maxDate={maxDate}
        />

        {/* 1. Wrapped Summary Cards & Persona */}
        <section id="wrapped-section">
          <WrappedSummary
            overview={overview}
            onTriggerConfetti={triggerConfetti}
            metric={filters.metric}
          />
        </section>

        {/* 2. Bump Chart: Ranking Transitions */}
        <section id="bump-chart-section">
          <BumpChart records={filteredRecords} metric={filters.metric} />
        </section>

        {/* 3. Genre Streamgraph */}
        <section id="genre-streamgraph-section">
          <GenreStreamgraph records={filteredRecords} metric={filters.metric} />
        </section>

        {/* 4. Listening Clock (Radial Heatmap) */}
        <section id="listening-clock-section">
          <ListeningClock records={filteredRecords} metric={filters.metric} />
        </section>

        {/* 5. Acoustic Radar & Mood DNA */}
        <section id="audio-radar-section">
          <AudioRadarChart records={filteredRecords} />
        </section>

        {/* 6. Skip-Rate Diagnostics */}
        <section id="skip-rate-section">
          <SkipRateAnalysis records={filteredRecords} />
        </section>

        {/* 7. Daily Activity Heatmap (GitHub Grid) */}
        <section id="calendar-heatmap-section">
          <CalendarHeatmap records={filteredRecords} />
        </section>

        {/* 8. Song Explorer Table */}
        <section id="track-table-section">
          <TrackTable
            records={filteredRecords}
            metric={filters.metric}
            onSelectArtist={(artist) => handleFilterChange({ selectedArtist: artist })}
            onSelectGenre={(genre) => handleFilterChange({ selectedGenre: genre })}
          />
        </section>
      </main>

      {/* Modals */}
      <FileUploader
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDataLoaded={handleCustomDataLoaded}
        onLoadSample={handleResetToSample}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        overview={overview}
        records={filteredRecords}
      />

      {/* Footer */}
      <footer className="border-t border-[#222] bg-[#09090b] py-8 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1DB954]" />
            <span className="text-gray-400 font-medium">SpotifyPulse</span> — Personal Extended Streaming History Visualizer
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1DB954]" /> 100% Client-Side Privacy
            </span>
            <span>•</span>
            <span>React + TypeScript + D3 + Recharts</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
