import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Activity, MapPin, FileText, Heart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const CancerCareJourney: React.FC = () => {
  // Mock data for demonstration
  const nextAppointment = {
    type: 'Mammogram',
    date: '2025-10-10',
    location: 'Jeevan Setu Diagnostic Center',
    time: '10:00 AM'
  };

  const sideEffects = [
    { name: 'Fatigue', value: 3 },
    { name: 'Nausea', value: 2 },
    { name: 'Pain', value: 1 }
  ];

  return (
    <Card className="border-red-flag/20 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-flag" />
            Cancer Care Journey
          </CardTitle>
          <Badge variant="outline" className="bg-red-flag/10 text-red-flag border-red-flag">
            Active Care
          </Badge>
        </div>
        <CardDescription>
          Your personalized oncology care pathway
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Next Critical Step */}
        <div className="bg-red-flag/5 border border-red-flag/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-red-flag mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-flag mb-1">Next Critical Step</h4>
              <p className="text-sm font-medium">{nextAppointment.type} Appointment</p>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date(nextAppointment.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} at {nextAppointment.time}
              </p>
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>{nextAppointment.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Guided Check-In */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-5 w-5 text-primary" />
            <h4 className="font-semibold">Guided Check-In</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Log your side effects (1 = minimal, 5 = severe)
          </p>
          <div className="space-y-3">
            {sideEffects.map((effect) => (
              <div key={effect.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{effect.name}</span>
                  <span className="font-medium">{effect.value}/5</span>
                </div>
                <Progress value={effect.value * 20} className="h-2" />
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full mt-3">
            Update Today's Status
          </Button>
        </div>

        {/* Resources */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-5 w-5 text-secondary" />
            <h4 className="font-semibold">Care Resources</h4>
          </div>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <MapPin className="h-4 w-4 mr-2" />
              Find Nearest Screening Camp
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Download Care Plan
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button className="w-full bg-red-flag hover:bg-red-flag/90">
          Schedule Specialist Consultation
        </Button>
        <Button variant="outline" className="w-full">
          View Full Care Timeline
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CancerCareJourney;