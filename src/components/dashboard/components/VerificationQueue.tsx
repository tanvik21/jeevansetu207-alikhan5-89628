import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import InternCaseWorkspace from './InternCaseWorkspace';

interface AIReport {
  id: string;
  symptoms: string;
  ai_prediction: string;
  confidence_score: number;
  status: string;
  created_at: string;
  claimed_at?: string;
  claim_expires_at?: string;
  assigned_intern_id?: string;
}

const VerificationQueue = () => {
  const [reports, setReports] = useState<AIReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<AIReport | null>(null);
  const [claiming, setClaiming] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingReports();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('intern-queue-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_reports',
          filter: 'status=in.(pending_intern,generated,assigned_intern)'
        },
        () => {
          fetchPendingReports();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPendingReports = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user authenticated');
        return;
      }

      console.log('Fetching reports for intern:', user.id);

      // Fetch unassigned cases and cases assigned to current user
      const { data, error } = await supabase
        .from('ai_reports')
        .select('*')
        .or(`status.in.(pending_intern,generated),and(status.eq.assigned_intern,assigned_intern_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      console.log('Query result:', { data, error, count: data?.length });

      if (error) throw error;
      setReports(data || []);
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load verification queue');
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
        body: {
          caseId,
          role: 'intern'
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (response.error) throw response.error;
      
      const result = response.data;
      if (!result.success) {
        if (result.error === 'already_claimed') {
          toast.error(`Already claimed by ${result.current_owner?.name || 'another intern'}`);
        } else {
          toast.error(result.message || 'Failed to claim case');
        }
        await fetchPendingReports();
        return;
      }

      toast.success('Case claimed successfully');
      await fetchPendingReports();
      
      // Open the workspace
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
      <InternCaseWorkspace
        caseData={selectedCase}
        onBack={() => {
          setSelectedCase(null);
          fetchPendingReports();
        }}
        onSubmitSuccess={() => {
          setSelectedCase(null);
          fetchPendingReports();
        }}
      />
    );
  }

  const unassignedCases = reports.filter(r => r.status === 'pending_intern' || r.status === 'generated');
  const myCases = reports.filter(r => r.status === 'assigned_intern');

  return (
    <div className="space-y-6">
      {/* My Assigned Cases */}
      {myCases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
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
                        <Badge variant="default">In Progress</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{report.ai_prediction}</p>
                      <div className="flex gap-2 items-center text-xs text-muted-foreground">
                        <span>Confidence: {(report.confidence_score * 100).toFixed(0)}%</span>
                        <span>•</span>
                        <span>Claimed: {report.claimed_at ? new Date(report.claimed_at).toLocaleTimeString() : 'N/A'}</span>
                      </div>
                    </div>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => setSelectedCase(report)}
                    >
                      Continue Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Unassigned Cases Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Available Cases
            {unassignedCases.length > 0 && (
              <Badge variant="outline">{unassignedCases.length} available</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading cases...</div>
          ) : unassignedCases.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No unassigned cases available
            </div>
          ) : (
            <div className="space-y-3">
              {unassignedCases.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">Case #{report.id.slice(0, 8)}</p>
                        <Badge variant="outline">Unassigned</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{report.ai_prediction}</p>
                      <div className="flex gap-2 items-center text-xs text-muted-foreground">
                        <span>Confidence: {(report.confidence_score * 100).toFixed(0)}%</span>
                        <span>•</span>
                        <span>Created: {new Date(report.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleClaimCase(report.id)}
                      disabled={claiming === report.id}
                    >
                      {claiming === report.id ? 'Claiming...' : 'Claim Case'}
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

export default VerificationQueue;
