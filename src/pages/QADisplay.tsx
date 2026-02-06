import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MessageCircleQuestion, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QAQuestion {
  id: string;
  author_name: string;
  question: string;
  is_highlighted: boolean;
  is_dismissed: boolean;
  created_at: string;
}

const QADisplay = () => {
  const [questions, setQuestions] = useState<QAQuestion[]>([]);

  useEffect(() => {
    // Fetch initial questions
    fetchQuestions();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('qa-display')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'qa_questions' },
        () => {
          fetchQuestions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from('qa_questions')
      .select('*')
      .eq('is_dismissed', false)
      .order('is_highlighted', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      setQuestions(data);
    }
  };

  const highlightedQuestions = questions.filter(q => q.is_highlighted);
  const regularQuestions = questions.filter(q => !q.is_highlighted);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#111827] to-[#1a2332] text-white overflow-hidden">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-church-gold/20 to-transparent border-b border-church-gold/10 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircleQuestion className="h-8 w-8 text-church-gold" />
            <div>
              <h1 className="text-2xl font-bold text-white">Live Q&A</h1>
              <p className="text-white/50 text-sm">Perspectives on the Apostolic</p>
            </div>
          </div>
          <div className="bg-white/10 rounded-full px-4 py-2 text-sm text-white/70">
            {questions.length} question{questions.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Highlighted question - large display */}
      <AnimatePresence>
        {highlightedQuestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-8 py-6"
          >
            {highlightedQuestions.map((q) => (
              <motion.div
                key={q.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gradient-to-r from-church-gold/20 to-church-gold/5 border-2 border-church-gold/40 rounded-2xl p-8 mb-4"
              >
                <div className="flex items-start gap-4">
                  <Star className="h-8 w-8 text-church-gold flex-shrink-0 mt-1 fill-church-gold" />
                  <div>
                    <p className="text-3xl font-medium leading-relaxed text-white mb-4">
                      "{q.question}"
                    </p>
                    <p className="text-xl text-church-gold font-semibold">
                      — {q.author_name}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Questions grid */}
      <div className="px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {regularQuestions.map((q, index) => (
              <motion.div
                key={q.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors"
              >
                <p className="text-lg text-white/90 leading-relaxed mb-3">
                  "{q.question}"
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-church-gold/80">
                    — {q.author_name}
                  </p>
                  <p className="text-xs text-white/30">
                    {new Date(q.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {questions.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <MessageCircleQuestion className="h-24 w-24 text-white/10 mb-6" />
            <h2 className="text-3xl font-bold text-white/30 mb-2">Waiting for Questions</h2>
            <p className="text-white/20 text-lg">Questions will appear here in real-time</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QADisplay;
