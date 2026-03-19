import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { LEVEL_TIERS } from '../gamificationConstants';
import gamificationService from '../services/gamificationService';
import { UserGameProfile, LeaderboardEntry } from '../types';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'allTime'>('weekly');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [currentProfile, setCurrentProfile] = useState<UserGameProfile | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId') || 'default_user';
    const profile = gamificationService.getGameProfile(userId);
    setCurrentProfile(profile);

    // Generate sample leaderboard data
    const generatedEntries: LeaderboardEntry[] = Array.from({ length: 50 }, (_, i) => ({
      userId: `user_${i}`,
      username: `Player ${i + 1}`,
      level: Math.max(1, profile.level - Math.floor(Math.random() * 10)),
      totalXP: Math.max(0, profile.totalXP - Math.floor(Math.random() * 5000)),
      weeklyXP: timeframe === 'weekly' ? Math.floor(Math.random() * (profile.weeklyXP + 500)) : 0,
      badges: Math.floor(Math.random() * 18),
      streak: Math.floor(Math.random() * 100),
      rank: i + 1,
      rankChange: Math.floor(Math.random() * 5) - 2,
    })).sort((a, b) => {
      if (timeframe === 'weekly') return (b.weeklyXP || 0) - (a.weeklyXP || 0);
      return b.totalXP - a.totalXP;
    }).map((entry, idx) => ({
      ...entry,
      rank: idx + 1,
    }));

    const currentUserEntry = generatedEntries.find((e) => e.userId === userId) || generatedEntries[0];
    const indexOfUser = generatedEntries.findIndex((e) => e.userId === userId);

    if (indexOfUser === -1) {
      const newEntry: LeaderboardEntry = {
        userId,
        username: 'You',
        level: profile.level,
        totalXP: profile.totalXP,
        weeklyXP: profile.weeklyXP,
        badges: profile.badges.length,
        streak: profile.currentStreak,
        rank: 999,
        rankChange: 0,
      };
      generatedEntries.push(newEntry);
      setUserRank(generatedEntries.length);
    } else {
      setUserRank(indexOfUser + 1);
    }

    setEntries(generatedEntries);
  }, [timeframe]);

  const levelTier = LEVEL_TIERS.find((t) => t.level === currentProfile?.level);
  const sortedEntries = entries
    .sort((a, b) => {
      if (timeframe === 'weekly') return (b.weeklyXP || 0) - (a.weeklyXP || 0);
      return b.totalXP - a.totalXP;
    })
    .slice(0, 10);

  const userEntry = entries.find((e) => e.userId === (localStorage.getItem('userId') || 'default_user'));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Leaderboard 🏆</h1>
        <p className="text-subtext mt-2">Climb the ranks and compete with other learners</p>
      </div>

      {/* Timeframe Tabs */}
      <div className="flex gap-3 bg-surface border border-white/10 p-1 rounded-xl">
        {[
          { id: 'weekly' as const, label: '📅 This Week', color: 'from-yellow-500 to-orange-500' },
          { id: 'allTime' as const, label: '🌟 All Time', color: 'from-purple-500 to-pink-500' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTimeframe(tab.id)}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
              timeframe === tab.id
                ? 'bg-gradient-to-r ' + tab.color + ' text-white shadow-lg'
                : 'text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* User's Current Rank */}
      {userEntry && userRank && userRank > 10 && (
        <GlassCard className="p-6 border-l-4 border-primary">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="text-3xl font-bold text-primary">#{userRank}</div>
              <div>
                <p className="text-white font-bold">{userEntry.username}</p>
                <div className="flex gap-4 mt-2 text-sm text-subtext">
                  <span>L{userEntry.level}</span>
                  <span>
                    {timeframe === 'weekly' ? `${userEntry.weeklyXP} XP` : `${userEntry.totalXP} XP`}
                  </span>
                  <span>🔥 {userEntry.streak}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-subtext mb-2">Your Rank</p>
              {userEntry.rankChange > 0 && (
                <p className="flex items-center justify-end gap-1 text-green-400 font-bold">
                  <TrendingUp size={16} />
                  +{userEntry.rankChange}
                </p>
              )}
              {userEntry.rankChange < 0 && (
                <p className="flex items-center justify-end gap-1 text-red-400 font-bold">
                  <TrendingDown size={16} />
                  {userEntry.rankChange}
                </p>
              )}
              {userEntry.rankChange === 0 && (
                <p className="flex items-center justify-end gap-1 text-yellow-400">
                  <Minus size={16} />
                  No change
                </p>
              )}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Top 10 Leaderboard */}
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-white">Top 10</h2>
        <div className="space-y-2">
          {sortedEntries.map((entry, index) => {
            const isUser = entry.userId === (localStorage.getItem('userId') || 'default_user');
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '·';

            return (
              <GlassCard
                key={entry.userId}
                className={`p-4 flex items-center justify-between ${
                  isUser ? 'border-l-4 border-primary' : ''
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-2xl w-8 text-center">{medal}</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-yellow-600 flex items-center justify-center font-bold text-white">
                    {entry.rank}
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold ${isUser ? 'text-primary' : 'text-white'}`}>
                      {entry.username}
                    </p>
                    <div className="flex gap-3 text-xs text-subtext mt-1">
                      <span>Level {entry.level}</span>
                      <span>🔥 {entry.streak}</span>
                      <span>{entry.badges} 🏅</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-yellow-400">
                    {timeframe === 'weekly' ? `${entry.weeklyXP} XP` : `${entry.totalXP} XP`}
                  </p>
                  {entry.rankChange !== 0 && (
                    <p
                      className={`text-xs mt-1 font-semibold ${
                        entry.rankChange > 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {entry.rankChange > 0 ? '↑' : '↓'} {Math.abs(entry.rankChange)}
                    </p>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Your Stats Summary */}
      {currentProfile && (
        <GlassCard className="p-6 bg-gradient-to-r from-primary/20 to-yellow-600/20 border border-primary/50">
          <h3 className="text-lg font-bold text-white mb-4">Your Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-subtext">Current Level</p>
              <p className="text-2xl font-bold text-primary mt-1">{currentProfile.level}</p>
              <p className="text-xs text-subtext mt-1">{levelTier?.title}</p>
            </div>
            <div>
              <p className="text-sm text-subtext">Total XP</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1">{currentProfile.totalXP}</p>
            </div>
            <div>
              <p className="text-sm text-subtext">This Week</p>
              <p className="text-2xl font-bold text-cyan-400 mt-1">{currentProfile.weeklyXP}</p>
            </div>
            <div>
              <p className="text-sm text-subtext">Rank</p>
              <p className="text-2xl font-bold text-primary mt-1">#{userRank || '?'}</p>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default Leaderboard;
