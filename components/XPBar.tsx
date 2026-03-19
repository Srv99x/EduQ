import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LEVEL_TIERS } from '../gamificationConstants';
import gamificationService from '../services/gamificationService';

interface XPBarProps {
  currentXP: number;
  level: number;
  title: string;
  onLevelUp?: () => void;
}

export const XPBar: React.FC<XPBarProps> = ({ currentXP, level, title, onLevelUp }) => {
  const [displayXP, setDisplayXP] = useState(0);
  const xpToNext = gamificationService.getXPToNextLevel(currentXP);
  const progressPercent = gamificationService.getXPProgressPercent(currentXP);
  const currentTier = gamificationService.getCurrentLevelTier(level);
  const nextTier = LEVEL_TIERS[level] || currentTier;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayXP(currentXP);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentXP]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{currentTier.icon}</span>
          <div>
            <p className="text-sm text-subtext uppercase tracking-widest">Level {level}</p>
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-subtext">
          <span>{displayXP} XP</span>
          <span className="text-primary">{xpToNext} XP to next level</span>
        </div>

        <div className="relative w-full h-4 rounded-full bg-white/10 border border-primary/30 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progressPercent, 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-primary to-yellow-400 rounded-full relative"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: [0, 1, 0], x: [20, 40, 60] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 blur-sm"
            />
          </motion.div>

          {progressPercent >= 95 && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="absolute top-1/2 right-2 -translate-y-1/2 text-lg">
              ⭐
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default XPBar;
