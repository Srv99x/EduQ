import { useState, useEffect } from 'react';

export function useStreak() {
  const [streak, setStreak] = useState(0);
  const [lastClaim, setLastClaim] = useState<string | null>(null);
  const [claimedToday, setClaimedToday] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('eduq_streak') || '{}');
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (stored.lastClaim === today) {
      setClaimedToday(true);
      setStreak(stored.streak || 0);
    } else if (stored.lastClaim === yesterday) {
      setStreak(stored.streak || 0); // streak continues
    } else if (stored.lastClaim) {
      setStreak(0); // streak broken
    }
    setLastClaim(stored.lastClaim);
  }, []);

  const claimReward = (xpGain: number) => {
    const today = new Date().toDateString();
    const newStreak = streak + 1;
    localStorage.setItem('eduq_streak', JSON.stringify({
      streak: newStreak,
      lastClaim: today,
    }));
    setStreak(newStreak);
    setClaimedToday(true);
    // plug into your existing XP system here:
    // dispatch({ type: 'ADD_XP', payload: xpGain });
  };

  return { streak, claimedToday, claimReward };
}
