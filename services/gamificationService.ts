import { UserGameProfile, XPTransaction, GemTransaction, LevelTier } from '../types';
import { LEVEL_TIERS, XP_PER_LEVEL, STREAK_MILESTONES } from '../gamificationConstants';

const STORAGE_KEY = 'eduq_game_profile';

export const gamificationService = {
  // ========== PROFILE MANAGEMENT ==========
  
  getGameProfile(userId: string): UserGameProfile {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load game profile:', e);
    }

    return this.createNewProfile(userId);
  },

  createNewProfile(userId: string): UserGameProfile {
    const profile: UserGameProfile = {
      userId,
      level: 1,
      totalXP: 0,
      currentLevelXP: 0,
      gems: 100, // Starting gems
      streak: 0,
      lastLoginDate: new Date().toISOString().split('T')[0],
      streakFreezeUsed: false,
      title: 'Syntax Sprout',
      badges: [],
      completedQuests: [],
      completedAchievements: [],
      favoriteAchievements: [],
      gemHistory: [],
      xpHistory: [],
      studySessions: [],
    };
    this.saveProfile(profile);
    return profile;
  },

  saveProfile(profile: UserGameProfile): void {
    try {
      localStorage.setItem(`${STORAGE_KEY}_${profile.userId}`, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save game profile:', e);
    }
  },

  // ========== XP & LEVELING ==========

  addXP(profile: UserGameProfile, amount: number, source: XPTransaction['source'], description: string): UserGameProfile {
    const updatedProfile = { ...profile };
    updatedProfile.totalXP += amount;
    updatedProfile.currentLevelXP += amount;

    const xpTx: XPTransaction = {
      id: `xp_${Date.now()}`,
      amount,
      source,
      timestamp: Date.now(),
      description,
    };
    updatedProfile.xpHistory.push(xpTx);

    // Check for level up
    while (updatedProfile.currentLevelXP >= XP_PER_LEVEL && updatedProfile.level < 20) {
      updatedProfile.currentLevelXP -= XP_PER_LEVEL;
      updatedProfile.level += 1;
      const newTier = LEVEL_TIERS.find((t) => t.level === updatedProfile.level);
      if (newTier) {
        updatedProfile.title = newTier.title;
      }
      updatedProfile.gems += 10; // Bonus gems on level up
    }

    this.saveProfile(updatedProfile);
    return updatedProfile;
  },

  getCurrentLevelTier(level: number): LevelTier {
    return LEVEL_TIERS.find((t) => t.level === level) || LEVEL_TIERS[0];
  },

  getXPToNextLevel(currentXP: number): number {
    return Math.max(0, XP_PER_LEVEL - currentXP);
  },

  getXPProgressPercent(currentXP: number): number {
    return Math.min(100, (currentXP / XP_PER_LEVEL) * 100);
  },

  // ========== GEMS ==========

  addGems(profile: UserGameProfile, amount: number, source: string): UserGameProfile {
    const updatedProfile = { ...profile };
    updatedProfile.gems += amount;
    const tx: GemTransaction = {
      id: `gem_${Date.now()}`,
      amount,
      type: 'earn',
      source,
      timestamp: Date.now(),
    };
    updatedProfile.gemHistory.push(tx);
    this.saveProfile(updatedProfile);
    return updatedProfile;
  },

  spendGems(profile: UserGameProfile, amount: number, reason: string): UserGameProfile | null {
    if (profile.gems < amount) return null;

    const updatedProfile = { ...profile };
    updatedProfile.gems -= amount;
    const tx: GemTransaction = {
      id: `gem_${Date.now()}`,
      amount,
      type: 'spend',
      source: reason,
      timestamp: Date.now(),
    };
    updatedProfile.gemHistory.push(tx);
    this.saveProfile(updatedProfile);
    return updatedProfile;
  },

  // ========== STREAK ==========

  updateStreak(profile: UserGameProfile): UserGameProfile {
    const today = new Date().toISOString().split('T')[0];
    const lastLogin = profile.lastLoginDate;

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (lastLogin === today) {
      // Already logged in today
      return profile;
    }

    const updatedProfile = { ...profile };
    updatedProfile.lastLoginDate = today;

    if (lastLogin === yesterday) {
      // Streak continues
      updatedProfile.streak += 1;
      updatedProfile.gems += 5; // Daily login bonus

      // Check for milestone
      const milestone = STREAK_MILESTONES.find((m) => m.days === updatedProfile.streak);
      if (milestone) {
        updatedProfile.gems += milestone.gemReward;
      }
    } else {
      // Streak reset
      updatedProfile.streak = 1;
      updatedProfile.streakFreezeUsed = false;
    }

    this.saveProfile(updatedProfile);
    return updatedProfile;
  },

  useStreakFreeze(profile: UserGameProfile): UserGameProfile | null {
    const freezeCost = 50;
    if (profile.gems < freezeCost) return null;

    const updated = this.spendGems(profile, freezeCost, 'streak_freeze');
    if (!updated) return null;

    updated.streakFreezeUsed = true;
    this.saveProfile(updated);
    return updated;
  },

  // ========== QUESTS & ACHIEVEMENTS ==========

  completeQuest(profile: UserGameProfile, questId: string, xpReward: number, gemReward: number): UserGameProfile {
    if (!profile.completedQuests.includes(questId)) {
      profile.completedQuests.push(questId);
      profile = this.addXP(profile, xpReward, 'quest', `Completed quest: ${questId}`);
      profile = this.addGems(profile, gemReward, `quest_${questId}`);
    }
    return profile;
  },

  earnBadge(profile: UserGameProfile, badgeId: string): UserGameProfile {
    if (!profile.badges.includes(badgeId)) {
      profile.badges.push(badgeId);
      profile.gems += 25; // Bonus gems for earning badge
    }
    this.saveProfile(profile);
    return profile;
  },

  // ========== STUDY SESSIONS ==========

  recordStudySession(profile: UserGameProfile, durationMinutes: number): UserGameProfile {
    const session = {
      id: `session_${Date.now()}`,
      startedAt: Date.now() - durationMinutes * 60000,
      endedAt: Date.now(),
      durationSeconds: durationMinutes * 60,
      dayKey: new Date().toISOString().split('T')[0],
    };

    profile.studySessions.push(session);

    // Award XP: ~1 XP per minute of study
    const xpEarned = Math.floor(durationMinutes / 2);
    profile = this.addXP(profile, xpEarned, 'lesson', `Studied for ${durationMinutes} minutes`);

    this.saveProfile(profile);
    return profile;
  },

  // ========== STATS ==========

  getTotalStudyHours(profile: UserGameProfile): number {
    const seconds = profile.studySessions.reduce((sum, s) => sum + (s.durationSeconds || 0), 0);
    return seconds / 3600;
  },

  getThisWeekXP(profile: UserGameProfile): number {
    const weekAgo = Date.now() - 7 * 86400000;
    return profile.xpHistory
      .filter((tx) => tx.timestamp > weekAgo)
      .reduce((sum, tx) => sum + tx.amount, 0);
  },

  getStreakMilestoneInfo(streak: number): { title: string; gemReward: number } | null {
    return STREAK_MILESTONES.find((m) => m.days === streak) || null;
  },
};

export default gamificationService;
