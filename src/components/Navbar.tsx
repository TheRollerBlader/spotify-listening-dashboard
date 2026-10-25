import React from 'react';
import { Music, Upload, RotateCcw, Download, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  streamCount: number;
  isSampleData: boolean;
  onResetToSample: () => void;
  onOpenUpload: () => void;
  onExport: () => void;
  onTriggerConfetti: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  streamCount,
  isSampleData,
  onResetToSample,
  onOpenUpload,
  onExport,
  onTriggerConfetti,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#121212]/90 backdrop-blur-md border-b border-[#282828]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1DB954] flex items-center justify-center shadow-lg shadow-[#1DB954]/20">
            <Music className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">
                Spotify<span className="text-[#1DB954]">Pulse</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-[#282828] text-gray-300 border border-gray-700">
                Extended Analytics
              </span>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block">Personal Extended Streaming History Visualizer</p>
          </div>
        </div>

        {/* Data Status Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1a1a] border border-[#2e2e2e] text-xs">
          <div className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse" />
          <span className="text-gray-300">
            {isSampleData ? 'Demo Dataset' : 'Custom Upload'}:{' '}
            <strong className="text-white font-mono">{streamCount.toLocaleString()}</strong> streams
          </span>
          <span className="text-gray-500">|</span>
          <span className="flex items-center gap-1 text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1DB954]" /> Client-Side Only
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isSampleData ? (
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#282828] hover:bg-[#333] text-gray-200 text-xs font-medium transition-colors border border-[#3e3e3e]"
              title="Upload your own Spotify JSON files"
            >
              <Upload className="w-3.5 h-3.5 text-[#1DB954]" />
              <span>Upload Files</span>
            </button>
          ) : (
            <button
              onClick={onResetToSample}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#282828] hover:bg-[#333] text-gray-300 text-xs font-medium transition-colors border border-[#3e3e3e]"
              title="Reset back to rich sample dataset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Sample</span>
            </button>
          )}

          <button
            onClick={onTriggerConfetti}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-[#1DB954]/20 hover:from-emerald-500/30 hover:to-[#1DB954]/30 text-[#1DB954] text-xs font-medium transition-all border border-[#1DB954]/40"
            title="Celebrate your listening journey!"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span className="hidden sm:inline">Wrapped</span>
          </button>

          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold text-xs transition-colors shadow-md shadow-[#1DB954]/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <a
            href="https://github.com/TheRollerBlader/spotify-listening-dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-[#282828] transition-colors"
            title="View Source on GitHub"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
