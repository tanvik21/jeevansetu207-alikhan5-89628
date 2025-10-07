import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';

interface AIReport {
  id: string;
  symptoms: string;
  ai_prediction: string;
  confidence_score: number;
  status: string;
  created_at: string;
  documents: string[];
}

const MyAIReports = () => {
  const { t } = useLanguage();
  const [reports, setReports] = useState<AIReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<AIReport | null>(null);

  useEffect(() => {
    fetchReports();

    // Subscribe to new reports
    const channel = supabase
      .channel('ai-reports-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_reports'
        },
        () => {
          fetchReports();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ai_reports'
        },
        () => {
          fetchReports();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchReports = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('ai_reports')
        .select('*')
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load AI reports');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'generated':
        return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" />{t('pendingInternReview')}</Badge>;
      case 'intern_verified':
        return <Badge variant="secondary" className="gap-1"><AlertCircle className="h-3 w-3" />{t('verifiedByIntern')}</Badge>;
      case 'doctor_verified':
        return <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" />{t('doctorApproved')}</Badge>;
      case 'completed':
        return <Badge className="gap-1 bg-green-600"><CheckCircle className="h-3 w-3" />{t('completed')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          {t('myAIReports')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">{t('loadingReports')}</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t('noReportsYet')}
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1 flex-1">
                    <p className="font-medium">{t('aiAnalysisFrom')} {new Date(report.created_at).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{report.symptoms}</p>
                    <div className="flex gap-2 items-center">
                      {getStatusBadge(report.status)}
                      <span className="text-xs text-muted-foreground">
                        {t('confidence')}: {(report.confidence_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedReport(report)}>
                        <Eye className="h-4 w-4 mr-1" />
                        {t('viewReport')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{t('reportDetails')}</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="max-h-[600px] pr-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">{t('status')}</h4>
                            {getStatusBadge(report.status)}
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">{t('symptoms')}</h4>
                            <p className="text-sm">{report.symptoms}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">{t('aiPrediction')}</h4>
                            <p className="text-sm">{report.ai_prediction}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">{t('confidenceScore')}</h4>
                            <p className="text-sm">{(report.confidence_score * 100).toFixed(1)}%</p>
                          </div>
                          {report.documents && report.documents.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">{t('documents')}</h4>
                              <ul className="text-sm space-y-1">
                                {report.documents.map((doc, idx) => (
                                  <li key={idx}>• {doc}</li>
                                ))}
                              </ul>
                            </div>
                          )}
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

export default MyAIReports;
