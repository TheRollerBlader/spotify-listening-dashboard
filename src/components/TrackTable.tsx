import React, { useState, useMemo } from 'react';
import { StreamRecord, ArtistSummary, TrackSummary } from '../types/spotify';
import { aggregateArtists, aggregateTracks } from '../utils/aggregations';
import { Users, Music, ChevronDown, ChevronUp, Search, ExternalLink } from 'lucide-react';

interface TrackTableProps {
  records: StreamRecord[];
  metric: 'minutes' | 'plays';
  onSelectArtist: (artist: string) => void;
  onSelectGenre: (genre: string) => void;
}

export const TrackTable: React.FC<TrackTableProps> = ({
  records,
  metric,
  onSelectArtist,
  onSelectGenre,
}) => {
  const [activeTab, setActiveTab] = useState<'artists' | 'tracks'>('artists');
  const [tableSearch, setTableSearch] = useState('');
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const artists = useMemo(() => aggregateArtists(records, metric), [records, metric]);
  const tracks = useMemo(() => aggregateTracks(records, metric), [records, metric]);

  // Filtered artists
  const filteredArtists = useMemo(() => {
    if (!tableSearch) return artists;
    const q = tableSearch.toLowerCase();
    return artists.filter(
      (a) => a.artist.toLowerCase().includes(q) || a.genre.toLowerCase().includes(q)
    );
  }, [artists, tableSearch]);

  // Filtered tracks
  const filteredTracks = useMemo(() => {
    if (!tableSearch) return tracks;
    const q = tableSearch.toLowerCase();
    return tracks.filter(
      (t) =>
        t.track.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q)
    );
  }, [tracks, tableSearch]);

  const totalPages =
    activeTab === 'artists'
      ? Math.ceil(filteredArtists.length / pageSize)
      : Math.ceil(filteredTracks.length / pageSize);

  const paginatedArtists = filteredArtists.slice((page - 1) * pageSize, page * pageSize);
  const paginatedTracks = filteredTracks.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="bg-[#181818] border border-[#282828] rounded-2xl p-6 shadow-xl mb-10">
      {/* Table Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2">
          <div className="flex bg-[#121212] p-1 rounded-xl border border-[#2e2e2e]">
            <button
              onClick={() => {
                setActiveTab('artists');
                setPage(1);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'artists'
                  ? 'bg-[#1DB954] text-black shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Top Artists ({filteredArtists.length})</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('tracks');
                setPage(1);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'tracks'
                  ? 'bg-[#1DB954] text-black shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Top Tracks ({filteredTracks.length})</span>
            </button>
          </div>
        </div>

        {/* Search within table */}
        <div className="relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <input
            type="text"
            value={tableSearch}
            onChange={(e) => {
              setTableSearch(e.target.value);
              setPage(1);
            }}
            placeholder={`Filter ${activeTab}...`}
            className="w-full bg-[#121212] border border-[#2e2e2e] rounded-xl pl-9 pr-3 py-1.5 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#1DB954]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="text-[11px] uppercase tracking-wider text-gray-500 border-b border-[#262626]">
            <tr>
              <th className="py-2.5 px-3 w-12 font-mono">#</th>
              {activeTab === 'artists' ? (
                <>
                  <th className="py-2.5 px-3">Artist</th>
                  <th className="py-2.5 px-3">Primary Genre</th>
                  <th className="py-2.5 px-3">Top Song</th>
                  <th className="py-2.5 px-3 font-mono text-right">Minutes</th>
                  <th className="py-2.5 px-3 font-mono text-right">Streams</th>
                  <th className="py-2.5 px-3 font-mono text-right">Skip Rate</th>
                </>
              ) : (
                <>
                  <th className="py-2.5 px-3">Song Title</th>
                  <th className="py-2.5 px-3">Artist</th>
                  <th className="py-2.5 px-3">Album</th>
                  <th className="py-2.5 px-3 font-mono text-right">Minutes</th>
                  <th className="py-2.5 px-3 font-mono text-right">Streams</th>
                  <th className="py-2.5 px-3 font-mono text-right">Skip Rate</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222]">
            {activeTab === 'artists'
              ? paginatedArtists.map((a, idx) => {
                  const globalRank = (page - 1) * pageSize + idx + 1;
                  return (
                    <tr key={a.artist} className="hover:bg-[#202020] transition-colors">
                      <td className="py-3 px-3 font-mono text-gray-500">#{globalRank}</td>
                      <td className="py-3 px-3 font-bold text-white">
                        <button
                          onClick={() => onSelectArtist(a.artist)}
                          className="hover:text-[#1DB954] hover:underline text-left"
                        >
                          {a.artist}
                        </button>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => onSelectGenre(a.genre)}
                          className="px-2 py-0.5 rounded-full bg-[#121212] text-gray-300 border border-[#2a2a2a] hover:border-[#1DB954] text-[11px]"
                        >
                          {a.genre.split('/')[0].trim()}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-gray-400 italic">"{a.topTrack}"</td>
                      <td className="py-3 px-3 font-mono text-right text-emerald-400 font-semibold">
                        {a.totalMinutes.toLocaleString()} m
                      </td>
                      <td className="py-3 px-3 font-mono text-right text-white">
                        {a.playCount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-mono text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            a.skipRate > 0.25
                              ? 'bg-red-950/60 text-red-400'
                              : 'bg-emerald-950/60 text-[#1DB954]'
                          }`}
                        >
                          {Math.round(a.skipRate * 100)}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              : paginatedTracks.map((t, idx) => {
                  const globalRank = (page - 1) * pageSize + idx + 1;
                  return (
                    <tr key={`${t.track}-${t.artist}`} className="hover:bg-[#202020] transition-colors">
                      <td className="py-3 px-3 font-mono text-gray-500">#{globalRank}</td>
                      <td className="py-3 px-3 font-bold text-white">{t.track}</td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => onSelectArtist(t.artist)}
                          className="text-gray-300 hover:text-[#1DB954] hover:underline"
                        >
                          {t.artist}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-gray-400 truncate max-w-[180px]" title={t.album}>
                        {t.album}
                      </td>
                      <td className="py-3 px-3 font-mono text-right text-emerald-400 font-semibold">
                        {t.totalMinutes.toLocaleString()} m
                      </td>
                      <td className="py-3 px-3 font-mono text-right text-white">
                        {t.playCount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-mono text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t.skipRate > 0.25
                              ? 'bg-red-950/60 text-red-400'
                              : 'bg-emerald-950/60 text-[#1DB954]'
                          }`}
                        >
                          {Math.round(t.skipRate * 100)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {/* Pagination & Rows selector */}
      <div className="mt-4 pt-3 border-t border-[#242424] flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="bg-[#121212] border border-[#2e2e2e] text-gray-300 rounded-lg px-2 py-1"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span>
            Page {page} of {Math.max(1, totalPages)}
          </span>
          <div className="flex gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded-lg bg-[#121212] hover:bg-[#242424] disabled:opacity-30 disabled:hover:bg-[#121212] text-white"
            >
              Prev
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded-lg bg-[#121212] hover:bg-[#242424] disabled:opacity-30 disabled:hover:bg-[#121212] text-white"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
