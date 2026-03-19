import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import gamificationService from '../services/gamificationService';
import { UserGameProfile, Skill } from '../types';
import { Lock, Unlock, CheckCircle, BookOpen, Code, Brain, Zap, X } from 'lucide-react';

interface SkillNode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  level: number;
  xpRequired: number;
  prerequisites: string[];
  unlocked: boolean;
  completed: boolean;
  position: { x: number; y: number };
}

const SKILL_TREE: SkillNode[] = [
  {
    id: 'basics',
    name: 'Programming Basics',
    description: 'Learn fundamental programming concepts',
    icon: <BookOpen size={24} />,
    level: 1,
    xpRequired: 0,
    prerequisites: [],
    unlocked: true,
    completed: false,
    position: { x: 50, y: 10 },
  },
  {
    id: 'variables',
    name: 'Variables & Data Types',
    description: 'Master variables and data type systems',
    icon: <Code size={24} />,
    level: 2,
    xpRequired: 100,
    prerequisites: ['basics'],
    unlocked: false,
    completed: false,
    position: { x: 20, y: 35 },
  },
  {
    id: 'loops',
    name: 'Loops & Iteration',
    description: 'Control flow with loops and iterations',
    icon: <Zap size={24} />,
    level: 2,
    xpRequired: 150,
    prerequisites: ['basics'],
    unlocked: false,
    completed: false,
    position: { x: 50, y: 35 },
  },
  {
    id: 'functions',
    name: 'Functions & Methods',
    description: 'Write reusable function code',
    icon: <Code size={24} />,
    level: 2,
    xpRequired: 150,
    prerequisites: ['basics'],
    unlocked: false,
    completed: false,
    position: { x: 80, y: 35 },
  },
  {
    id: 'oop',
    name: 'Object-Oriented Programming',
    description: 'Design with classes and objects',
    icon: <Brain size={24} />,
    level: 3,
    xpRequired: 300,
    prerequisites: ['variables', 'functions'],
    unlocked: false,
    completed: false,
    position: { x: 30, y: 60 },
  },
  {
    id: 'recursion',
    name: 'Recursion & Advanced',
    description: 'Master recursive algorithms',
    icon: <Zap size={24} />,
    level: 3,
    xpRequired: 300,
    prerequisites: ['loops', 'functions'],
    unlocked: false,
    completed: false,
    position: { x: 70, y: 60 },
  },
  {
    id: 'algorithms',
    name: 'Data Structures & Algorithms',
    description: 'Learn efficient data organization',
    icon: <Brain size={24} />,
    level: 4,
    xpRequired: 500,
    prerequisites: ['oop', 'recursion'],
    unlocked: false,
    completed: false,
    position: { x: 50, y: 85 },
  },
];

export const SkillTree: React.FC = () => {
  const [profile, setProfile] = useState<UserGameProfile | null>(null);
  const [skills, setSkills] = useState<SkillNode[]>(SKILL_TREE);
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId') || 'default_user';
    const userProfile = gamificationService.getGameProfile(userId);
    setProfile(userProfile);

    // Update skill unlock status based on profile level
    const updatedSkills = SKILL_TREE.map((skill) => {
      const isUnlocked =
        skill.level <= userProfile.level ||
        skill.xpRequired <= userProfile.totalXP ||
        skill.prerequisites.length === 0;
      const isCompleted = userProfile.completedQuests.some((q) => q.includes(skill.id));

      return {
        ...skill,
        unlocked: isUnlocked,
        completed: isCompleted,
      };
    });

    setSkills(updatedSkills);
  }, []);

  const getConnectionOpacity = (fromSkill: SkillNode, toSkill: SkillNode) => {
    if (fromSkill.completed && toSkill.unlocked) return 1;
    if (!fromSkill.completed) return 0.3;
    return 0.5;
  };

  const progressPercentage = profile ? (profile.level / 20) * 100 : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Skill Tree 🌳</h1>
        <p className="text-subtext mt-2">Progress through skills and unlock new levels of mastery</p>
      </div>

      {/* Progress Overview */}
      {profile && (
        <GlassCard className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-subtext">Level Progress</p>
              <p className="text-2xl font-bold text-primary mt-2">{profile.level}/20</p>
              <div className="w-full h-2 rounded-full bg-white/10 mt-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  className="h-full bg-gradient-to-r from-primary to-yellow-400"
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
            <div>
              <p className="text-sm text-subtext">Skills Unlocked</p>
              <p className="text-2xl font-bold text-cyan-400 mt-2">
                {skills.filter((s) => s.unlocked).length}/{skills.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-subtext">Completed</p>
              <p className="text-2xl font-bold text-green-400 mt-2">
                {skills.filter((s) => s.completed).length}
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Skill Tree Visualization */}
      <GlassCard className="p-6 bg-gradient-to-br from-white/5 to-transparent min-h-screen">
        <div className="relative w-full h-full" style={{ minHeight: '600px' }}>
          {/* SVG for connections */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ background: 'transparent' }}
          >
            {skills.map((skill) =>
              skill.prerequisites.map((prereqId) => {
                const prereq = skills.find((s) => s.id === prereqId);
                if (!prereq) return null;

                return (
                  <line
                    key={`${prereqId}-${skill.id}`}
                    x1={`${prereq.position.x}%`}
                    y1={`${prereq.position.y}%`}
                    x2={`${skill.position.x}%`}
                    y2={`${skill.position.y}%`}
                    stroke="#C2963E"
                    strokeWidth="2"
                    opacity={getConnectionOpacity(prereq, skill)}
                    className="transition-opacity duration-500"
                  />
                );
              })
            )}
          </svg>

          {/* Skill Nodes */}
          <div className="relative w-full h-full">
            {skills.map((skill) => (
              <motion.div
                key={skill.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  left: `${skill.position.x}%`,
                  top: `${skill.position.y}%`,
                }}
                whileHover={{ scale: 1.1 }}
                onHoverStart={() => setHoveredSkill(skill.id)}
                onHoverEnd={() => setHoveredSkill(null)}
                onClick={() => setSelectedSkill(skill)}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: Math.random() * 0.5 }}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold transition-all border-2 ${
                    skill.completed
                      ? 'bg-gradient-to-br from-green-500 to-green-600 border-green-400 shadow-lg shadow-green-500/50'
                      : skill.unlocked
                      ? 'bg-gradient-to-br from-primary to-yellow-500 border-primary shadow-lg shadow-primary/50'
                      : 'bg-gradient-to-br from-gray-600 to-gray-700 border-gray-500 opacity-60'
                  }`}
                >
                  {skill.completed ? (
                    <CheckCircle size={24} />
                  ) : skill.unlocked ? (
                    <Unlock size={24} />
                  ) : (
                    <Lock size={24} />
                  )}
                </motion.div>

                {/* Tooltip */}
                <AnimatePresence>
                  {hoveredSkill === skill.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-surface border border-white/20 rounded-lg p-3 whitespace-nowrap text-sm z-10 pointer-events-none"
                    >
                      <p className="font-bold text-white">{skill.name}</p>
                      <p className="text-xs text-subtext">Level {skill.level}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 border-2 border-green-400 flex items-center justify-center">
              <CheckCircle size={16} className="text-white" />
            </div>
            <span className="text-sm text-white">Completed Skills</span>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-yellow-500 border-2 border-primary flex items-center justify-center">
              <Unlock size={16} className="text-white" />
            </div>
            <span className="text-sm text-white">Unlocked Skills</span>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 border-2 border-gray-500 flex items-center justify-center opacity-60">
              <Lock size={16} className="text-white" />
            </div>
            <span className="text-sm text-white">Locked Skills</span>
          </div>
        </GlassCard>
      </div>

      {/* Skill Detail Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedSkill(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-16 h-16 rounded-full ${selectedSkill.completed ? 'bg-green-500/20' : 'bg-primary/20'} flex items-center justify-center text-3xl`}>
                  {selectedSkill.completed ? '✓' : selectedSkill.unlocked ? '🔓' : '🔒'}
                </div>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="text-subtext hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">{selectedSkill.name}</h2>
              <p className="text-subtext mb-4">{selectedSkill.description}</p>

              <div className="bg-white/5 rounded-lg p-4 mb-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-subtext">Level Required</span>
                  <span className="text-white font-bold">{selectedSkill.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-subtext">XP Required</span>
                  <span className="text-white font-bold">{selectedSkill.xpRequired}</span>
                </div>
                {selectedSkill.prerequisites.length > 0 && (
                  <div>
                    <span className="text-subtext block mb-2">Prerequisites</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkill.prerequisites.map((prereqId) => {
                        const prereq = skills.find((s) => s.id === prereqId);
                        return (
                          <span
                            key={prereqId}
                            className={`text-xs px-2 py-1 rounded ${
                              prereq?.completed
                                ? 'bg-green-500/20 text-green-300'
                                : 'bg-yellow-500/20 text-yellow-300'
                            }`}
                          >
                            {prereq?.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {selectedSkill.completed && (
                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-center">
                    <p className="text-sm font-semibold text-green-300">✓ Skill Completed!</p>
                  </div>
                )}
                {!selectedSkill.unlocked && (
                  <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 text-center">
                    <p className="text-sm font-semibold text-yellow-300">🔒 Locked - Keep progressing!</p>
                  </div>
                )}
                {selectedSkill.unlocked && !selectedSkill.completed && (
                  <Button className="w-full">Start Learning</Button>
                )}
              </div>

              <button
                onClick={() => setSelectedSkill(null)}
                className="w-full mt-4 py-2 text-subtext hover:text-white transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillTree;
