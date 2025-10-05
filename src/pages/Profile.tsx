
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import DoctorProfile from '@/components/profile/DoctorProfile';
import { UserRole } from '@/types';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<UserRole | undefined>(undefined);
  
  useEffect(() => {
    // Get user role from localStorage
    const role = localStorage.getItem('userRole') as UserRole | null;
    
    if (role) {
      setUserRole(role);
      // Redirect patients to their dashboard
      if (role === 'patient') {
        navigate('/dashboard');
      }
    }
  }, [navigate]);
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        {userRole === 'doctor' && <DoctorProfile />}
        {userRole === 'intern' && (
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Intern Profile</h2>
              <p className="text-muted-foreground mt-2">This section is under development</p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Profile;
