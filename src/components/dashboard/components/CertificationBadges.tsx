import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, CheckCircle, Clock, Lock } from 'lucide-react';

interface CertificationBadge {
  id: string;
  name: string;
  category: 'ai' | 'telemedicine' | 'palliative' | 'oncology';
  status: 'earned' | 'in-progress' | 'locked';
  earnedDate?: string;
  progress?: number;
}

const CertificationBadges: React.FC = () => {
  const badges: CertificationBadge[] = [
    {
      id: '1',
      name: 'AI Diagnostics Certified',
      category: 'ai',
      status: 'earned',
      earnedDate: '2025-03-15'
    },
    {
      id: '2',
      name: 'Telemedicine Practitioner',
      category: 'telemedicine',
      status: 'earned',
      earnedDate: '2025-02-20'
    },
    {
      id: '3',
      name: 'Oncology Triage Specialist',
      category: 'oncology',
      status: 'in-progress',
      progress: 65
    },
    {
      id: '4',
      name: 'Palliative Care Basics',
      category: 'palliative',
      status: 'in-progress',
      progress: 25
    },
    {
      id: '5',
      name: 'Advanced AI Interpretation',
      category: 'ai',
      status: 'locked'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ai':
        return 'bg-blue-500';
      case 'telemedicine':
        return 'bg-green-500';
      case 'palliative':
        return 'bg-purple-500';
      case 'oncology':
        return 'bg-red-flag';
      default:
        return 'bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'earned':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'locked':
        return <Lock className="h-5 w-5 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Certification Badges
        </CardTitle>
        <CardDescription>
          Track your professional certifications and achievements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 border rounded-lg ${
                badge.status === 'earned'
                  ? 'bg-accent/50 border-primary/30'
                  : badge.status === 'locked'
                  ? 'opacity-60'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${getCategoryColor(badge.category)} flex-shrink-0`}>
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{badge.name}</h4>
                    <p className="text-xs text-muted-foreground capitalize mt-1">
                      {badge.category} • {badge.status.replace('-', ' ')}
                    </p>
                  </div>
                </div>
                {getStatusIcon(badge.status)}
              </div>

              {badge.status === 'earned' && badge.earnedDate && (
                <Badge variant="outline" className="text-xs mt-2">
                  Earned: {new Date(badge.earnedDate).toLocaleDateString()}
                </Badge>
              )}

              {badge.status === 'in-progress' && badge.progress !== undefined && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span className="font-medium">{badge.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getCategoryColor(badge.category)}`}
                      style={{ width: `${badge.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {badge.status === 'locked' && (
                <p className="text-xs text-muted-foreground mt-2">
                  Complete prerequisite courses to unlock
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificationBadges;
