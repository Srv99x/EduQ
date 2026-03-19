import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { POWER_UPS } from '../gamificationConstants';
import gamificationService from '../services/gamificationService';
import { UserGameProfile, PowerUp } from '../types';
import { X, ShoppingCart, Zap, AlertCircle } from 'lucide-react';

export const PowerUpShop: React.FC = () => {
  const [profile, setProfile] = useState<UserGameProfile | null>(null);
  const [selectedPowerUp, setSelectedPowerUp] = useState<PowerUp | null>(null);
  const [purchaseMessage, setPurchaseMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const userId = localStorage.getItem('userId') || 'default_user';
    const userProfile = gamificationService.getGameProfile(userId);
    setProfile(userProfile);
  }, []);

  const handlePurchase = (powerUp: PowerUp) => {
    if (!profile) return;

    if (profile.gems < powerUp.cost) {
      setPurchaseMessage({
        type: 'error',
        text: `Not enough gems! Need ${powerUp.cost}, you have ${profile.gems}`,
      });
      setCountdown(3);
      setTimeout(() => setPurchaseMessage(null), 3000);
      return;
    }

    // Deduct gems and add active power-up
    const updated = gamificationService.spendGems(profile, powerUp.cost);
    updated.activePowerUps.push({
      powerUpId: powerUp.id,
      purchasedAt: Date.now(),
      expiresAt: Date.now() + (powerUp.duration * 60 * 60 * 1000), // Convert hours to ms
    });

    setProfile(updated);
    setPurchaseMessage({
      type: 'success',
      text: `✨ Purchased ${powerUp.name}! Active for ${powerUp.duration} hours.`,
    });
    setCountdown(3);
    setTimeout(() => setPurchaseMessage(null), 3000);
  };

  if (!profile) {
    return <div className="text-center py-12 text-subtext">Loading shop...</div>;
  }

  const categorizedPowerUps = {
    streaks: POWER_UPS.filter((p) => p.category === 'streaks'),
    xp: POWER_UPS.filter((p) => p.category === 'xp'),
    cosmetic: POWER_UPS.filter((p) => p.category === 'cosmetic'),
    utility: POWER_UPS.filter((p) => p.category === 'utility'),
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Power-Up Shop ✨</h1>
        <p className="text-subtext mt-2">Boost your learning with special items</p>
      </div>

      {/* Gem Balance */}
      <GlassCard className="p-6 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-subtext">Your Gem Balance</p>
            <p className="text-3xl font-bold text-cyan-400 mt-2">{profile.gems} 💎</p>
          </div>
          <ShoppingCart size={48} className="text-cyan-400 opacity-50" />
        </div>
      </GlassCard>

      {/* Purchase Message */}
      <AnimatePresence>
        {purchaseMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-lg flex items-center gap-3 ${
              purchaseMessage.type === 'success'
                ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                : 'bg-red-500/20 border border-red-500/50 text-red-300'
            }`}
          >
            {purchaseMessage.type === 'success' ? (
              <Zap size={20} className="text-green-400" />
            ) : (
              <AlertCircle size={20} className="text-red-400" />
            )}
            <span className="flex-1">{purchaseMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories */}
      {Object.entries(categorizedPowerUps).map(([category, powerUps]) => {
        if (powerUps.length === 0) return null;

        const categoryNames: Record<string, string> = {
          streaks: '🔥 Streak Boosters',
          xp: '⭐ XP Multipliers',
          cosmetic: '🎨 Cosmetics',
          utility: '🛠️ Utility',
        };

        return (
          <div key={category}>
            <h2 className="text-lg font-bold text-white mb-4">{categoryNames[category]}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {powerUps.map((powerUp) => {
                const isActive = profile.activePowerUps.some((ap) => ap.powerUpId === powerUp.id);
                const canAfford = profile.gems >= powerUp.cost;

                return (
                  <motion.div
                    key={powerUp.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <GlassCard
                      className={`p-4 cursor-pointer relative overflow-hidden transition-all border ${
                        isActive
                          ? 'border-green-500 bg-green-500/10'
                          : canAfford
                          ? 'border-white/20 hover:border-primary'
                          : 'border-red-500/30 opacity-60'
                      }`}
                      onClick={() => setSelectedPowerUp(powerUp)}
                    >
                      {isActive && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          ACTIVE
                        </div>
                      )}

                      <div className="text-4xl mb-3">{powerUp.icon}</div>
                      <h3 className="font-bold text-white text-lg">{powerUp.name}</h3>
                      <p className="text-sm text-subtext mt-1 h-12">{powerUp.description}</p>

                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-cyan-400">{powerUp.cost}</span>
                          <span className="text-lg">💎</span>
                        </div>
                        <span className="text-xs text-subtext bg-white/10 px-2 py-1 rounded">
                          {powerUp.duration}h
                        </span>
                      </div>

                      {!isActive && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePurchase(powerUp);
                          }}
                          disabled={!canAfford}
                          variant={canAfford ? 'primary' : 'secondary'}
                          className="w-full mt-3"
                          size="sm"
                        >
                          {canAfford ? 'Buy Now' : 'Not Enough Gems'}
                        </Button>
                      )}
                      {isActive && (
                        <div className="w-full mt-3 py-2 text-center bg-green-500/30 rounded-lg text-green-300 text-sm font-semibold">
                          ✓ Purchased
                        </div>
                      )}
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedPowerUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedPowerUp(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface border border-white/20 rounded-2xl p-6 max-w-md w-full mx-4"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{selectedPowerUp.icon}</div>
                <button
                  onClick={() => setSelectedPowerUp(null)}
                  className="text-subtext hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">{selectedPowerUp.name}</h2>
              <p className="text-subtext mb-4">{selectedPowerUp.description}</p>

              <div className="bg-white/5 rounded-lg p-4 mb-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-subtext">Cost</span>
                  <span className="text-white font-bold">
                    {selectedPowerUp.cost} <span className="text-cyan-400">💎</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-subtext">Duration</span>
                  <span className="text-white font-bold">{selectedPowerUp.duration} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-subtext">Category</span>
                  <span className="text-white font-bold capitalize">{selectedPowerUp.category}</span>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/50 rounded-lg p-3 mb-4">
                <p className="text-sm text-primary font-semibold">💡 Pro Tip</p>
                <p className="text-xs text-primary/80 mt-1">{selectedPowerUp.description}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedPowerUp(null)}
                  variant="secondary"
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    handlePurchase(selectedPowerUp);
                    setSelectedPowerUp(null);
                  }}
                  disabled={profile.gems < selectedPowerUp.cost}
                  className="flex-1"
                >
                  Purchase
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      <GlassCard className="p-4 bg-blue-500/10 border border-blue-500/30">
        <p className="text-sm text-blue-200">
          💡 <strong>Tip:</strong> Complete quests and reach daily milestones to earn gems for the shop!
        </p>
      </GlassCard>
    </div>
  );
};

export default PowerUpShop;
