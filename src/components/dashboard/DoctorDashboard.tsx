import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import UserAvatar from '../shared/UserAvatar';
import Leaderboard from '../shared/Leaderboard';
import PatientJourneyMap from './components/PatientJourneyMap';
import HospiceReferralPanel from './components/HospiceReferralPanel';
import SymptomBurdenTracker from './components/SymptomBurdenTracker';
import CollaborationTools from './components/CollaborationTools';
import { 
  Brain, 
  Calendar, 
  FileText, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3, 
  UserCheck, 
  Activity,
  Download,
  Eye,
  Heart,
  TrendingUp
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface PatientCase {
  id: string;
  patientName: string;
  age: number;
  aiDiagnosis: string;
  confidence: number;
  stage?: string;
  cancerType?: string;
  submittedAt: string;
  severity: 'low' | 'medium' | 'high';
  label: 'early-stage' | 'treatment-ongoing' | 'palliative-needed';
}

const DoctorDashboard: React.FC = () => {
  const [filterLabel, setFilterLabel] = useState<string>('all');
  
  // Mock patient cases with oncology data
  const patientCases: PatientCase[] = [
    {
      id: '1',
      patientName: 'Sarah Williams',
      age: 62,
      aiDiagnosis: 'Stage IV Pancreatic Cancer',
      confidence: 94,
      stage: 'Stage IV',
      cancerType: 'Pancreatic',
      submittedAt: '1 hour ago',
      severity: 'high',
      label: 'palliative-needed'
    },
    {
      id: '2',
      patientName: 'Rajesh Kumar',
      age: 58,
      aiDiagnosis: 'Stage II Colorectal Cancer',
      confidence: 89,
      stage: 'Stage II',
      cancerType: 'Colorectal',
      submittedAt: '3 hours ago',
      severity: 'medium',
      label: 'treatment-ongoing'
    },
    {
      id: '3',
      patientName: 'Anita Desai',
      age: 45,
      aiDiagnosis: 'Stage I Breast Cancer',
      confidence: 91,
      stage: 'Stage I',
      cancerType: 'Breast',
      submittedAt: '5 hours ago',
      severity: 'low',
      label: 'early-stage'
    }
  ];

  const filteredCases = filterLabel === 'all' 
    ? patientCases 
    : patientCases.filter(c => c.label === filterLabel);

  const getLabelColor = (label: string) => {
    switch (label) {
      case 'early-stage':
        return 'bg-green-500';
      case 'treatment-ongoing':
        return 'bg-yellow-500';
      case 'palliative-needed':
        return 'bg-purple-500';
      default:
        return 'bg-muted';
    }
  };

  const getLabelText = (label: string) => {
    switch (label) {
      case 'early-stage':
        return 'Early Stage';
      case 'treatment-ongoing':
        return 'Treatment Ongoing';
      case 'palliative-needed':
        return 'Palliative Needed';
      default:
        return '';
    }
  };

  const handleDownloadReport = (patientName: string) => {
    toast.success(`Downloading AI analysis report for ${patientName}`);
  };

  const handleViewReport = (patientName: string) => {
    toast.info(`Opening detailed report for ${patientName}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Oncology & Palliative Care Dashboard</h1>
          <p className="text-muted-foreground mt-1">Compassionate cancer care coordination</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            My Schedule
          </Button>
        </div>
      </div>

      {/* Doctor Profile Card */}
      <Card className="health-gradient text-white">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold">Dr. Jane Smith</h2>
              <p className="text-white/90">Oncology Specialist</p>
              <div className="flex items-center mt-2">
                <UserCheck className="h-4 w-4 mr-1" />
                <span className="text-sm">Verified Oncologist</span>
              </div>
            </div>
            <UserAvatar name="Dr. Jane Smith" role="doctor" size="lg" />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-white/20 rounded-lg p-3 text-center backdrop-blur-sm">
              <p className="text-2xl font-bold">18</p>
              <p className="text-xs">Active Cases</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center backdrop-blur-sm">
              <p className="text-2xl font-bold">145</p>
              <p className="text-xs">Total Hours</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center backdrop-blur-sm">
              <p className="text-2xl font-bold">4.9</p>
              <p className="text-xs">Rating</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Queue */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Analysis Queue
              </CardTitle>
              <CardDescription>
                Review AI-flagged oncology cases with cancer suspicion levels
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant={filterLabel === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterLabel('all')}
              >
                All Cases
              </Button>
              <Button 
                size="sm" 
                variant={filterLabel === 'early-stage' ? 'default' : 'outline'}
                onClick={() => setFilterLabel('early-stage')}
                className={filterLabel === 'early-stage' ? 'bg-green-500 hover:bg-green-600' : ''}
              >
                Early Stage
              </Button>
              <Button 
                size="sm" 
                variant={filterLabel === 'treatment-ongoing' ? 'default' : 'outline'}
                onClick={() => setFilterLabel('treatment-ongoing')}
                className={filterLabel === 'treatment-ongoing' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
              >
                Treatment
              </Button>
              <Button 
                size="sm" 
                variant={filterLabel === 'palliative-needed' ? 'default' : 'outline'}
                onClick={() => setFilterLabel('palliative-needed')}
                className={filterLabel === 'palliative-needed' ? 'bg-purple-500 hover:bg-purple-600' : ''}
              >
                Palliative
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCases.map((patientCase) => (
              <div 
                key={patientCase.id} 
                className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-3 items-start flex-1">
                    <UserAvatar name={patientCase.patientName} role="patient" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{patientCase.patientName}</p>
                        <Badge variant="outline" className={`${getLabelColor(patientCase.label)} text-white border-0 text-xs`}>
                          {getLabelText(patientCase.label)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {patientCase.age} years • {patientCase.stage} • {patientCase.submittedAt}
                      </p>
                      <div className="flex items-center mt-2 gap-2">
                        <Brain className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{patientCase.aiDiagnosis}</span>
                        <Badge variant="secondary" className="text-xs">
                          {patientCase.confidence}% confidence
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDownloadReport(patientCase.patientName)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleViewReport(patientCase.patientName)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Journey Map */}
        <PatientJourneyMap />

        {/* Hospice Referral Panel */}
        <HospiceReferralPanel />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Symptom Burden Tracker */}
        <SymptomBurdenTracker />

        {/* Collaboration Tools */}
        <CollaborationTools />
      </div>

      {/* Community Impact Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Community Impact Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-accent rounded-lg p-4 text-center">
                <p className="text-3xl font-bold">52</p>
                <p className="text-sm text-muted-foreground">Consultations</p>
              </div>
              <div className="bg-accent rounded-lg p-4 text-center">
                <p className="text-3xl font-bold">38</p>
                <p className="text-sm text-muted-foreground">AI Reviews Verified</p>
              </div>
              <div className="bg-accent rounded-lg p-4 text-center">
                <p className="text-3xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Hospice Referrals</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/20 rounded-lg p-4 text-center border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Heart className="h-4 w-4 text-purple-600" />
                  <p className="text-3xl font-bold text-purple-600">4.8</p>
                </div>
                <p className="text-sm text-muted-foreground">Comfort Impact</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Patient Satisfaction</span>
                  <span className="text-sm font-medium">96%</span>
                </div>
                <Progress value={96} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">AI Diagnosis Accuracy</span>
                  <span className="text-sm font-medium">94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Family Feedback Score
                  </span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Leaderboard />
      </div>
    </div>
  );
};

export default DoctorDashboard;
