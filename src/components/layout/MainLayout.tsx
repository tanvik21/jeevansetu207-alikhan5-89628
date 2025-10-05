
import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { UserRole } from '@/types';

interface MainLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, requireAuth = true }) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<UserRole | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('userRole') as UserRole | null;
    
    if (requireAuth && !isLoggedIn) {
      navigate('/');
    } else if (role) {
      setUserRole(role);
    }
    
    setIsLoading(false);
  }, [navigate, requireAuth]);
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background transition-colors">
      <Navbar userRole={userRole} />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t py-6 bg-accent/30 dark:bg-accent/10 transition-colors">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} JeevanSetu. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
