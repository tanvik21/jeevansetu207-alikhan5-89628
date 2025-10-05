import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Activity, Stethoscope } from 'lucide-react';

interface JourneyStage {
  id: string;
  date: string;
  title: string;
  description: string;
  stage: 'curative' | 'treatment' | 'palliative';
}

const PatientJourneyMap: React.FC = () => {
  const journeyStages: JourneyStage[] = [
    {
      id: '1',
      date: '2025-01-15',
      title: 'Initial Diagnosis',
      description: 'Stage II Breast Cancer detected via mammogram',
      stage: 'curative'
    },
    {
      id: '2',
      date: '2025-02-10',
      title: 'Treatment Started',
      description: 'Chemotherapy cycle 1 of 6 - Responding well',
      stage: 'treatment'
    },
    {
      id: '3',
      date: '2025-04-01',
      title: 'Current Status',
      description: 'Cycle 4 completed - Monitoring side effects',
      stage: 'treatment'
    }
  ];

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'curative':
        return 'bg-green-500';
      case 'treatment':
        return 'bg-yellow-500';
      case 'palliative':
        return 'bg-purple-500';
      default:
        return 'bg-muted';
    }
  };

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'curative':
        return 'Early Stage';
      case 'treatment':
        return 'Treatment Ongoing';
      case 'palliative':
        return 'Palliative Needed';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Patient Journey Map
        </CardTitle>
        <CardDescription>Timeline of diagnosis and treatment progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-6">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border" />
          
          {journeyStages.map((stage, index) => (
            <div key={stage.id} className="relative flex gap-4">
              {/* Timeline dot */}
              <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-background ${getStageColor(stage.stage)}`}>
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              
              {/* Content */}
              <div className="flex-1 bg-accent/50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{stage.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(stage.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>
                  </div>
                  <Badge variant="outline" className={`${getStageColor(stage.stage)} text-white border-0`}>
                    {getStageLabel(stage.stage)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{stage.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientJourneyMap;
