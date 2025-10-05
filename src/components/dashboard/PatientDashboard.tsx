
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Leaderboard from '../shared/Leaderboard';
import UserProfile from './components/UserProfile';
import QuickActions from './components/QuickActions';
import AppointmentList from './components/AppointmentList';
import HealthRecordsList from './components/HealthRecordsList';
import AIHealthAssistant from './components/AIHealthAssistant';
import CancerCareJourney from './components/CancerCareJourney';

const PatientDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  // Mock flag for oncology cases - in real app, this would come from patient data
  const hasHighRiskFlag = true;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Patient Dashboard</h1>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>
      
      {hasHighRiskFlag && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cancer-care" className="text-red-flag">
              Cancer Care Journey
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <UserProfile />
              <QuickActions />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <AppointmentList />
                <HealthRecordsList />
              </div>
              
              <div className="space-y-6">
                <AIHealthAssistant />
                <Leaderboard />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cancer-care" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CancerCareJourney />
              </div>
              
              <div className="space-y-6">
                <AIHealthAssistant />
                <Leaderboard />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {!hasHighRiskFlag && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UserProfile />
            <QuickActions />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <AppointmentList />
              <HealthRecordsList />
            </div>
            
            <div className="space-y-6">
              <AIHealthAssistant />
              <Leaderboard />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientDashboard;
