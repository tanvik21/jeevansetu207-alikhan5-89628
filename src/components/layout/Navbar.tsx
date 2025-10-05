import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Menu, MessageCircle, X, Stethoscope, Clipboard, ActivitySquare, LogOut, User, FileText } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UserRole } from '@/types';
import { toast } from 'sonner';

interface NavbarProps {
  userRole?: UserRole;
}

const Navbar: React.FC<NavbarProps> = ({ userRole = 'patient' }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const roleLabel = {
    patient: 'Patient',
    doctor: 'Doctor',
    intern: 'Medical Intern'
  };

  const navItems = [
    { label: 'Dashboard', icon: ActivitySquare, href: '/dashboard' },
    ...(userRole !== 'doctor' ? [{ label: 'Health Records', icon: FileText, href: '/health-records' }] : []),
    ...(userRole !== 'doctor' ? [{ label: 'Symptom Checker', icon: Clipboard, href: '/symptom-checker' }] : []),
    userRole !== 'patient' ? { label: 'My Profile', icon: User, href: '/profile' } : null,
  ].filter(Boolean);

  return (
    <header className="border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col space-y-4 py-4">
                <Link to="/" className="flex items-center gap-2 px-2">
                  <Stethoscope className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold">JeevanSetu</span>
                </Link>
                <nav className="flex flex-col space-y-2">
                  {navItems.map((item, i) => 
                    item && (
                      <Link
                        key={i}
                        to={item.href}
                        className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-accent"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          
          <Link to="/" className="flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold hidden sm:inline">JeevanSetu</span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-6 ml-6">
            {navItems.map((item, i) => 
              item && (
                <Link
                  key={i}
                  to={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
        </div>
        
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
            </Button>
            
            <Button variant="ghost" size="icon">
              <MessageCircle size={20} />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full" size="icon">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback>{userRole?.[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{roleLabel[userRole]}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                {userRole !== 'doctor' && (
                  <DropdownMenuItem asChild>
                    <Link to="/health-records">Health Records</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/">
              <Button>Sign up</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
