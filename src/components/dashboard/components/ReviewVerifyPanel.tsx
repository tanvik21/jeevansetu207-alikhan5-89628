import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle, MessageCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AIReport {
  id: string;
  symptoms: string;
  ai_prediction: string;
  confidence_score: number;
  status: string;
  created_at: string;
}

interface InternReview {
  notes: string;
  corrections: string;
}

const ReviewVerifyPanel = () => {
  const [reports, setReports] = useState<AIReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<AIReport | null>(null);
  const [internReview, setInternReview] = useState<InternReview | null>(null);
  const [feedback, setFeedback] = useState('');
  const [verifiedSummary, setVerifiedSummary] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReportsForReview();
  }, []);

  const fetchReportsForReview = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_reports')
        .select('*')
        .eq('status', 'intern_verified')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setReports(data || []);
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load review queue');
    } finally {
      setLoading(false);
    }
  };

  const fetchInternReview = async (reportId: string) => {
    try {
      const { data, error } = await supabase
        .from('intern_reviews')
        .select('notes, corrections')
        .eq('report_id', reportId)
        .single();

      if (error) throw error;
      setInternReview(data);
    } catch (error) {
      console.error('Error fetching intern review:', error);
      setInternReview(null);
    }
  };

  const handleAction = async (action: 'approve' | 'feedback' | 'escalate') => {
    if (!selectedReport) return;
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create doctor verification
      const { error: verificationError } = await supabase
        .from('doctor_verifications')
        .insert({
          report_id: selectedReport.id,
          doctor_id: user.id,
          action,
          feedback,
          verified_summary: verifiedSummary
        });

      if (verificationError) throw verificationError;

      // Update report status based on action
      const newStatus = action === 'approve' ? 'doctor_verified' : 'intern_verified';
      const { error: updateError } = await supabase
        .from('ai_reports')
        .update({ status: newStatus })
        .eq('id', selectedReport.id);

      if (updateError) throw updateError;

      const actionMessages = {
        approve: 'Report approved successfully',
        feedback: 'Feedback sent to intern',
        escalate: 'Case escalated for consultation'
      };

      toast.success(actionMessages[action]);
      setSelectedReport(null);
      setFeedback('');
      setVerifiedSummary('');
      fetchReportsForReview();
    } catch (error: any) {
      console.error('Error processing action:', error);
      toast.error('Failed to process action');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Review & Verify
          {reports.length > 0 && (
            <Badge variant="secondary">{reports.length} awaiting review</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading cases...</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No cases awaiting doctor review
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="space-y-1 flex-1">
                    <p className="font-medium">Verified by Intern - {new Date(report.created_at).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{report.ai_prediction}</p>
                    <Badge variant="secondary">Ready for Doctor Review</Badge>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          setSelectedReport(report);
                          fetchInternReview(report.id);
                        }}
                      >
                        Review & Verify
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Doctor Review & Verification</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="max-h-[600px] pr-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">AI Prediction</h4>
                            <p className="text-sm bg-muted p-3 rounded">{report.ai_prediction}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Patient Symptoms</h4>
                            <p className="text-sm bg-muted p-3 rounded">{report.symptoms}</p>
                          </div>
                          {internReview && (
                            <>
                              <div>
                                <h4 className="font-semibold mb-2">Intern Notes</h4>
                                <p className="text-sm bg-blue-50 dark:bg-blue-950 p-3 rounded">{internReview.notes}</p>
                              </div>
                              {internReview.corrections && (
                                <div>
                                  <h4 className="font-semibold mb-2">Intern Corrections</h4>
                                  <p className="text-sm bg-yellow-50 dark:bg-yellow-950 p-3 rounded">{internReview.corrections}</p>
                                </div>
                              )}
                            </>
                          )}
                          <div>
                            <h4 className="font-semibold mb-2">Verified Summary</h4>
                            <Textarea
                              placeholder="Provide a verified summary for the patient..."
                              value={verifiedSummary}
                              onChange={(e) => setVerifiedSummary(e.target.value)}
                              rows={4}
                            />
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Feedback to Intern (optional)</h4>
                            <Textarea
                              placeholder="Provide feedback or additional instructions..."
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                              rows={3}
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <Button
                              onClick={() => handleAction('approve')}
                              disabled={submitting || !verifiedSummary.trim()}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleAction('feedback')}
                              disabled={submitting}
                              variant="outline"
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Feedback
                            </Button>
                            <Button
                              onClick={() => handleAction('escalate')}
                              disabled={submitting}
                              variant="destructive"
                            >
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              Escalate
                            </Button>
                          </div>
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewVerifyPanel;
