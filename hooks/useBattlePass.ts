import { useState } from 'react';
import { SEASON_1 } from '../constants/battlePassData';

export function useBattlePass() {
  const totalXP = 6200; // swap with real value

  const currentLevel = Math.floor(totalXP / SEASON_1.xpPerLevel) + 1;
  const progressInLevel = totalXP % SEASON_1.xpPerLevel;
  const progressPct = Math.round((progressInLevel / SEASON_1.xpPerLevel) * 100);

  const [isPremium, setIsPremium] = useState(() => 
    JSON.parse(localStorage.getItem('eduq_premium') || 'false')
  );

  const [claimedRewards, setClaimedRewards] = useState<number[]>(() => 
    JSON.parse(localStorage.getItem('eduq_bp_claimed') || '[]')
  );

  const claimReward = (level: number) => {
    const updated = [...claimedRewards, level];
    localStorage.setItem('eduq_bp_claimed', JSON.stringify(updated));
    setClaimedRewards(updated);
  };

  const setPremium = (value: boolean) => {
    localStorage.setItem('eduq_premium', JSON.stringify(value));
    setIsPremium(value);
  };

  return { currentLevel, progressPct, isPremium, setPremium, claimedRewards, claimReward };
}
