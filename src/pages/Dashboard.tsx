
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PatientDashboard from '@/components/dashboard/PatientDashboard';
import DoctorDashboard from '@/components/dashboard/DoctorDashboard';
import InternDashboard from '@/components/dashboard/InternDashboard';
import { UserRole } from '@/types';

const Dashboard = () => {
  const [userRole, setUserRole] = useState<UserRole | undefined>(undefined);
  
  useEffect(() => {
    // Get user role from localStorage
    const role = localStorage.getItem('userRole') as UserRole | null;
    if (role) {
      setUserRole(role);
    }
  }, []);
  
  const renderDashboard = () => {
    switch (userRole) {
      case 'patient':
        return <PatientDashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      case 'intern':
        return <InternDashboard />;
      default:
        return (
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Welcome to JeevanSetu</h2>
              <p className="text-muted-foreground mt-2">Loading your dashboard...</p>
            </div>
          </div>
        );
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        {renderDashboard()}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
