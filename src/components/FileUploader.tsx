import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, Shield, Play } from 'lucide-react';
import { parseSpotifyFiles } from '../utils/parser';
import { StreamRecord } from '../types/spotify';

interface FileUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded: (records: StreamRecord[]) => void;
  onLoadSample: () => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  isOpen,
  onClose,
  onDataLoaded,
  onLoadSample,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadedFiles, setLoadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFiles = async (files: FileList | File[]) => {
    const jsonFiles = Array.from(files).filter(f => f.name.endsWith('.json'));
    if (jsonFiles.length === 0) {
      setErrorMessage('Please select Spotify .json export files (e.g., endsong_0.json or StreamingHistory0.json).');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    setLoadedFiles(jsonFiles);

    try {
      const parsed = await parseSpotifyFiles(jsonFiles);
      if (parsed.length === 0) {
        setErrorMessage('No valid Spotify stream records were found in the uploaded JSON files.');
        setIsLoading(false);
        return;
      }

      onDataLoaded(parsed);
      setIsLoading(false);
      onClose();
    } catch (err: any) {
      setErrorMessage(`Error parsing files: ${err.message || 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#181818] border border-[#2e2e2e] rounded-2xl shadow-2xl overflow-hidden p-6 text-gray-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-[#282828] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#1DB954]/20 border border-[#1DB954]/40 flex items-center justify-center text-[#1DB954]">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Import Spotify History</h2>
            <p className="text-xs text-gray-400">Upload your Spotify Extended or Classic streaming history JSON files</p>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="mb-5 flex items-center gap-2.5 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300">
          <Shield className="w-4 h-4 shrink-0 text-[#1DB954]" />
          <span>
            <strong>100% Client-Side Privacy:</strong> Your JSON files are read directly in your browser memory. Nothing is ever uploaded to a server or external database.
          </span>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#1DB954] bg-[#1DB954]/10 scale-[0.99]'
              : 'border-[#333] hover:border-[#1DB954]/60 bg-[#121212]/50 hover:bg-[#1f1f1f]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".json"
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />

          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#242424] flex items-center justify-center text-[#1DB954]">
            <FileText className="w-7 h-7" />
          </div>

          <p className="text-sm font-semibold text-white mb-1">
            Drop your <code className="text-[#1DB954] font-mono">endsong_*.json</code> files here
          </p>
          <p className="text-xs text-gray-400 mb-4">
            or click to browse from your computer (supports multiple files at once)
          </p>

          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#282828] text-gray-300 border border-gray-700">
            Accepts: endsong_0.json ... endsong_N.json &amp; StreamingHistory*.json
          </span>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="mt-4 flex items-center justify-center gap-3 p-3 rounded-lg bg-[#242424] text-xs text-gray-300">
            <div className="w-4 h-4 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin" />
            <span>Parsing streaming records and indexing audio signatures...</span>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Footer info & Sample loader */}
        <div className="mt-6 pt-4 border-t border-[#282828] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div>
            Don't have your Spotify export yet?
          </div>
          <button
            onClick={() => {
              onLoadSample();
              onClose();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#282828] hover:bg-[#333] text-[#1DB954] font-medium border border-[#3e3e3e] transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Explore With Bundled Sample Dataset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
