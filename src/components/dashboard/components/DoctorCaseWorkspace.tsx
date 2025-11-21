import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowLeft, Clock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

interface DoctorCaseWorkspaceProps {
  caseData: {
    id: string;
    symptoms: string;
    ai_prediction: string;
    confidence_score: number;
    created_at: string;
    claimed_at?: string;
    claim_expires_at?: string;
    assigned_intern_id?: string;
  };
  onBack: () => void;
  onFinalizeSuccess: () => void;
}

interface InternReview {
  notes: string;
  corrections: string;
  intern_name: string;
  verified_at: string;
}

const DoctorCaseWorkspace: React.FC<DoctorCaseWorkspaceProps> = ({
  caseData,
  onBack,
  onFinalizeSuccess
}) => {
  const [internReview, setInternReview] = useState<InternReview | null>(null);
  const [verifiedSummary, setVerifiedSummary] = useState('');
  const [feedback, setFeedback] = useState('');
  const [prescription, setPrescription] = useState('');
  const [finalizing, setFinalizing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    // Load intern review
    const loadInternReview = async () => {
      const { data, error } = await supabase
        .from('intern_reviews')
        .select(`
          notes,
          corrections,
          verified_at,
          intern:profiles!intern_reviews_intern_id_fkey(full_name)
        `)
        .eq('report_id', caseData.id)
        .maybeSingle();

      if (data) {
        setInternReview({
          notes: data.notes || '',
          corrections: data.corrections || '',
          intern_name: (data.intern as any)?.full_name || 'Unknown',
          verified_at: data.verified_at || ''
        });
      }
    };

    loadInternReview();

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

  const handleFinalize = async () => {
    if (!verifiedSummary.trim()) {
      toast.error('Please provide a final diagnosis before submitting');
      return;
    }

    setFinalizing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('finalize-doctor-review', {
        body: {
          caseId: caseData.id,
          verifiedSummary,
          feedback,
          prescription
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (response.error) throw response.error;
      if (!response.data.success) throw new Error(response.data.error);

      toast.success('Case finalized successfully');
      onFinalizeSuccess();
    } catch (error: any) {
      console.error('Error finalizing case:', error);
      toast.error(error.message || 'Failed to finalize case');
    } finally {
      setFinalizing(false);
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

      <div className="grid gap-4 lg:grid-cols-3">
        {/* AI Report & Intern Review */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Case Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {/* AI Analysis */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">AI Analysis</h4>
                    <Badge variant="secondary">
                      {(caseData.confidence_score * 100).toFixed(0)}% Confidence
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Symptoms</label>
                      <p className="text-sm bg-muted p-3 rounded whitespace-pre-wrap mt-1">
                        {caseData.symptoms}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">AI Prediction</label>
                      <p className="text-sm bg-muted p-3 rounded whitespace-pre-wrap mt-1">
                        {caseData.ai_prediction}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Intern Review */}
                {internReview && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4" />
                      <h4 className="font-semibold">Intern Review</h4>
                      <Badge variant="outline">{internReview.intern_name}</Badge>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Clinical Notes</label>
                        <p className="text-sm bg-muted p-3 rounded whitespace-pre-wrap mt-1">
                          {internReview.notes}
                        </p>
                      </div>
                      {internReview.corrections && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Corrections to AI</label>
                          <p className="text-sm bg-muted p-3 rounded whitespace-pre-wrap mt-1">
                            {internReview.corrections}
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Reviewed: {new Date(internReview.verified_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Case Created: {new Date(caseData.created_at).toLocaleString()}</p>
                  <p>Claimed by you: {new Date(caseData.claimed_at).toLocaleString()}</p>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Doctor's Final Review */}
        <Card>
          <CardHeader>
            <CardTitle>Final Diagnosis</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Final Diagnosis & Recommendation *
                  </label>
                  <Textarea
                    placeholder="Provide your final diagnosis, treatment plan, and recommendations..."
                    value={verifiedSummary}
                    onChange={(e) => setVerifiedSummary(e.target.value)}
                    rows={8}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This will be shared with the patient
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Prescription (Optional)
                  </label>
                  <Textarea
                    placeholder="List medications, dosages, and instructions..."
                    value={prescription}
                    onChange={(e) => setPrescription(e.target.value)}
                    rows={5}
                    className="resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Feedback for Intern (Optional)
                  </label>
                  <Textarea
                    placeholder="Provide feedback on the intern's review..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This helps interns improve their clinical skills
                  </p>
                </div>

                <Button
                  onClick={handleFinalize}
                  disabled={finalizing || !verifiedSummary.trim()}
                  className="w-full"
                  size="lg"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Finalize & Publish Report
                </Button>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorCaseWorkspace;