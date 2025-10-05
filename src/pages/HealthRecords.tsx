import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Filter, Download, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface HealthRecord {
  id: string;
  title: string;
  doctor_name: string | null;
  record_date: string;
  notes: string | null;
  diagnosis: string | null;
  prescription: string | null;
}

const HealthRecords = () => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('health_records')
          .select('*')
          .eq('user_id', user.id)
          .order('record_date', { ascending: false });
        
        if (error) throw error;
        setRecords(data || []);
      }
    } catch (error: any) {
      console.error('Error fetching records:', error);
      toast.error('Failed to load health records');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Complete Medical History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : records.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No health records found</p>
                <p className="text-sm">Start adding your health records from the dashboard</p>
              </div>
            ) : (
              <div className="space-y-4">
                {records.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold">{record.title}</h3>
                        {record.doctor_name && (
                          <p className="text-sm text-muted-foreground">Dr. {record.doctor_name}</p>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(record.record_date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {record.diagnosis && (
                      <div className="mb-2">
                        <p className="text-sm font-medium">Diagnosis:</p>
                        <p className="text-sm text-muted-foreground">{record.diagnosis}</p>
                      </div>
                    )}
                    
                    {record.prescription && (
                      <div className="mb-2">
                        <p className="text-sm font-medium">Prescription:</p>
                        <p className="text-sm text-muted-foreground">{record.prescription}</p>
                      </div>
                    )}
                    
                    {record.notes && (
                      <div>
                        <p className="text-sm font-medium">Notes:</p>
                        <p className="text-sm text-muted-foreground">{record.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default HealthRecords;
