import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MessageCircleQuestion, Send, CheckCircle } from 'lucide-react';

const QASubmit = () => {
  const [name, setName] = useState('');
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !question.trim()) {
      toast({
        title: "Missing fields",
        description: "Please enter your name and question.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('qa_questions')
        .insert({ author_name: name.trim(), question: question.trim() });

      if (error) throw error;

      setSubmitted(true);
      setQuestion('');

      // Reset after 4 seconds so they can ask another
      setTimeout(() => setSubmitted(false), 4000);
    } catch (error) {
      console.error('Error submitting question:', error);
      toast({
        title: "Error",
        description: "Failed to submit your question. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2332] via-[#24324b] to-[#2d3e5a] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-church-gold/20 rounded-full mb-4">
            <MessageCircleQuestion className="h-8 w-8 text-church-gold" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Ask a Question
          </h1>
          <p className="text-white/70 text-lg">
            Perspectives on the Apostolic — Q&A
          </p>
        </div>

        {submitted ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-green-400/30 text-center">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Question Submitted!</h2>
            <p className="text-white/70">Your question will appear on screen shortly.</p>
            <Button
              onClick={() => setSubmitted(false)}
              variant="outline"
              className="mt-6 border-white/30 text-white hover:bg-white/10"
            >
              Ask Another Question
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20 space-y-6">
            <div>
              <label className="block text-white/90 font-medium mb-2 text-lg">
                Your Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 text-lg h-12"
                required
              />
            </div>

            <div>
              <label className="block text-white/90 font-medium mb-2 text-lg">
                Your Question
              </label>
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question here..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 text-lg min-h-[120px] resize-none"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !name.trim() || !question.trim()}
              className="w-full bg-gradient-to-r from-church-gold to-[#d4c278] hover:from-[#d4c278] hover:to-church-gold text-white font-bold text-lg h-14 rounded-xl shadow-lg"
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Submit Question
                </>
              )}
            </Button>
          </form>
        )}

        <p className="text-center text-white/40 text-sm mt-6">
          Gate Gaborone • Perspectives on the Apostolic 2026
        </p>
      </div>
    </div>
  );
};

export default QASubmit;
