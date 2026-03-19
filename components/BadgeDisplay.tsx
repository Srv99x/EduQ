import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../types';

interface BadgeDisplayProps {
  badge: Badge;
  earned?: boolean;
  favorited?: boolean;
}

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badge, earned = false, favorited = false }) => {
  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-600',
  };

  const rarityBorder = {
    common: 'border-gray-500',
    rare: 'border-blue-500',
    epic: 'border-purple-500',
    legendary: 'border-yellow-500',
  };

  return (
    <motion.div
      whileHover={earned ? { scale: 1.05 } : {}}
      className="flex flex-col items-center gap-2"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className={`relative w-20 h-20 rounded-full border-2 ${rarityBorder[badge.rarity]} flex items-center justify-center text-3xl ${
          earned
            ? `bg-gradient-to-br ${rarityColors[badge.rarity]}`
            : 'bg-black/40 opacity-50'
        }`}
      >
        {earned ? badge.icon : '?'}

        {favorited && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 text-lg">
            ⭐
          </motion.div>
        )}

        {earned && (
          <motion.div
            animate={{
              boxShadow: ['0 0 0px rgba(255,215,0,0)', '0 0 20px rgba(255,215,0,0.8)', '0 0 0px rgba(255,215,0,0)'],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full pointer-events-none"
          />
        )}
      </motion.div>

      <div className="text-center">
        <p className="text-xs font-bold text-white truncate w-24">{badge.name}</p>
        <p className="text-[10px] text-subtext truncate w-24">{badge.description}</p>
      </div>
    </motion.div>
  );
};

export default BadgeDisplay;
