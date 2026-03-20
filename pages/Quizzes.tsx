import React, { useEffect, useMemo, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Brain, Clock3, BookOpenCheck, Trophy, Plus, PlayCircle, CheckCircle2 } from 'lucide-react';

type Subject = 'JavaScript' | 'TypeScript' | 'Python' | 'Data Structures' | 'System Design';
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
}

interface Quiz {
  id: string;
  title: string;
  subject: Subject;
  topic: string;
  difficulty: Difficulty;
  timeLimitMinutes: number;
  questions: QuizQuestion[];
  createdByUser: boolean;
}

interface QuizResult {
  score: number;
  total: number;
  percentage: number;
}

const QUESTION_BANK: Array<Omit<QuizQuestion, 'id'> & { subject: Subject; topic: string; difficulty: Difficulty }> = [
  {
    subject: 'JavaScript',
    topic: 'Closures',
    difficulty: 'Intermediate',
    prompt: 'What is a closure in JavaScript?',
    options: [
      'A function bundled with lexical environment',
      'A method to close browser tabs',
      'A way to terminate recursion',
      'A syntax for private classes only',
    ],
    answerIndex: 0,
  },
  {
    subject: 'JavaScript',
    topic: 'Promises',
    difficulty: 'Beginner',
    prompt: 'Which method waits for multiple promises to complete?',
    options: ['Promise.any', 'Promise.finally', 'Promise.all', 'Promise.raceSettled'],
    answerIndex: 2,
  },
  {
    subject: 'TypeScript',
    topic: 'Types',
    difficulty: 'Beginner',
    prompt: 'Which TypeScript feature allows union values?',
    options: ['enum', 'tuple', 'union type', 'namespace'],
    answerIndex: 2,
  },
  {
    subject: 'TypeScript',
    topic: 'Generics',
    difficulty: 'Intermediate',
    prompt: 'What is the primary benefit of generics?',
    options: ['Faster runtime', 'Type-safe reusable code', 'Smaller bundles always', 'Automatic API docs'],
    answerIndex: 1,
  },
  {
    subject: 'Python',
    topic: 'Lists',
    difficulty: 'Beginner',
    prompt: 'Which syntax creates a list comprehension?',
    options: ['[x for x in items]', '{x => x in items}', '(x for x in items)', '<x for x in items>'],
    answerIndex: 0,
  },
  {
    subject: 'Python',
    topic: 'Decorators',
    difficulty: 'Advanced',
    prompt: 'A Python decorator primarily does what?',
    options: [
      'Adds comments to a function',
      'Wraps and modifies function behavior',
      'Compiles Python to C',
      'Creates async event loops',
    ],
    answerIndex: 1,
  },
  {
    subject: 'Data Structures',
    topic: 'Trees',
    difficulty: 'Intermediate',
    prompt: 'In a BST, where are smaller values stored relative to a node?',
    options: ['Right subtree', 'Left subtree', 'Root only', 'In parent nodes'],
    answerIndex: 1,
  },
  {
    subject: 'Data Structures',
    topic: 'Hash Tables',
    difficulty: 'Beginner',
    prompt: 'Average lookup time in a well-distributed hash table is:',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    answerIndex: 0,
  },
  {
    subject: 'System Design',
    topic: 'Caching',
    difficulty: 'Intermediate',
    prompt: 'Which strategy evicts the least recently accessed item?',
    options: ['FIFO', 'LRU', 'Round Robin', 'Greedy'],
    answerIndex: 1,
  },
  {
    subject: 'System Design',
    topic: 'Scalability',
    difficulty: 'Advanced',
    prompt: 'Horizontal scaling means:',
    options: [
      'Using more powerful CPU/RAM on one machine',
      'Adding more machines to handle load',
      'Compressing database tables',
      'Reducing API endpoints',
    ],
    answerIndex: 1,
  },
];

const PREMADE_QUIZZES: Quiz[] = [
  {
    id: 'pm_js_1',
    title: 'JavaScript Fundamentals Sprint',
    subject: 'JavaScript',
    topic: 'Closures & Promises',
    difficulty: 'Intermediate',
    timeLimitMinutes: 12,
    createdByUser: false,
    questions: QUESTION_BANK.filter((q) => q.subject === 'JavaScript').map((q, index) => ({
      id: `pm_js_q_${index}`,
      prompt: q.prompt,
      options: q.options,
      answerIndex: q.answerIndex,
    })),
  },
  {
    id: 'pm_ds_1',
    title: 'Data Structures Core Check',
    subject: 'Data Structures',
    topic: 'Trees & Hashing',
    difficulty: 'Beginner',
    timeLimitMinutes: 10,
    createdByUser: false,
    questions: QUESTION_BANK.filter((q) => q.subject === 'Data Structures').map((q, index) => ({
      id: `pm_ds_q_${index}`,
      prompt: q.prompt,
      options: q.options,
      answerIndex: q.answerIndex,
    })),
  },
  {
    id: 'pm_sd_1',
    title: 'System Design Practical Round',
    subject: 'System Design',
    topic: 'Caching & Scale',
    difficulty: 'Advanced',
    timeLimitMinutes: 15,
    createdByUser: false,
    questions: QUESTION_BANK.filter((q) => q.subject === 'System Design').map((q, index) => ({
      id: `pm_sd_q_${index}`,
      prompt: q.prompt,
      options: q.options,
      answerIndex: q.answerIndex,
    })),
  },
];

const createFallbackQuestion = (subject: Subject, topic: string): QuizQuestion => ({
  id: `q_fallback_${Date.now()}`,
  prompt: `What best describes the core idea of ${topic} in ${subject}?`,
  options: [
    `A concept to improve ${subject} problem solving`,
    `A styling-only browser feature`,
    `A hardware-only optimization`,
    `A deprecated syntax pattern`,
  ],
  answerIndex: 0,
});

export const Quizzes: React.FC = () => {
  const [customQuizzes, setCustomQuizzes] = useState<Quiz[]>(() => {
    try {
      const raw = localStorage.getItem('eduq_custom_quizzes');
      return raw ? (JSON.parse(raw) as Quiz[]) : [];
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState({
    title: '',
    subject: 'JavaScript' as Subject,
    topic: 'Closures',
    difficulty: 'Intermediate' as Difficulty,
    timeLimitMinutes: 10,
    questionCount: 4,
  });

  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);

  const allQuizzes = useMemo(() => [...PREMADE_QUIZZES, ...customQuizzes], [customQuizzes]);

  useEffect(() => {
    localStorage.setItem('eduq_custom_quizzes', JSON.stringify(customQuizzes));
  }, [customQuizzes]);

  useEffect(() => {
    if (!activeQuiz || result) return;
    if (remainingSeconds <= 0) {
      finalizeAttempt();
      return;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((prev) => prev - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [activeQuiz, remainingSeconds, result]);

  const createQuiz = () => {
    if (!form.title.trim() || !form.topic.trim()) {
      alert('Please enter a quiz title and topic.');
      return;
    }

    const candidates = QUESTION_BANK.filter(
      (q) => q.subject === form.subject && q.difficulty === form.difficulty
    );

    const pool = candidates.length > 0 ? candidates : QUESTION_BANK.filter((q) => q.subject === form.subject);

    const selected = pool.slice(0, form.questionCount).map((q, index) => ({
      id: `custom_q_${Date.now()}_${index}`,
      prompt: q.prompt,
      options: q.options,
      answerIndex: q.answerIndex,
    }));

    const questions = selected.length > 0 ? selected : [createFallbackQuestion(form.subject, form.topic)];

    const newQuiz: Quiz = {
      id: `custom_${Date.now()}`,
      title: form.title,
      subject: form.subject,
      topic: form.topic,
      difficulty: form.difficulty,
      timeLimitMinutes: form.timeLimitMinutes,
      questions,
      createdByUser: true,
    };

    setCustomQuizzes((prev) => [newQuiz, ...prev]);
    setForm((prev) => ({ ...prev, title: '' }));
  };

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentIndex(0);
    setAnswers({});
    setResult(null);
    setRemainingSeconds(quiz.timeLimitMinutes * 60);
  };

  const selectAnswer = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const finalizeAttempt = () => {
    if (!activeQuiz) return;
    const correct = activeQuiz.questions.reduce((sum, q) => {
      return sum + (answers[q.id] === q.answerIndex ? 1 : 0);
    }, 0);
    const total = activeQuiz.questions.length;
    const percentage = Math.round((correct / total) * 100);
    setResult({ score: correct, total, percentage });
  };

  const leaveAttempt = () => {
    setActiveQuiz(null);
    setResult(null);
    setAnswers({});
    setCurrentIndex(0);
    setRemainingSeconds(0);
  };

  const currentQuestion = activeQuiz ? activeQuiz.questions[currentIndex] : null;
  const minutes = Math.max(0, Math.floor(remainingSeconds / 60));
  const seconds = Math.max(0, remainingSeconds % 60);

  if (activeQuiz && currentQuestion) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{activeQuiz.title}</h1>
            <p className="text-subtext mt-2">{activeQuiz.subject} • {activeQuiz.topic} • {activeQuiz.difficulty}</p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-surface text-white font-mono">
            <Clock3 size={16} className="text-primary" />
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
        </div>

        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-subtext">Question {currentIndex + 1} of {activeQuiz.questions.length}</p>
            <div className="w-32 h-2 rounded bg-white/10 overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${((currentIndex + 1) / activeQuiz.questions.length) * 100}%` }}
              />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-white mb-5">{currentQuestion.prompt}</h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const selected = answers[currentQuestion.id] === idx;
              return (
                <button
                  key={`${currentQuestion.id}_${idx}`}
                  onClick={() => selectAnswer(currentQuestion.id, idx)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    selected
                      ? 'border-primary bg-primary/10 text-white'
                      : 'border-white/10 bg-white/5 text-subtext hover:text-white hover:border-white/30'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={leaveAttempt}>Exit Quiz</Button>
            {currentIndex > 0 && (
              <Button variant="glass" onClick={() => setCurrentIndex((prev) => prev - 1)}>Previous</Button>
            )}
            {currentIndex < activeQuiz.questions.length - 1 ? (
              <Button variant="primary" onClick={() => setCurrentIndex((prev) => prev + 1)}>Next</Button>
            ) : (
              <Button variant="primary" onClick={finalizeAttempt}>Submit Quiz</Button>
            )}
          </div>
        </GlassCard>

        {result && (
          <GlassCard glowColor="primary" className="animate-fade-in">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <Trophy size={18} />
              <p className="text-sm uppercase tracking-wide">Result</p>
            </div>
            <h3 className="text-2xl font-bold text-white">{result.score}/{result.total} correct ({result.percentage}%)</h3>
            <p className="text-subtext mt-2">
              {result.percentage >= 80
                ? 'Excellent work. Your fundamentals look strong.'
                : result.percentage >= 60
                ? 'Nice progress. Review missed concepts and try again.'
                : 'Good attempt. Focus on core concepts and re-attempt this quiz.'}
            </p>
          </GlassCard>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Programming Quizzes</h1>
          <p className="text-subtext mt-2">Create your own quiz or attempt pre-made rounds across programming subjects.</p>
        </div>
        <div className="text-xs text-subtext border border-white/10 rounded-xl px-3 py-2 bg-surface">
          Total available quizzes: <span className="text-white font-semibold">{allQuizzes.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <GlassCard className="xl:col-span-1">
          <div className="flex items-center gap-2 mb-5 text-primary">
            <Plus size={16} />
            <h2 className="text-lg font-semibold text-white">Create Your Quiz</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-subtext uppercase">Quiz Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. TypeScript Interview Drill"
                className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50"
              />
            </div>

            <div>
              <label className="text-xs text-subtext uppercase">Subject</label>
              <select
                value={form.subject}
                onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value as Subject }))}
                className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50"
              >
                <option>JavaScript</option>
                <option>TypeScript</option>
                <option>Python</option>
                <option>Data Structures</option>
                <option>System Design</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-subtext uppercase">Topic</label>
              <input
                value={form.topic}
                onChange={(e) => setForm((prev) => ({ ...prev, topic: e.target.value }))}
                placeholder="e.g. Generics"
                className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-subtext uppercase">Difficulty</label>
                <select
                  value={form.difficulty}
                  onChange={(e) => setForm((prev) => ({ ...prev, difficulty: e.target.value as Difficulty }))}
                  className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-subtext uppercase">Time (min)</label>
                <input
                  type="number"
                  min={5}
                  max={60}
                  value={form.timeLimitMinutes}
                  onChange={(e) => setForm((prev) => ({ ...prev, timeLimitMinutes: Number(e.target.value) || 10 }))}
                  className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-subtext uppercase">Questions</label>
              <input
                type="number"
                min={1}
                max={10}
                value={form.questionCount}
                onChange={(e) => setForm((prev) => ({ ...prev, questionCount: Number(e.target.value) || 4 }))}
                className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50"
              />
            </div>

            <Button className="w-full" onClick={createQuiz}>Create Quiz</Button>
          </div>
        </GlassCard>

        <div className="xl:col-span-2 space-y-6">
          <GlassCard>
            <div className="flex items-center gap-2 mb-5 text-secondary">
              <Brain size={16} />
              <h2 className="text-lg font-semibold text-white">Pre-made Quizzes</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PREMADE_QUIZZES.map((quiz) => (
                <div key={quiz.id} className="p-4 rounded-xl border border-white/10 bg-white/5">
                  <h3 className="font-semibold text-white mb-2">{quiz.title}</h3>
                  <p className="text-xs text-subtext mb-1">{quiz.subject} • {quiz.topic}</p>
                  <p className="text-xs text-subtext mb-3">{quiz.difficulty} • {quiz.questions.length} questions • {quiz.timeLimitMinutes} min</p>
                  <Button size="sm" onClick={() => startQuiz(quiz)} className="flex items-center gap-2">
                    <PlayCircle size={14} /> Attempt Quiz
                  </Button>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-2 mb-5 text-primary">
              <BookOpenCheck size={16} />
              <h2 className="text-lg font-semibold text-white">Your Created Quizzes</h2>
            </div>

            {customQuizzes.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-white/10 rounded-xl text-subtext text-sm">
                No custom quiz yet. Create one from the left panel.
              </div>
            ) : (
              <div className="space-y-3">
                {customQuizzes.map((quiz) => (
                  <div key={quiz.id} className="p-4 rounded-xl border border-white/10 bg-white/5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-white">{quiz.title}</h3>
                      <p className="text-xs text-subtext mt-1">{quiz.subject} • {quiz.topic} • {quiz.difficulty}</p>
                      <p className="text-xs text-subtext mt-1">{quiz.questions.length} questions • {quiz.timeLimitMinutes} min</p>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => startQuiz(quiz)} className="flex items-center gap-2">
                      <PlayCircle size={14} /> Start
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard>
          <div className="flex items-center gap-2 text-primary mb-3">
            <Trophy size={16} />
            <p className="text-xs uppercase">Quiz Strength</p>
          </div>
          <h3 className="text-2xl font-bold text-white">78%</h3>
          <p className="text-xs text-subtext mt-2">Average score across attempted quizzes</p>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2 text-secondary mb-3">
            <Clock3 size={16} />
            <p className="text-xs uppercase">Time Discipline</p>
          </div>
          <h3 className="text-2xl font-bold text-white">84%</h3>
          <p className="text-xs text-subtext mt-2">Submissions before timer expires</p>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2 text-green-400 mb-3">
            <CheckCircle2 size={16} />
            <p className="text-xs uppercase">Consistency</p>
          </div>
          <h3 className="text-2xl font-bold text-white">5 this week</h3>
          <p className="text-xs text-subtext mt-2">Quiz attempts completed this week</p>
        </GlassCard>
      </div>
    </div>
  );
};
