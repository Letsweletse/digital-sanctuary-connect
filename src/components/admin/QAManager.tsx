import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MessageCircleQuestion, Star, Trash2, Eye, EyeOff, RefreshCw, ExternalLink, Copy } from 'lucide-react';

interface QAQuestion {
  id: string;
  author_name: string;
  question: string;
  is_highlighted: boolean;
  is_dismissed: boolean;
  created_at: string;
}

const QAManager = () => {
  const [questions, setQuestions] = useState<QAQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuestions();

    // Real-time subscription
    const channel = supabase
      .channel('qa-admin')
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
    try {
      const { data, error } = await supabase
        .from('qa_questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleHighlight = async (id: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('qa_questions')
        .update({ is_highlighted: !currentState })
        .eq('id', id);

      if (error) throw error;
      toast({
        title: !currentState ? "Question Highlighted" : "Highlight Removed",
        description: !currentState ? "This question is now featured on the display." : "Question returned to regular view.",
      });
    } catch (error) {
      console.error('Error toggling highlight:', error);
      toast({ title: "Error", description: "Failed to update question.", variant: "destructive" });
    }
  };

  const toggleDismiss = async (id: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('qa_questions')
        .update({ is_dismissed: !currentState })
        .eq('id', id);

      if (error) throw error;
      toast({
        title: !currentState ? "Question Dismissed" : "Question Restored",
        description: !currentState ? "Question hidden from display." : "Question visible again.",
      });
    } catch (error) {
      console.error('Error toggling dismiss:', error);
      toast({ title: "Error", description: "Failed to update question.", variant: "destructive" });
    }
  };

  const deleteQuestion = async (id: string) => {
    if (!window.confirm("Delete this question permanently?")) return;
    try {
      const { error } = await supabase
        .from('qa_questions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Deleted", description: "Question removed permanently." });
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({ title: "Error", description: "Failed to delete question.", variant: "destructive" });
    }
  };

  const clearAllQuestions = async () => {
    if (!window.confirm("Are you sure you want to delete ALL questions? This cannot be undone.")) return;
    try {
      const { error } = await supabase
        .from('qa_questions')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // delete all

      if (error) throw error;
      toast({ title: "Cleared", description: "All questions have been removed." });
    } catch (error) {
      console.error('Error clearing questions:', error);
      toast({ title: "Error", description: "Failed to clear questions.", variant: "destructive" });
    }
  };

  const copyLink = (path: string) => {
    const url = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Copied!", description: `Link copied: ${url}` });
  };

  const activeQuestions = questions.filter(q => !q.is_dismissed);
  const dismissedQuestions = questions.filter(q => q.is_dismissed);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="animate-spin h-8 w-8 mr-2" />
        <span>Loading questions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeQuestions.length}</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => copyLink('/qa')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              Attendee Submit Link <Copy className="h-3 w-3" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">/qa</code>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.open('/qa-display', '_blank')}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              Screen Display <ExternalLink className="h-3 w-3" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">/qa-display</code>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageCircleQuestion className="h-6 w-6" />
          Live Q&A
        </h2>
        <div className="flex gap-2">
          <Button onClick={() => window.open('/qa-display', '_blank')} variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-1" />
            Open Display
          </Button>
          <Button onClick={fetchQuestions} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          {questions.length > 0 && (
            <Button onClick={clearAllQuestions} variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Active Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Questions ({activeQuestions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {activeQuestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No questions yet. Share the <strong>/qa</strong> link with attendees to start receiving questions.
            </div>
          ) : (
            <div className="space-y-3">
              {activeQuestions.map((q) => (
                <div
                  key={q.id}
                  className={`border rounded-lg p-4 transition-colors ${
                    q.is_highlighted ? 'border-yellow-400 bg-yellow-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="text-base font-medium mb-1">"{q.question}"</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium">— {q.author_name}</span>
                        <span>•</span>
                        <span>{new Date(q.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {q.is_highlighted && (
                          <Badge className="bg-yellow-400 text-yellow-900 text-xs">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant={q.is_highlighted ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleHighlight(q.id, q.is_highlighted)}
                        title={q.is_highlighted ? "Remove highlight" : "Highlight on screen"}
                      >
                        <Star className={`h-4 w-4 ${q.is_highlighted ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleDismiss(q.id, q.is_dismissed)}
                        title="Hide from display"
                      >
                        <EyeOff className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => deleteQuestion(q.id)}
                        title="Delete permanently"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dismissed Questions */}
      {dismissedQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-muted-foreground">Dismissed ({dismissedQuestions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dismissedQuestions.map((q) => (
                <div key={q.id} className="border rounded-lg p-3 opacity-60">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="text-sm">"{q.question}" — {q.author_name}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleDismiss(q.id, q.is_dismissed)}
                        title="Restore to display"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => deleteQuestion(q.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QAManager;
