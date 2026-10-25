import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
} from 'recharts';
import { StreamRecord } from '../types/spotify';
import { calculateAudioFeatures, getAudioFeatureDescriptions } from '../utils/audioFeatures';
import { Activity, Gauge, Sliders, Sparkles } from 'lucide-react';

interface AudioRadarChartProps {
  records: StreamRecord[];
}

export const AudioRadarChart: React.FC<AudioRadarChartProps> = ({ records }) => {
  const [compareSegment, setCompareSegment] = useState<'none' | 'night' | 'workday'>('night');

  const overallFeatures = useMemo(() => {
    return calculateAudioFeatures(records);
  }, [records]);

  const segmentedFeatures = useMemo(() => {
    if (compareSegment === 'none') return null;
    let filtered: StreamRecord[] = [];
    if (compareSegment === 'night') {
      filtered = records.filter((r) => r.hour >= 22 || r.hour <= 4);
    } else if (compareSegment === 'workday') {
      filtered = records.filter((r) => r.hour >= 9 && r.hour <= 17 && r.dayOfWeek >= 1 && r.dayOfWeek <= 5);
    }
    return calculateAudioFeatures(filtered);
  }, [records, compareSegment]);

  const descriptions = useMemo(() => {
    return getAudioFeatureDescriptions(overallFeatures);
  }, [overallFeatures]);

  // Format data for Recharts Radar
  const radarData = useMemo(() => {
    const keys = [
      { key: 'danceability', label: 'Danceability' },
      { key: 'energy', label: 'Energy' },
      { key: 'valence', label: 'Valence (Happiness)' },
      { key: 'acousticness', label: 'Acousticness' },
      { key: 'instrumentalness', label: 'Instrumentalness' },
      { key: 'speechiness', label: 'Speechiness' },
    ];

    return keys.map((k) => {
      const row: any = {
        trait: k.label,
        overall: (overallFeatures as any)[k.key] || 0,
      };
      if (segmentedFeatures) {
        row.segment = (segmentedFeatures as any)[k.key] || 0;
      }
      return row;
    });
  }, [overallFeatures, segmentedFeatures]);

  return (
    <div className="bg-[#181818] border border-[#282828] rounded-2xl p-6 shadow-xl mb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400">
              <Activity className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Acoustic Profile &amp; Mood Radar
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Synthetic audio-feature decomposition mapping danceability, acoustic weight, valence, and energy
          </p>
        </div>

        {/* Comparison toggle */}
        <div className="flex items-center bg-[#121212] p-1 rounded-xl border border-[#2e2e2e]">
          <span className="text-[11px] text-gray-500 px-2 font-medium">Compare:</span>
          <button
            onClick={() => setCompareSegment('none')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              compareSegment === 'none'
                ? 'bg-[#282828] text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Solo
          </button>
          <button
            onClick={() => setCompareSegment('night')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              compareSegment === 'night'
                ? 'bg-purple-900/60 text-purple-200 border border-purple-500/40 shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            vs. Night Owl
          </button>
          <button
            onClick={() => setCompareSegment('workday')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              compareSegment === 'workday'
                ? 'bg-amber-900/60 text-amber-200 border border-amber-500/40 shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            vs. Work Hours
          </button>
        </div>
      </div>

      {/* Grid: Radar Chart + Diagnostic Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radar Visualizer */}
        <div className="lg:col-span-7 h-80 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#2c2c2c" />
              <PolarAngleAxis
                dataKey="trait"
                stroke="#999"
                fontSize={11}
                tick={{ fill: '#bbb', fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                stroke="#444"
                fontSize={9}
                tick={false}
              />
              <Radar
                name="Overall Catalog"
                dataKey="overall"
                stroke="#1DB954"
                fill="#1DB954"
                fillOpacity={0.4}
                strokeWidth={2}
              />
              {compareSegment !== 'none' && (
                <Radar
                  name={compareSegment === 'night' ? 'Night Streams (10PM-4AM)' : 'Work Hours (9AM-5PM)'}
                  dataKey="segment"
                  stroke={compareSegment === 'night' ? '#a29bfe' : '#fdcb6e'}
                  fill={compareSegment === 'night' ? '#a29bfe' : '#fdcb6e'}
                  fillOpacity={0.35}
                  strokeWidth={2}
                />
              )}
              <Tooltip
                content={({ active, payload }: any) => {
                  if (!active || !payload || !payload.length) return null;
                  const item = payload[0].payload;
                  return (
                    <div className="bg-[#242424] border border-[#3e3e3e] rounded-xl p-3 text-xs shadow-2xl text-white">
                      <div className="font-bold text-gray-200 mb-1">{item.trait}</div>
                      <div className="text-emerald-400 font-mono font-bold">
                        Overall: {item.overall}/100
                      </div>
                      {item.segment !== undefined && (
                        <div
                          className="font-mono font-bold mt-0.5"
                          style={{
                            color: compareSegment === 'night' ? '#a29bfe' : '#fdcb6e',
                          }}
                        >
                          Comparison: {item.segment}/100
                        </div>
                      )}
                    </div>
                  );
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Feature Gauges & Synthesis */}
        <div className="lg:col-span-5 space-y-4">
          {/* Sonic Headline Badge */}
          <div className="bg-[#121212] p-4 rounded-2xl border border-[#262626]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Primary Aesthetic
              </span>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/30">
                {descriptions.moodTag}
              </span>
            </div>
            <div className="mt-3 space-y-1.5 text-xs text-gray-300">
              {descriptions.insights.map((insight, idx) => (
                <p key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-1.5 shrink-0" />
                  <span>{insight}</span>
                </p>
              ))}
            </div>
          </div>

          {/* Quick Metrics Duo */}
          <div className="grid grid-cols-2 gap-3">
            {/* Tempo BPM Gauge */}
            <div className="bg-[#121212] p-4 rounded-xl border border-[#262626]">
              <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
                <span>Pacing / BPM</span>
                <Gauge className="w-3.5 h-3.5 text-yellow-400" />
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">
                {overallFeatures.tempoBpm}{' '}
                <span className="text-xs font-normal text-gray-400">BPM</span>
              </div>
              <div className="text-[11px] text-gray-500 mt-1">Average weighted tempo</div>
            </div>

            {/* Valence Gauge */}
            <div className="bg-[#121212] p-4 rounded-xl border border-[#262626]">
              <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
                <span>Valence (Positivity)</span>
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">
                {overallFeatures.valence}%
              </div>
              <div className="text-[11px] text-gray-500 mt-1">
                {overallFeatures.valence > 50 ? 'Major-key & Bright' : 'Minor-key & Deep'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
