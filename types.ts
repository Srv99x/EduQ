export enum UserRole {
  FREE = 'FREE',
  PRO = 'PRO'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  learningLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  streak: number;
  avatar?: string;
}

export interface NotebookEntry {
  id: string;
  title: string;
  content: string;
  summary?: string;
  tags: string[];
  lastModified: Date;
}

export interface CodeSession {
  id: string;
  language: 'python' | 'javascript' | 'typescript';
  code: string;
  output?: string;
  analysis?: string;
}

export interface AnalyticsMetric {
  label: string;
  value: number;
  trend: number; // Percentage change
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

// ========== GAMIFICATION TYPES ==========

export interface UserGameProfile {
  userId: string;
  level: number;
  totalXP: number;
  currentLevelXP: number;
  gems: number;
  streak: number;
  lastLoginDate: string;
  streakFreezeUsed: boolean;
  title: string;
  badges: string[];
  completedQuests: string[];
  completedAchievements: string[];
  favoriteAchievements: string[];
  gemHistory: GemTransaction[];
  xpHistory: XPTransaction[];
  studySessions: StudySession[];
  leaderboardRank?: number;
}

export interface XPTransaction {
  id: string;
  amount: number;
  source: 'lesson' | 'quiz' | 'quest' | 'achievement' | 'daily-login';
  timestamp: number;
  description: string;
}

export interface GemTransaction {
  id: string;
  amount: number;
  type: 'earn' | 'spend';
  source: string;
  timestamp: number;
}

export interface LevelTier {
  level: number;
  title: string;
  xpRequired: number;
  icon: string;
  color: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'coding' | 'streaks' | 'social' | 'hidden';
  requiredAction: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt?: number;
}

export interface Quest {
  id: string;
  type: 'daily' | 'weekly' | 'story';
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  xpReward: number;
  gemReward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  resetTime?: number;
  storyArc?: string;
  prerequisites?: string[];
  completed: boolean;
  completedAt?: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  topic: string;
  position: { x: number; y: number };
  prerequisites: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  completed: boolean;
  unlocked: boolean;
  duration: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  timeframe: 'week' | 'all-time';
  rankChange?: number;
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  duration?: number;
  effect: string;
  category: 'power' | 'theme' | 'special';
}

export interface StreakMilestone {
  days: number;
  gemReward: number;
  title: string;
  celebration: boolean;
}