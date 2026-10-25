import React from 'react';
import {
  Clock,
  Music,
  Users,
  Sparkles,
  Trophy,
  Flame,
  Radio,
  Share2,
  Calendar,
  Zap,
  Disc,
} from 'lucide-react';
import { WrappedOverview } from '../types/spotify';

interface WrappedSummaryProps {
  overview: WrappedOverview;
  onTriggerConfetti: () => void;
  metric: 'minutes' | 'plays';
}

export const WrappedSummary: React.FC<WrappedSummaryProps> = ({
  overview,
  onTriggerConfetti,
  metric,
}) => {
  const { persona } = overview;

  return (
    <div className="mb-10 space-y-6">
      {/* Hero Wrapped Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#202020] border border-[#2a2a2a] p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#1DB954]/20 via-[#00f2fe]/10 to-transparent blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1DB954]/10 border border-[#1DB954]/30 text-[#1DB954] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Sound Capsule</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Your Extended <span className="text-[#1DB954]">Listening Wrapped</span>
            </h1>
            <p className="mt-1 text-sm text-gray-400 max-w-xl">
              An unvarnished analytical breakdown of your streaming history, acoustic traits, and listening architecture.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onTriggerConfetti}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-sm shadow-lg shadow-[#1DB954]/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>Celebrate Wrapped</span>
            </button>
          </div>
        </div>

        {/* Big Numbers Grid */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Listening Time */}
          <div className="bg-[#181818]/80 backdrop-blur border border-[#2c2c2c] rounded-2xl p-4 sm:p-5 hover:border-[#1DB954]/40 transition-colors">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Listening Time</span>
              <Clock className="w-4 h-4 text-[#1DB954]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {overview.totalMinutes.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
              <span className="text-emerald-400 font-semibold">{overview.totalHours} hrs</span>
              <span>•</span>
              <span>{overview.totalDays} full days</span>
            </div>
          </div>

          {/* Card 2: Total Streams */}
          <div className="bg-[#181818]/80 backdrop-blur border border-[#2c2c2c] rounded-2xl p-4 sm:p-5 hover:border-[#1DB954]/40 transition-colors">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Streams</span>
              <Disc className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {overview.totalStreams.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Skip rate: <strong className="text-yellow-400">{Math.round(overview.overallSkipRate * 100)}%</strong>
            </div>
          </div>

          {/* Card 3: Unique Artists */}
          <div className="bg-[#181818]/80 backdrop-blur border border-[#2c2c2c] rounded-2xl p-4 sm:p-5 hover:border-[#1DB954]/40 transition-colors">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Unique Artists</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {overview.uniqueArtists.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Across <strong className="text-purple-300">{overview.uniqueAlbums}</strong> albums
            </div>
          </div>

          {/* Card 4: Unique Tracks */}
          <div className="bg-[#181818]/80 backdrop-blur border border-[#2c2c2c] rounded-2xl p-4 sm:p-5 hover:border-[#1DB954]/40 transition-colors">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Unique Tracks</span>
              <Music className="w-4 h-4 text-pink-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {overview.uniqueTracks.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Top Genre: <strong className="text-pink-300">{overview.topGenre.split('/')[0].trim()}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Spotlight Duo + Persona Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Artist Spotlight */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#222222] border border-[#303030] p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5" />
              <span>#1 Top Artist</span>
            </span>
            <span className="text-xs text-gray-400">{overview.topArtist?.genre}</span>
          </div>

          {overview.topArtist ? (
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {overview.topArtist.artist}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Top track played: <span className="text-white font-medium">"{overview.topArtist.topTrack}"</span>
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 pt-4 border-t border-[#333]">
                <div className="bg-[#141414] rounded-xl p-3">
                  <div className="text-[11px] text-gray-400 uppercase font-semibold">Total Time</div>
                  <div className="text-lg font-bold text-white font-mono">
                    {overview.topArtist.totalMinutes.toLocaleString()} min
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {(overview.topArtist.totalMinutes / 60).toFixed(1)} hours
                  </div>
                </div>
                <div className="bg-[#141414] rounded-xl p-3">
                  <div className="text-[11px] text-gray-400 uppercase font-semibold">Total Plays</div>
                  <div className="text-lg font-bold text-white font-mono">
                    {overview.topArtist.playCount.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {overview.topArtist.uniqueTracks} distinct tracks
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-sm">No stream data available</div>
          )}
        </div>

        {/* Top Track Spotlight */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#222222] border border-[#303030] p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[#1DB954] text-xs font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5" />
              <span>#1 Top Track</span>
            </span>
            <span className="text-xs text-gray-400">On Repeat</span>
          </div>

          {overview.topTrack ? (
            <div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight line-clamp-2">
                {overview.topTrack.track}
              </h3>
              <p className="text-sm text-gray-300 mt-1 font-medium">
                by {overview.topTrack.artist}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Album: {overview.topTrack.album}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 pt-4 border-t border-[#333]">
                <div className="bg-[#141414] rounded-xl p-3">
                  <div className="text-[11px] text-gray-400 uppercase font-semibold">Streams</div>
                  <div className="text-lg font-bold text-white font-mono">
                    {overview.topTrack.playCount.toLocaleString()} plays
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Skip rate: {Math.round(overview.topTrack.skipRate * 100)}%
                  </div>
                </div>
                <div className="bg-[#141414] rounded-xl p-3">
                  <div className="text-[11px] text-gray-400 uppercase font-semibold">Minutes</div>
                  <div className="text-lg font-bold text-white font-mono">
                    {overview.topTrack.totalMinutes.toLocaleString()} min
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {(overview.topTrack.totalMinutes / 60).toFixed(1)} hours
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-sm">No stream data available</div>
          )}
        </div>

        {/* Listening Persona Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c1a24] to-[#16151f] border border-[#3b3252] p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>Persona Profile</span>
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-200 border border-purple-700/50">
              {persona.badge}
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              {persona.title}
            </h3>
            <p className="text-xs text-purple-300/80 font-medium mt-0.5">
              "{persona.subtitle}"
            </p>
            <p className="text-xs text-gray-300 mt-3 leading-relaxed">
              {persona.description}
            </p>

            {/* Trait bars */}
            <div className="mt-4 space-y-2 pt-3 border-t border-purple-900/40">
              {persona.traits.map((t) => (
                <div key={t.label} className="text-xs">
                  <div className="flex justify-between text-gray-300 mb-1">
                    <span className="text-gray-400">{t.label}</span>
                    <span className="font-semibold text-purple-200">{t.value}</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${t.score}%`,
                        backgroundColor: persona.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
