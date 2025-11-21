import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Save, Send, ArrowLeft, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface InternCaseWorkspaceProps {
  caseData: {
    id: string;
    symptoms: string;
    ai_prediction: string;
    confidence_score: number;
    created_at: string;
    claimed_at?: string;
    claim_expires_at?: string;
  };
  onBack: () => void;
  onSubmitSuccess: () => void;
}

const InternCaseWorkspace: React.FC<InternCaseWorkspaceProps> = ({
  caseData,
  onBack,
  onSubmitSuccess
}) => {
  const [notes, setNotes] = useState('');
  const [corrections, setCorrections] = useState('');
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    // Load existing review if any
    const loadExistingReview = async () => {
      const { data, error } = await supabase
        .from('intern_reviews')
        .select('notes, corrections')
        .eq('report_id', caseData.id)
        .maybeSingle();

      if (data) {
        setNotes(data.notes || '');
        setCorrections(data.corrections || '');
      }
    };

    loadExistingReview();

    // Update time remaining
    const interval = setInterval(() => {
      if (caseData.claim_expires_at) {
        const now = new Date().getTime();
        const expires = new Date(caseData.claim_expires_at).getTime();
        const diff = expires - now;

        if (diff > 0) {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimeRemaining(`${minutes}m ${seconds}s`);
        } else {
          setTimeRemaining('Expired');
          toast.error('Your claim has expired. The case has been released.');
          onBack();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [caseData]);

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('submit-intern-review', {
        body: {
          caseId: caseData.id,
          notes,
          corrections,
          isDraft: true
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (response.error) throw response.error;
      if (!response.data.success) throw new Error(response.data.error);

      toast.success('Draft saved successfully');
    } catch (error: any) {
      console.error('Error saving draft:', error);
      toast.error(error.message || 'Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!notes.trim()) {
      toast.error('Please add your notes before submitting');
      return;
    }

    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('submit-intern-review', {
        body: {
          caseId: caseData.id,
          notes,
          corrections,
          isDraft: false
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (response.error) throw response.error;
      if (!response.data.success) throw new Error(response.data.error);

      toast.success('Review submitted to doctor successfully');
      onSubmitSuccess();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Queue
        </Button>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Time remaining: <span className="font-medium">{timeRemaining}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* AI Report Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>AI Analysis</span>
              <Badge variant="secondary">
                {(caseData.confidence_score * 100).toFixed(0)}% Confidence
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Patient Symptoms</h4>
                  <p className="text-sm bg-muted p-3 rounded whitespace-pre-wrap">
                    {caseData.symptoms}
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">AI Prediction</h4>
                  <p className="text-sm bg-muted p-3 rounded whitespace-pre-wrap">
                    {caseData.ai_prediction}
                  </p>
                </div>
                <Separator />
                <div className="text-xs text-muted-foreground">
                  <p>Created: {new Date(caseData.created_at).toLocaleString()}</p>
                  <p>Claimed: {new Date(caseData.claimed_at).toLocaleString()}</p>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Review Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Review</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Clinical Notes *
                  </label>
                  <Textarea
                    placeholder="Add your clinical observations, assessment, and recommendations..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={10}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Required before submission
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Corrections to AI Analysis (Optional)
                  </label>
                  <Textarea
                    placeholder="Note any corrections or disagreements with the AI analysis..."
                    value={corrections}
                    onChange={(e) => setCorrections(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={saving || submitting}
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={saving || submitting || !notes.trim()}
                    className="flex-1"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit to Doctor
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InternCaseWorkspace;