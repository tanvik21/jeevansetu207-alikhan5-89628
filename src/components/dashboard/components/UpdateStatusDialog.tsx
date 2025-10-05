import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UpdateStatusDialogProps {
  children?: React.ReactNode;
  onSuccess?: () => void;
}

const symptomsList = [
  { key: 'fatigue', label: 'Fatigue' },
  { key: 'nausea', label: 'Nausea' },
  { key: 'pain', label: 'Pain Level' },
  { key: 'appetite', label: 'Loss of Appetite' },
  { key: 'sleep', label: 'Sleep Quality Issues' }
];

const UpdateStatusDialog: React.FC<UpdateStatusDialogProps> = ({ children, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [symptoms, setSymptoms] = useState<{[key: string]: number}>({
    fatigue: 3,
    nausea: 2,
    pain: 1,
    appetite: 2,
    sleep: 2
  });
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('Please log in to update your status');
        return;
      }

      // Here you would typically save to a database
      // For now, we'll just show a success message
      toast.success('Daily status updated successfully');
      
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <Button variant="outline" size="sm">Update Today's Status</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Daily Status</DialogTitle>
          <DialogDescription>
            Log your symptoms and how you're feeling today (1 = minimal, 5 = severe)
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {symptomsList.map((symptom) => (
            <div key={symptom.key} className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>{symptom.label}</Label>
                <span className="text-sm font-medium">{symptoms[symptom.key]}/5</span>
              </div>
              <Slider
                value={[symptoms[symptom.key]]}
                onValueChange={(value) => setSymptoms({ ...symptoms, [symptom.key]: value[0] })}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          ))}

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any other symptoms or concerns you'd like to note..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="flex-1" disabled={loading}>
              {loading ? 'Saving...' : 'Submit Status Update'}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStatusDialog;