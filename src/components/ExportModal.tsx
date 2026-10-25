import React from 'react';
import { X, Download, FileJson, FileSpreadsheet, Printer, Check } from 'lucide-react';
import { StreamRecord, WrappedOverview, ArtistSummary, TrackSummary } from '../types/spotify';
import { aggregateArtists, aggregateTracks } from '../utils/aggregations';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  overview: WrappedOverview;
  records: StreamRecord[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  overview,
  records,
}) => {
  if (!isOpen) return null;

  const handleDownloadJSON = () => {
    const payload = {
      exportDate: new Date().toISOString(),
      analyticsSummary: overview,
      totalStreamsParsed: records.length,
      topArtists: aggregateArtists(records, 'minutes').slice(0, 50),
      topTracks: aggregateTracks(records, 'minutes').slice(0, 50),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spotify-listening-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    const artists = aggregateArtists(records, 'minutes');
    const header = 'Rank,Artist,Genre,TotalMinutes,PlayCount,SkipRate,TopTrack\n';
    const rows = artists
      .map(
        (a, i) =>
          `${i + 1},"${a.artist.replace(/"/g, '""')}","${a.genre}",${a.totalMinutes},${a.playCount},${(
            a.skipRate * 100
          ).toFixed(1)}%,"${a.topTrack.replace(/"/g, '""')}"`
      )
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spotify-top-artists-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#181818] border border-[#2e2e2e] rounded-2xl shadow-2xl p-6 text-gray-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-[#282828] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#1DB954]/20 border border-[#1DB954]/40 flex items-center justify-center text-[#1DB954]">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Export Analytics Data</h2>
            <p className="text-xs text-gray-400">Download formatted summaries or print report</p>
          </div>
        </div>

        <div className="space-y-3 mt-5">
          <button
            onClick={handleDownloadJSON}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-[#121212] border border-[#2a2a2a] hover:border-[#1DB954] hover:bg-[#1a1a1a] transition-all group"
          >
            <div className="flex items-center gap-3">
              <FileJson className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="text-sm font-bold text-white">Full Analytics JSON</div>
                <div className="text-xs text-gray-400">
                  Comprehensive data payload with persona traits, audio features, and top 50 charts
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-gray-400 group-hover:text-white shrink-0 ml-2" />
          </button>

          <button
            onClick={handleDownloadCSV}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-[#121212] border border-[#2a2a2a] hover:border-[#1DB954] hover:bg-[#1a1a1a] transition-all group"
          >
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="text-sm font-bold text-white">Top Artists CSV</div>
                <div className="text-xs text-gray-400">
                  Formatted spreadsheet table for Excel, Google Sheets, or Python pandas
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-gray-400 group-hover:text-white shrink-0 ml-2" />
          </button>

          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-[#121212] border border-[#2a2a2a] hover:border-[#1DB954] hover:bg-[#1a1a1a] transition-all group"
          >
            <div className="flex items-center gap-3">
              <Printer className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="text-sm font-bold text-white">Print / Save as PDF</div>
                <div className="text-xs text-gray-400">
                  Generate printer-friendly dashboard report or export to PDF
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-gray-400 group-hover:text-white shrink-0 ml-2" />
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-[#262626] text-center text-xs text-gray-500">
          Generated client-side • SpotifyPulse Extended History Engine
        </div>
      </div>
    </div>
  );
};
