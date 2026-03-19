import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { SAMPLE_DAILY_QUESTS, SAMPLE_WEEKLY_QUESTS, STORY_QUESTS } from '../gamificationConstants';
import gamificationService from '../services/gamificationService';
import { UserGameProfile, Quest } from '../types';
import { Zap, Target, BookOpen, CheckCircle } from 'lucide-react';

export const Quests: React.FC = () => {
  const [profile, setProfile] = useState<UserGameProfile | null>(null);
  const [selectedTab, setSelectedTab] = useState<'daily' | 'weekly' | 'story'>('daily');

  useEffect(() => {
    const userId = localStorage.getItem('userId') || 'default_user';
    const userProfile = gamificationService.getGameProfile(userId);
    setProfile(userProfile);
  }, []);

  const createQuestFromData = (data: any, type: 'daily' | 'weekly' | 'story', index: number): Quest => {
    const baseProgress = Math.floor(Math.random() * (data.target || 100)) || 0;
    return {
      id: data.id,
      type,
      title: data.title,
      description: data.description,
      icon: data.icon,
      progress: profile?.completedQuests.includes(data.id) ? data.target || 100 : baseProgress,
      target: data.target || 100,
      xpReward: data.xpReward,
      gemReward: data.gemReward,
      difficulty: ['easy', 'medium', 'hard'][index % 3] as any,
      completed: profile?.completedQuests.includes(data.id) || false,
    };
  };

  const quests = {
    daily: SAMPLE_DAILY_QUESTS.map((q, i) => createQuestFromData(q, 'daily', i)),
    weekly: SAMPLE_WEEKLY_QUESTS.map((q, i) => createQuestFromData(q, 'weekly', i)),
    story: STORY_QUESTS.map((q, i) => createQuestFromData(q, 'story', i)),
  };

  const activeQuests = quests[selectedTab];
  const completedCount = activeQuests.filter((q) => q.completed).length;
  const totalXP = activeQuests.reduce((sum, q) => sum + q.xpReward, 0);
  const totalGems = activeQuests.reduce((sum, q) => sum + q.gemReward, 0);

  const handleCompleteQuest = (questId: string) => {
    if (!profile) return;
    const quest = activeQuests.find((q) => q.id === questId);
    if (!quest) return;

    const updated = gamificationService.completeQuest(
      profile,
      questId,
      quest.xpReward,
      quest.gemReward
    );
    setProfile(updated);
  };

  if (!profile) {
    return <div className="text-center py-12 text-subtext">Loading quests...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Quest Board 🎯</h1>
        <p className="text-subtext mt-2">Complete quests to earn XP and gems</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 bg-surface border border-white/10 p-1 rounded-xl">
        {[
          { id: 'daily' as const, label: 'Daily Quests', icon: '📅', color: 'from-yellow-500 to-orange-500' },
          { id: 'weekly' as const, label: 'Weekly', icon: '⭐', color: 'from-blue-500 to-cyan-500' },
          { id: 'story' as const, label: 'Story Arc', icon: '📖', color: 'from-purple-500 to-pink-500' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
              selectedTab === tab.id
                ? 'bg-gradient-to-r ' + tab.color + ' text-white shadow-lg'
                : 'text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span>{tab.icon}</span>
              {tab.label}
            </div>
          </button>
        ))}
      </div>

      {/* Quest Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard>
          <p className="text-sm text-subtext">Active Quests</p>
          <p className="text-2xl font-bold text-white mt-2">{activeQuests.length}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-subtext">Completed</p>
          <p className="text-2xl font-bold text-primary mt-2">{completedCount}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-subtext">Total XP</p>
          <p className="text-2xl font-bold text-yellow-400 mt-2">+{totalXP}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-sm text-subtext">Total Gems</p>
          <p className="text-2xl font-bold text-cyan-400 mt-2">+{totalGems}</p>
        </GlassCard>
      </div>

      {/* Quests List */}
      <div className="space-y-3">
        {activeQuests.map((quest) => {
          const progressPercent = (quest.progress / quest.target) * 100;
          const isCompleted = quest.completed;

          return (
            <GlassCard key={quest.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{quest.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-white flex items-center gap-2">
                        {quest.title}
                        {isCompleted && <CheckCircle size={16} className="text-green-400" />}
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          quest.difficulty === 'easy'
                            ? 'bg-green-500/20 text-green-300'
                            : quest.difficulty === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {quest.difficulty}
                        </span>
                      </h3>
                      <p className="text-sm text-subtext">{quest.description}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1 mt-3">
                    <div className="flex justify-between text-xs text-subtext">
                      <span>{quest.progress}/{quest.target}</span>
                      <span>{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isCompleted
                            ? 'bg-gradient-to-r from-green-400 to-green-600'
                            : 'bg-gradient-to-r from-primary to-yellow-400'
                        }`}
                        style={{ width: `${Math.min(progressPercent, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Rewards & Action */}
                <div className="flex flex-col items-end gap-2 min-w-max">
                  <div className="text-center">
                    <p className="text-sm font-bold text-yellow-400">+{quest.xpReward} XP</p>
                    <p className="text-sm font-bold text-cyan-400">+{quest.gemReward} 💎</p>
                  </div>
                  <Button
                    onClick={() => handleCompleteQuest(quest.id)}
                    disabled={!isCompleted && progressPercent < 100}
                    variant={isCompleted ? 'secondary' : 'primary'}
                    size="sm"
                  >
                    {isCompleted ? 'Claimed ✓' : 'Claim'}
                  </Button>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

export default Quests;
