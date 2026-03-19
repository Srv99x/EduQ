import React from 'react';
import { motion } from 'framer-motion';

interface StreakDisplayProps {
  streak: number;
  showCalendar?: boolean;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ streak, showCalendar = false }) => {
  const days = Array.from({ length: 7 }, (_, i) => i);

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-full text-white font-bold"
      >
        <span className="text-2xl">🔥</span>
        <span className="text-xl">{streak}</span>
      </motion.div>

      {showCalendar && (
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => (
            <motion.div
              key={day}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: day * 0.05 }}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                day < streak
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/10 text-subtext'
              }`}
            >
              {day < streak ? '🔥' : '○'}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StreakDisplay;
