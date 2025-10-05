
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import UserAvatar from '../shared/UserAvatar';
import Leaderboard from '../shared/Leaderboard';
import CertificationBadges from './components/CertificationBadges';
import { Award, BookOpen, Brain, Calendar, Clock, FileCheck, UserCheck, FileText, GraduationCap, Activity, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const InternDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock data
  const trainingModules = [
    {
      id: '1',
      title: 'AI Diagnostic Interpretation',
      progress: 75,
      totalHours: 20,
      completedHours: 15,
      dueDate: '2025-05-10',
      isOncology: false
    },
    {
      id: '2',
      title: 'Telemedicine Best Practices',
      progress: 90,
      totalHours: 15,
      completedHours: 13.5,
      dueDate: '2025-04-25',
      isOncology: false
    },
    {
      id: '3',
      title: 'Electronic Health Records',
      progress: 40,
      totalHours: 25,
      completedHours: 10,
      dueDate: '2025-06-15',
      isOncology: false
    },
    {
      id: '4',
      title: 'Oncology Diagnostics & Palliative Care Basics',
      progress: 25,
      totalHours: 30,
      completedHours: 7.5,
      dueDate: '2025-07-01',
      isOncology: true
    }
  ];
  
  const supervisedCases = [
    {
      id: '1',
      patientName: 'Emma Thompson',
      age: 45,
      condition: 'Hypertension',
      supervisor: 'Dr. Jane Smith',
      date: '2025-04-16',
      status: 'in-progress',
      isOncology: false
    },
    {
      id: '2',
      patientName: 'Marcus Lee',
      age: 28,
      condition: 'Sports Injury',
      supervisor: 'Dr. James Wilson',
      date: '2025-04-15',
      status: 'completed',
      isOncology: false
    },
    {
      id: '3',
      patientName: 'Olivia Garcia',
      age: 62,
      condition: 'Suspected Breast Mass - High Suspicion',
      supervisor: 'Dr. Maria Rodriguez',
      date: '2025-04-14',
      status: 'in-progress',
      isOncology: true
    }
  ];
  
  const upcomingShifts = [
    {
      id: '1',
      department: 'Cardiology',
      supervisor: 'Dr. Jane Smith',
      date: '2025-04-18',
      time: '07:00 - 15:00'
    },
    {
      id: '2',
      department: 'Emergency Medicine',
      supervisor: 'Dr. David Chen',
      date: '2025-04-20',
      time: '15:00 - 23:00'
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Medical Intern Dashboard</h1>
        <Button onClick={() => navigate('/intern-profile')}>
          <Calendar className="h-4 w-4 mr-2" />
          View My Profile
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <Card className="md:col-span-4 health-gradient text-white">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-medium">Alex Johnson</h2>
                <p className="text-muted-foreground text-white/80">Medical Intern, Year 2</p>
                <div className="flex items-center mt-1">
                  <GraduationCap className="h-4 w-4 mr-1" />
                  <span className="text-sm">City Medical School</span>
                </div>
              </div>
              <UserAvatar name="Alex Johnson" role="intern" size="lg" />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-white/20 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold">78%</p>
                <p className="text-xs">Training Completed</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold">45</p>
                <p className="text-xs">Cases Observed</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs">Cases Assisted</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-8">
          <CardHeader className="pb-2">
            <CardTitle>Training Progress</CardTitle>
            <CardDescription>
              Track your medical training and education requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {trainingModules.map((module) => (
                <div key={module.id} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{module.title}</h3>
                        {module.isOncology && (
                          <span className="text-xs bg-red-flag/10 text-red-flag px-2 py-0.5 rounded-full border border-red-flag/30 font-semibold">
                            MANDATORY
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>{module.completedHours}/{module.totalHours} hours</span>
                        <span className="mx-2">•</span>
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>Due: {new Date(module.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8" onClick={() => alert('Continue training module')}>
                      Continue
                    </Button>
                  </div>
                  <Progress 
                    value={module.progress} 
                    className={`h-2 ${module.isOncology ? '[&>div]:bg-red-flag' : ''}`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => alert('View all training modules')}>View All Training Modules</Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>Supervised Cases</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="active">
                <TabsList className="mb-4">
                  <TabsTrigger value="active">Active Cases</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="all">All Cases</TabsTrigger>
                </TabsList>
                
                <TabsContent value="active">
                  <div className="space-y-4">
                    {supervisedCases.filter(c => c.status === 'in-progress').map((caseItem) => (
                      <div 
                        key={caseItem.id} 
                        className={`flex justify-between items-center p-4 border rounded-lg card-hover ${
                          caseItem.isOncology ? 'border-red-flag/40 bg-red-flag/5' : ''
                        }`}
                      >
                        <div className="flex gap-4 items-center flex-1">
                          <UserAvatar name={caseItem.patientName} role="patient" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{caseItem.patientName}</p>
                              <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                {caseItem.age} yrs
                              </span>
                              {caseItem.isOncology && (
                                <span className="text-xs bg-red-flag text-red-flag-foreground px-2 py-0.5 rounded-full font-semibold">
                                  ONCOLOGY
                                </span>
                              )}
                            </div>
                            <p className="text-sm">{caseItem.condition}</p>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <UserCheck className="h-3 w-3 mr-1" />
                              <span>Supervised by: {caseItem.supervisor}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => alert('View case notes')}>
                            <FileCheck className="h-4 w-4 mr-2" />
                            Notes
                          </Button>
                          <Button size="sm" onClick={() => alert('View full case details')}>View Case</Button>
                        </div>
                      </div>
                    ))}
                    
                    {supervisedCases.filter(c => c.status === 'in-progress').length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No active cases at the moment</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="completed">
                  <div className="space-y-4">
                    {supervisedCases.filter(c => c.status === 'completed').map((caseItem) => (
                      <div key={caseItem.id} className="flex justify-between items-center p-4 border rounded-lg card-hover">
                        <div className="flex gap-4 items-center">
                          <UserAvatar name={caseItem.patientName} role="patient" />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{caseItem.patientName}</p>
                              <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                {caseItem.age} yrs
                              </span>
                              <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex items-center">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completed
                              </span>
                            </div>
                            <p className="text-sm">{caseItem.condition}</p>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <UserCheck className="h-3 w-3 mr-1" />
                              <span>Supervised by: {caseItem.supervisor}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => alert('Review completed case')}>
                            <FileCheck className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="all">
                  <div className="space-y-4">
                    {supervisedCases.map((caseItem) => (
                      <div key={caseItem.id} className="flex justify-between items-center p-4 border rounded-lg card-hover">
                        <div className="flex gap-4 items-center">
                          <UserAvatar name={caseItem.patientName} role="patient" />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{caseItem.patientName}</p>
                              <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                {caseItem.age} yrs
                              </span>
                              {caseItem.status === 'completed' && (
                                <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex items-center">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Completed
                                </span>
                              )}
                            </div>
                            <p className="text-sm">{caseItem.condition}</p>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <UserCheck className="h-3 w-3 mr-1" />
                              <span>Supervised by: {caseItem.supervisor}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => alert('View case notes')}>
                            <FileCheck className="h-4 w-4 mr-2" />
                            {caseItem.status === 'completed' ? 'Review' : 'Notes'}
                          </Button>
                          {caseItem.status !== 'completed' && (
                            <Button size="sm" onClick={() => alert('View full case details')}>View Case</Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <span>AI Learning Modules</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg card-hover">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">AI Diagnostic Interpretation</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Learn how to interpret and validate AI-generated medical diagnoses.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm">
                      <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>8 lessons</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>4.5 hours</span>
                    </div>
                    <Button size="sm" onClick={() => alert('Continue AI learning module')}>Continue</Button>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg card-hover">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">Reading Radiology AI Reports</h3>
                    <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
                      Advanced
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Advanced course on interpreting AI-analyzed radiological images.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm">
                      <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>12 lessons</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>6 hours</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => alert('Start advanced radiology course')}>Start Course</Button>
                  </div>
                </div>
                
                <div className="p-4 border-2 border-red-flag/30 bg-red-flag/5 rounded-lg card-hover">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium text-red-flag">Red-Flag Spotting: Oncology Triage</h3>
                    <span className="text-xs bg-red-flag text-red-flag-foreground px-2 py-0.5 rounded-full font-semibold">
                      New
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Learn to identify critical oncology red flags and perform effective cancer triage.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm">
                      <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>6 lessons</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>4.5 hours</span>
                    </div>
                    <Button size="sm" className="bg-red-flag hover:bg-red-flag/90" onClick={() => alert('Continue oncology triage training')}>Continue</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Browse All Courses</Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Upcoming Shifts</CardTitle>
              <CardDescription>Your scheduled hospital rotations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingShifts.map((shift) => (
                <div key={shift.id} className="flex justify-between p-3 border rounded-lg card-hover">
                  <div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium">{new Date(shift.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <p className="text-sm mt-1">{shift.time}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {shift.department} • {shift.supervisor}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost">
                    Details
                  </Button>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View Full Schedule</Button>
            </CardFooter>
          </Card>
          
          <CertificationBadges />
          
          <Leaderboard />
        </div>
      </div>
    </div>
  );
};

export default InternDashboard;
