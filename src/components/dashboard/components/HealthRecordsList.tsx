import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ClipboardList, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface HealthRecord {
  id: string;
  title: string;
  doctor_name: string;
  record_date: string;
  notes: string;
}

const HealthRecordsList = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    doctor_name: '',
    record_date: new Date().toISOString().split('T')[0],
    notes: '',
    diagnosis: '',
    prescription: '',
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data, error } = await supabase
        .from('health_records')
        .select('id, title, doctor_name, record_date, notes')
        .eq('user_id', user.id)
        .order('record_date', { ascending: false })
        .limit(3);
      
      if (error) {
        console.error('Error fetching records:', error);
      } else {
        setRecords(data || []);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please log in to save health records');
        return;
      }
      
      const { error } = await supabase
        .from('health_records')
        .insert({
          user_id: user.id,
          ...formData,
        });
      
      if (error) throw error;
      
      toast.success('Health record saved successfully!');
      setIsDialogOpen(false);
      setFormData({
        title: '',
        doctor_name: '',
        record_date: new Date().toISOString().split('T')[0],
        notes: '',
        diagnosis: '',
        prescription: '',
      });
      fetchRecords();
    } catch (error: any) {
      console.error('Error saving record:', error);
      toast.error(error.message || 'Failed to save health record');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            <span>Recent Health Records</span>
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Health Record</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Annual Check-up"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor_name">Doctor Name</Label>
                  <Input
                    id="doctor_name"
                    value={formData.doctor_name}
                    onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                    placeholder="e.g., Dr. Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="record_date">Date *</Label>
                  <Input
                    id="record_date"
                    type="date"
                    value={formData.record_date}
                    onChange={(e) => setFormData({ ...formData, record_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional notes..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Textarea
                    id="diagnosis"
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                    placeholder="Diagnosis details..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prescription">Prescription</Label>
                  <Textarea
                    id="prescription"
                    value={formData.prescription}
                    onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                    placeholder="Medication and dosage..."
                    rows={2}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Record'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {records.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No health records yet</p>
              <p className="text-sm">Click "Add Record" to create your first record</p>
            </div>
          ) : (
            records.map((record) => (
              <div key={record.id} className="p-4 border rounded-lg card-hover">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">{record.title}</h3>
                  <span className="text-sm text-muted-foreground">
                    {new Date(record.record_date).toLocaleDateString()}
                  </span>
                </div>
                {record.doctor_name && (
                  <p className="text-sm text-muted-foreground mb-2">Dr. {record.doctor_name}</p>
                )}
                <p className="text-sm">{record.notes}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate('/health-records')}
        >
          View Complete Medical History
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HealthRecordsList;
