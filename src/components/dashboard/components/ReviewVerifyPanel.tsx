import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileCheck, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import DoctorCaseWorkspace from './DoctorCaseWorkspace';

interface AIReport {
  id: string;
  symptoms: string;
  ai_prediction: string;
  confidence_score: number;
  created_at: string;
  claimed_at?: string;
  claim_expires_at?: string;
  assigned_doctor_id?: string;
  status: string;
}

const ReviewVerifyPanel = () => {
  const [reports, setReports] = useState<AIReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<AIReport | null>(null);
  const [claiming, setClaiming] = useState<string | null>(null);

  useEffect(() => {
    fetchReportsForReview();
    
    const channel = supabase
      .channel('doctor-queue-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'ai_reports',
        filter: 'status=in.(pending_doctor,intern_verified,assigned_doctor)'
      }, () => fetchReportsForReview())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchReportsForReview = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('ai_reports')
        .select('*')
        .or(`status.in.(pending_doctor,intern_verified),and(status.eq.assigned_doctor,assigned_doctor_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setReports(data || []);
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimCase = async (caseId: string) => {
    setClaiming(caseId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('claim-case', {
        body: { caseId, role: 'doctor' },
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      if (response.error) throw response.error;
      
      const result = response.data;
      if (!result.success) {
        toast.error(result.message || 'Failed to claim case');
        await fetchReportsForReview();
        return;
      }

      toast.success('Case claimed successfully');
      await fetchReportsForReview();
      
      const claimedCase = reports.find(r => r.id === caseId);
      if (claimedCase) {
        setSelectedCase({ 
          ...claimedCase, 
          claimed_at: new Date().toISOString(),
          claim_expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString()
        });
      }
    } catch (error: any) {
      console.error('Error claiming case:', error);
      toast.error(error.message || 'Failed to claim case');
    } finally {
      setClaiming(null);
    }
  };

  if (selectedCase) {
    return (
      <DoctorCaseWorkspace
        caseData={selectedCase}
        onBack={() => { setSelectedCase(null); fetchReportsForReview(); }}
        onFinalizeSuccess={() => { setSelectedCase(null); fetchReportsForReview(); }}
      />
    );
  }

  const unassignedCases = reports.filter(r => r.status === 'pending_doctor' || r.status === 'intern_verified');
  const myCases = reports.filter(r => r.status === 'assigned_doctor');

  return (
    <div className="space-y-6">
      {myCases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              My Assigned Cases
              <Badge variant="secondary">{myCases.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myCases.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">Case #{report.id.slice(0, 8)}</p>
                        <Badge variant="default">In Review</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{report.ai_prediction}</p>
                    </div>
                    <Button variant="default" size="sm" onClick={() => setSelectedCase(report)}>
                      Continue Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Cases Pending Review
            {unassignedCases.length > 0 && <Badge variant="outline">{unassignedCases.length} available</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading reports...</div>
          ) : unassignedCases.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No cases awaiting review</div>
          ) : (
            <div className="space-y-3">
              {unassignedCases.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">Case #{report.id.slice(0, 8)}</p>
                        <Badge variant="outline">Intern Verified</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{report.ai_prediction}</p>
                    </div>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleClaimCase(report.id)}
                      disabled={claiming === report.id}
                    >
                      {claiming === report.id ? 'Claiming...' : 'Claim for Review'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewVerifyPanel;
