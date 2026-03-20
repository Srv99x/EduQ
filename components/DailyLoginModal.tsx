import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, X, Lock, CheckCircle } from 'lucide-react';
import { DAILY_REWARDS, STREAK_MILESTONES } from '../constants/loginRewards';
import { useStreak } from '../hooks/useStreak';

export const DailyLoginModal: React.FC = () => {
  const { streak, claimedToday, claimReward } = useStreak();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Auto-show this modal once per day on app load using a useEffect that checks localStorage
    const hasSeenToday = localStorage.getItem('eduq_daily_seen') === new Date().toDateString();
    if (!hasSeenToday && !claimedToday) {
      setIsOpen(true);
      localStorage.setItem('eduq_daily_seen', new Date().toDateString());
    }
  }, [claimedToday]);

  const handleClaim = () => {
    const todayReward = DAILY_REWARDS[Math.min(streak, 6)].xp;
    claimReward(todayReward);
    // Close after a short delay
    setTimeout(() => setIsOpen(false), 1500);
  };

  if (!isOpen) return null;

  const currentDayIndex = streak % 7;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <div className="bg-[#0e0e14] border-2 border-[#2a2a3a] rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-[0_0_50px_rgba(245,200,66,0.15)] relative overflow-hidden flex flex-col items-center">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <Flame size={32} color="#f5c842" className="animate-pulse" />
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-1" style={{ fontFamily: "'Press Start 2P', cursive" }}>
                STREAK: {streak}
              </h1>
              <Flame size={32} color="#f5c842" className="animate-pulse" />
            </div>

            <p className="text-gray-400 mb-8 text-center text-sm font-sans">
              Keep your streak alive to unlock legendary drops!
            </p>

            {/* 7-Day Reward Grid */}
            <div className="grid grid-cols-4 md:grid-cols-7 gap-3 mb-8 w-full font-sans">
              {DAILY_REWARDS.map((reward, index) => {
                const isClaimed = index < currentDayIndex || (index === currentDayIndex && claimedToday);
                const isToday = index === currentDayIndex && !claimedToday;
                const isLocked = index > currentDayIndex;

                return (
                  <div 
                    key={reward.day}
                    className={`relative p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      isClaimed ? 'bg-[#16161e] border-[#4ade80]/30 opacity-70' :
                      isToday ? 'bg-[#16161e] border-[#f5c842] shadow-[0_0_20px_rgba(245,200,66,0.3)] scale-105 z-10' :
                      'bg-[#0e0e14] border-[#2a2a3a] opacity-50'
                    }`}
                  >
                    <div className="text-[10px] text-gray-500 mb-2 font-bold uppercase">Day {reward.day}</div>
                    <div className="text-2xl mb-2">{reward.icon}</div>
                    <div className={`text-xs font-bold ${isClaimed ? 'text-[#4ade80]' : isToday ? 'text-[#f5c842]' : 'text-gray-500'}`}>
                      {reward.xp} XP
                    </div>
                    {isClaimed && (
                      <div className="absolute top-1 right-1 text-[#4ade80]">
                        <CheckCircle size={14} />
                      </div>
                    )}
                    {isLocked && (
                      <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                        <Lock size={20} className="text-gray-500" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Milestones */}
            <div className="w-full bg-[#16161e] border border-[#2a2a3a] rounded-xl p-4 mb-8 font-sans">
              <h3 className="text-[#9b8aff] text-xs font-bold uppercase tracking-widest mb-4 text-center">Milestones</h3>
              <div className="flex justify-between items-start gap-2">
                {STREAK_MILESTONES.map((milestone) => {
                  const achieved = streak >= milestone.days;
                  const progress = Math.min(streak / milestone.days, 1);
                  return (
                    <div key={milestone.days} className="flex-1 flex flex-col items-center text-center">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xl mb-2 border ${
                        achieved ? 'bg-[#f5c842]/20 border-[#f5c842] shadow-[0_0_15px_rgba(245,200,66,0.3)]' : 'bg-black border-[#2a2a3a]'
                      }`}>
                        {milestone.icon}
                      </div>
                      <div className="text-[9px] font-bold text-gray-400 mb-1" style={{ fontFamily: "'Press Start 2P', cursive" }}>{milestone.days}D</div>
                      <div className="w-full h-1 bg-[#0e0e14] rounded-full overflow-hidden mt-2">
                        <div className="h-full bg-[#9b8aff]" style={{ width: `${progress * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Claim Button */}
            <button
              disabled={claimedToday}
              onClick={handleClaim}
              className={`w-full py-4 rounded-xl font-bold text-[10px] md:text-xs tracking-widest transition-all ${
                claimedToday 
                  ? 'bg-[#16161e] text-[#4ade80] border border-[#4ade80]/30 cursor-not-allowed'
                  : 'bg-[#f5c842] text-black hover:bg-yellow-400 shadow-[0_0_30px_rgba(245,200,66,0.4)]'
              }`}
              style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
              {claimedToday ? 'REWARD CLAIMED' : 'CLAIM TODAY\'S REWARD'}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
