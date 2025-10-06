import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Send, CheckCircle } from 'lucide-react';
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
  documents: string[];
}

const VerificationQueue = () => {
  const [reports, setReports] = useState<AIReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<AIReport | null>(null);
  const [notes, setNotes] = useState('');
  const [corrections, setCorrections] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPendingReports();
  }, []);

  const fetchPendingReports = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_reports')
        .select('*')
        .in('status', ['generated', 'intern_verified'])
        .order('created_at', { ascending: true });

      if (error) throw error;
      setReports(data || []);
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load verification queue');
    } finally {
      setLoading(false);
    }
  };

  const handleForwardToDoctor = async () => {
    if (!selectedReport) return;
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create intern review
      const { error: reviewError } = await supabase
        .from('intern_reviews')
        .insert({
          report_id: selectedReport.id,
          intern_id: user.id,
          notes,
          corrections,
          forwarded_to_doctor: true
        });

      if (reviewError) throw reviewError;

      // Update report status
      const { error: updateError } = await supabase
        .from('ai_reports')
        .update({ status: 'intern_verified' })
        .eq('id', selectedReport.id);

      if (updateError) throw updateError;

      toast.success('Case forwarded to doctor successfully');
      setSelectedReport(null);
      setNotes('');
      setCorrections('');
      fetchPendingReports();
    } catch (error: any) {
      console.error('Error forwarding case:', error);
      toast.error('Failed to forward case');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Verification Queue
          {reports.length > 0 && (
            <Badge variant="secondary">{reports.length} pending</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading cases...</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No cases pending verification
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="space-y-1 flex-1">
                    <p className="font-medium">Case from {new Date(report.created_at).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{report.ai_prediction}</p>
                    <div className="flex gap-2 items-center">
                      <Badge variant={report.status === 'generated' ? 'outline' : 'secondary'}>
                        {report.status === 'generated' ? 'Needs Review' : 'Under Review'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Confidence: {(report.confidence_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="default" size="sm" onClick={() => setSelectedReport(report)}>
                        Review Case
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Review AI Case</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="max-h-[600px] pr-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Patient Symptoms</h4>
                            <p className="text-sm bg-muted p-3 rounded">{report.symptoms}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">AI Prediction</h4>
                            <p className="text-sm bg-muted p-3 rounded">{report.ai_prediction}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Confidence Score</h4>
                            <p className="text-sm">{(report.confidence_score * 100).toFixed(1)}%</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Your Notes</h4>
                            <Textarea
                              placeholder="Add your observations and notes..."
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              rows={4}
                            />
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Corrections (if any)</h4>
                            <Textarea
                              placeholder="Add any corrections to the AI prediction..."
                              value={corrections}
                              onChange={(e) => setCorrections(e.target.value)}
                              rows={4}
                            />
                          </div>
                          <Button
                            onClick={handleForwardToDoctor}
                            disabled={submitting || !notes.trim()}
                            className="w-full"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Forward to Doctor
                          </Button>
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

export default VerificationQueue;
