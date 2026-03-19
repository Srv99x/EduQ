import { LevelTier, Badge, PowerUp, StreakMilestone } from './types';

// ========== LEVEL TIERS (20 LEVELS) ==========
export const LEVEL_TIERS: LevelTier[] = [
  { level: 1, title: 'Syntax Sprout', xpRequired: 0, icon: '🌱', color: '#90EE90' },
  { level: 2, title: 'Loop Learner', xpRequired: 100, icon: '🔄', color: '#87CEEB' },
  { level: 3, title: 'Function Friend', xpRequired: 250, icon: '⚙️', color: '#FFD700' },
  { level: 4, title: 'Array Alchemist', xpRequired: 500, icon: '📦', color: '#FF69B4' },
  { level: 5, title: 'Logic Legend', xpRequired: 850, icon: '🧠', color: '#00CED1' },
  { level: 6, title: 'Recursion Ranger', xpRequired: 1250, icon: '🔀', color: '#9370DB' },
  { level: 7, title: 'Algorithm Ace', xpRequired: 1700, icon: '🎯', color: '#FF4500' },
  { level: 8, title: 'Data Dancer', xpRequired: 2200, icon: '💾', color: '#00FA9A' },
  { level: 9, title: 'Structure Scholar', xpRequired: 2800, icon: '🏗️', color: '#FFB6C1' },
  { level: 10, title: 'Pattern Pro', xpRequired: 3500, icon: '🎨', color: '#87CEEB' },
  { level: 11, title: 'Web Wizard', xpRequired: 4300, icon: '🌐', color: '#FFD700' },
  { level: 12, title: 'Database Deity', xpRequired: 5200, icon: '🗄️', color: '#FF69B4' },
  { level: 13, title: 'API Ambassador', xpRequired: 6200, icon: '🤝', color: '#00CED1' },
  { level: 14, title: 'Framework Sage', xpRequired: 7300, icon: '⚡', color: '#9370DB' },
  { level: 15, title: 'Neural Ninja', xpRequired: 8500, icon: '🥷', color: '#FF4500' },
  { level: 16, title: 'Cloud Champion', xpRequired: 9800, icon: '☁️', color: '#00FA9A' },
  { level: 17, title: 'AI Architect', xpRequired: 11200, icon: '🤖', color: '#FFB6C1' },
  { level: 18, title: 'Quantum Quester', xpRequired: 12700, icon: '⚛️', color: '#87CEEB' },
  { level: 19, title: 'Code Deity', xpRequired: 14300, icon: '👑', color: '#FFD700' },
  { level: 20, title: 'Legend Eternal', xpRequired: 16000, icon: '✨', color: '#FF69B4' },
];

export const XP_PER_LEVEL = 500;

// ========== BADGES (30+) ==========
export const BADGES: Badge[] = [
  // Learning Category
  {
    id: 'first_lesson',
    name: 'First Step',
    description: 'Complete your first lesson',
    icon: '🚀',
    category: 'learning',
    requiredAction: 'complete_lesson_1',
    rarity: 'common',
  },
  {
    id: 'lesson_streak_7',
    name: 'Learning Habit',
    description: 'Complete 7 lessons in a row',
    icon: '📚',
    category: 'learning',
    requiredAction: 'complete_lessons_7',
    rarity: 'rare',
  },
  {
    id: 'complete_module',
    name: 'Module Master',
    description: 'Complete an entire module',
    icon: '🏆',
    category: 'learning',
    requiredAction: 'complete_module',
    rarity: 'rare',
  },
  {
    id: 'perfect_score',
    name: 'Perfect Quiz',
    description: 'Score 100% on a quiz',
    icon: '💯',
    category: 'learning',
    requiredAction: 'quiz_100_percent',
    rarity: 'epic',
  },

  // Coding Category
  {
    id: 'python_master',
    name: '🐍 Python Master',
    description: 'Complete all Python lessons',
    icon: '🐍',
    category: 'coding',
    requiredAction: 'python_mastery',
    rarity: 'epic',
  },
  {
    id: 'react_wizard',
    name: '⚛️ React Wizard',
    description: 'Complete all React lessons',
    icon: '⚛️',
    category: 'coding',
    requiredAction: 'react_mastery',
    rarity: 'epic',
  },
  {
    id: 'algorithm_master',
    name: '🔍 Algorithm Master',
    description: 'Master 20 different algorithms',
    icon: '🔍',
    category: 'coding',
    requiredAction: 'algorithms_20',
    rarity: 'legendary',
  },
  {
    id: 'debug_detective',
    name: '🔧 Debug Detective',
    description: 'Fix 50 code bugs',
    icon: '🔧',
    category: 'coding',
    requiredAction: 'bugs_fixed_50',
    rarity: 'rare',
  },
  {
    id: 'code_speedster',
    name: '⚡ Speed Demon',
    description: 'Complete a lesson in under 5 minutes',
    icon: '⚡',
    category: 'coding',
    requiredAction: 'lesson_under_5min',
    rarity: 'epic',
  },

  // Streak Category
  {
    id: 'streak_7',
    name: '🔥 Streak (7)',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    category: 'streaks',
    requiredAction: 'streak_7',
    rarity: 'rare',
  },
  {
    id: 'streak_30',
    name: '🔥 Streak (30)',
    description: 'Maintain a 30-day streak',
    icon: '🔥',
    category: 'streaks',
    requiredAction: 'streak_30',
    rarity: 'epic',
  },
  {
    id: 'streak_100',
    name: '🔥 Legendary Streak',
    description: 'Maintain a 100-day streak',
    icon: '🔥',
    category: 'streaks',
    requiredAction: 'streak_100',
    rarity: 'legendary',
  },

  // Lifestyle Category
  {
    id: 'night_owl',
    name: '🌙 Night Owl',
    description: 'Study between 11 PM and 4 AM',
    icon: '🌙',
    category: 'social',
    requiredAction: 'study_night',
    rarity: 'rare',
  },
  {
    id: 'early_bird',
    name: '🌅 Early Bird',
    description: 'Study between 5 AM and 7 AM',
    icon: '🌅',
    category: 'social',
    requiredAction: 'study_early',
    rarity: 'rare',
  },
  {
    id: 'daily_login_30',
    name: '📅 Devoted Learner',
    description: 'Login to the app for 30 consecutive days',
    icon: '📅',
    category: 'social',
    requiredAction: 'login_30',
    rarity: 'epic',
  },

  // Hidden Category
  {
    id: 'easter_egg_1',
    name: '🥚 Hidden Gem',
    description: 'Find a secret in the app',
    icon: '🥚',
    category: 'hidden',
    requiredAction: 'easter_egg_1',
    rarity: 'legendary',
  },
  {
    id: 'level_20',
    name: '💎 The Legend',
    description: 'Reach level 20',
    icon: '💎',
    category: 'hidden',
    requiredAction: 'level_20',
    rarity: 'legendary',
  },
];

// ========== POWER-UPS ==========
export const POWER_UPS: PowerUp[] = [
  {
    id: 'streak_freeze',
    name: 'Streak Freeze',
    description: 'Protect your streak for 1 day',
    icon: '❄️',
    cost: 50,
    duration: 86400,
    effect: 'freeze_streak',
    category: 'power',
  },
  {
    id: 'xp_double',
    name: '2x XP Boost',
    description: 'Double XP earned for 1 hour',
    icon: '⚡',
    cost: 80,
    duration: 3600,
    effect: 'double_xp',
    category: 'power',
  },
  {
    id: 'hint_pack',
    name: 'Hint Token x3',
    description: 'Get hints on code challenges',
    icon: '💡',
    cost: 30,
    duration: undefined,
    effect: 'hints_3',
    category: 'power',
  },
  {
    id: 'theme_cyberpunk',
    name: 'Cyberpunk Theme',
    description: 'Unlock a neon theme',
    icon: '🎨',
    cost: 200,
    duration: undefined,
    effect: 'theme_unlock',
    category: 'theme',
  },
  {
    id: 'theme_forest',
    name: 'Forest Theme',
    description: 'Unlock a nature-inspired theme',
    icon: '🌲',
    cost: 200,
    duration: undefined,
    effect: 'theme_unlock',
    category: 'theme',
  },
  {
    id: 'ai_extended',
    name: 'AI Tutor Session',
    description: 'Extended chat with AI tutor (unlimited for 24h)',
    icon: '🤖',
    cost: 100,
    duration: 86400,
    effect: 'ai_unlimited',
    category: 'special',
  },
];

// ========== STREAK MILESTONES ==========
export const STREAK_MILESTONES: StreakMilestone[] = [
  { days: 7, gemReward: 25, title: 'First Week Warrior', celebration: true },
  { days: 14, gemReward: 50, title: 'Fortnight Fighter', celebration: false },
  { days: 30, gemReward: 100, title: 'Month Mastery', celebration: true },
  { days: 60, gemReward: 150, title: 'Sixty-Day Scholar', celebration: false },
  { days: 100, gemReward: 250, title: 'Century Champion', celebration: true },
  { days: 365, gemReward: 500, title: 'Year-Long Legend', celebration: true },
];

// ========== SAMPLE QUESTS ==========
export const SAMPLE_DAILY_QUESTS = [
  {
    id: 'daily_lessons_2',
    title: 'Lesson Learner',
    description: 'Complete 2 lessons',
    icon: '📚',
    xpReward: 50,
    gemReward: 10,
  },
  {
    id: 'daily_quiz_80',
    title: 'Quiz Master',
    description: 'Score 80%+ on a quiz',
    icon: '✅',
    xpReward: 75,
    gemReward: 15,
  },
  {
    id: 'daily_code_30',
    title: 'Code Warrior',
    description: 'Code for 30 minutes',
    icon: '⌨️',
    xpReward: 60,
    gemReward: 12,
  },
];

export const SAMPLE_WEEKLY_QUESTS = [
  {
    id: 'weekly_module',
    title: 'Module Maven',
    description: 'Complete a full course module',
    icon: '🎯',
    xpReward: 200,
    gemReward: 50,
  },
  {
    id: 'weekly_xp',
    title: 'XP Collector',
    description: 'Earn 500 XP this week',
    icon: '⭐',
    xpReward: 0,
    gemReward: 100,
  },
];

export const STORY_QUESTS = [
  {
    id: 'story_hackathon_1',
    title: 'The Hackathon Crisis Begins',
    description: 'Complete the first Python challenge',
    icon: '🚨',
    xpReward: 150,
    gemReward: 30,
  },
  {
    id: 'story_hackathon_2',
    title: 'Algorithm Emergency',
    description: 'Solve 5 data structure problems',
    icon: '🔍',
    xpReward: 200,
    gemReward: 40,
  },
];
