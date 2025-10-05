import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Activity, Pill, UserRound } from 'lucide-react';
import { toast } from 'sonner';

interface SymptomData {
  name: string;
  value: number;
  color: string;
}

const SymptomBurdenTracker: React.FC = () => {
  const symptoms: SymptomData[] = [
    { name: 'Pain', value: 80, color: 'bg-red-500' },
    { name: 'Nausea', value: 45, color: 'bg-orange-500' },
    { name: 'Fatigue', value: 90, color: 'bg-yellow-500' },
    { name: 'Emotional Distress', value: 60, color: 'bg-blue-500' }
  ];

  const handleAdjustMeds = () => {
    toast.success('Pain medication adjustment request sent');
  };

  const handleNurseVisit = () => {
    toast.success('Hospice nurse visit scheduled for tomorrow 10:00 AM');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Symptom Burden Tracker
        </CardTitle>
        <CardDescription>
          Real-time patient symptom monitoring from app check-ins
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Symptom Sliders */}
        <div className="space-y-5">
          {symptoms.map((symptom) => (
            <div key={symptom.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{symptom.name}</span>
                <span className="text-sm text-muted-foreground">{symptom.value}/100</span>
              </div>
              <div className="relative">
                <Slider
                  value={[symptom.value]}
                  disabled
                  className="cursor-default"
                />
                <div 
                  className={`absolute top-0 left-0 h-2 rounded-full ${symptom.color}`}
                  style={{ width: `${symptom.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t space-y-2">
          <p className="text-sm font-medium mb-3">Quick Actions</p>
          <Button 
            onClick={handleAdjustMeds}
            variant="outline" 
            className="w-full justify-start"
          >
            <Pill className="h-4 w-4 mr-2" />
            Adjust Pain Medication
          </Button>
          <Button 
            onClick={handleNurseVisit}
            variant="outline" 
            className="w-full justify-start"
          >
            <UserRound className="h-4 w-4 mr-2" />
            Request Hospice Nurse Visit
          </Button>
        </div>

        {/* Last Update */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Last updated: 2 hours ago via patient app
        </div>
      </CardContent>
    </Card>
  );
};

export default SymptomBurdenTracker;
