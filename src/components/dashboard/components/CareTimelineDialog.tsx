import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface CareTimelineDialogProps {
  children?: React.ReactNode;
}

const CareTimelineDialog: React.FC<CareTimelineDialogProps> = ({ children }) => {
  const timelineEvents = [
    {
      id: 1,
      title: 'Initial Screening',
      date: '2025-08-15',
      status: 'completed',
      description: 'Mammogram screening completed with suspicious findings'
    },
    {
      id: 2,
      title: 'Biopsy Procedure',
      date: '2025-08-22',
      status: 'completed',
      description: 'Tissue biopsy confirmed early-stage breast cancer'
    },
    {
      id: 3,
      title: 'Treatment Plan Discussion',
      date: '2025-09-01',
      status: 'completed',
      description: 'Met with oncologist to discuss treatment options'
    },
    {
      id: 4,
      title: 'Surgery - Lumpectomy',
      date: '2025-09-15',
      status: 'completed',
      description: 'Successful surgical removal of tumor'
    },
    {
      id: 5,
      title: 'Chemotherapy Session 1',
      date: '2025-10-01',
      status: 'completed',
      description: 'First round of chemotherapy administered'
    },
    {
      id: 6,
      title: 'Follow-up Scan',
      date: '2025-10-10',
      status: 'upcoming',
      description: 'Mammogram to assess treatment progress'
    },
    {
      id: 7,
      title: 'Chemotherapy Session 2',
      date: '2025-10-20',
      status: 'scheduled',
      description: 'Second round of chemotherapy'
    },
    {
      id: 8,
      title: 'Radiation Therapy',
      date: '2025-11-01',
      status: 'scheduled',
      description: 'Begin radiation treatment course'
    }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || <Button variant="outline">View Full Care Timeline</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Your Cancer Care Timeline</DialogTitle>
          <DialogDescription>
            Complete overview of your treatment journey
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative mt-6">
          {timelineEvents.map((event, index) => (
            <div key={event.id} className="relative pb-8 last:pb-0">
              {index !== timelineEvents.length - 1 && (
                <div className="absolute left-4 top-8 h-full w-0.5 bg-border" />
              )}
              
              <div className="flex items-start gap-4">
                <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  event.status === 'completed' 
                    ? 'bg-green-100 border-green-500' 
                    : event.status === 'upcoming'
                    ? 'bg-red-flag/10 border-red-flag'
                    : 'bg-muted border-border'
                }`}>
                  {event.status === 'completed' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : event.status === 'upcoming' ? (
                    <AlertCircle className="h-4 w-4 text-red-flag" />
                  ) : (
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{event.title}</h4>
                    <Badge variant={
                      event.status === 'completed' ? 'secondary' :
                      event.status === 'upcoming' ? 'default' : 'outline'
                    }>
                      {event.status === 'completed' ? 'Completed' :
                       event.status === 'upcoming' ? 'Upcoming' : 'Scheduled'}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-6 pt-4 border-t">
          <Button className="flex-1">
            Download Care Plan PDF
          </Button>
          <Button variant="outline">
            Share with Family
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CareTimelineDialog;