
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRole } from '@/types';
import { toast } from 'sonner';

interface LoginFormProps {
  role: UserRole;
}

const LoginForm: React.FC<LoginFormProps> = ({ role }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      if (isSignup) {
        // Sign up new user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: role,
            },
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        });
        
        if (error) throw error;
        
        if (data.user) {
          localStorage.setItem('userRole', role);
          localStorage.setItem('isLoggedIn', 'true');
          toast.success(`Welcome to Jeevan Setu, ${fullName}!`);
          navigate('/dashboard');
        }
      } else {
        // Sign in existing user
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        if (data.user) {
          // Fetch user profile to get role
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role, full_name')
            .eq('id', data.user.id)
            .single();
          
          if (profileError) {
            console.error('Profile fetch error:', profileError);
            toast.error('Profile not found. Please contact support.');
            return;
          }
          
          if (profile) {
            localStorage.setItem('userRole', profile.role);
            localStorage.setItem('isLoggedIn', 'true');
            toast.success(`Welcome back, ${profile.full_name}!`);
            navigate('/dashboard');
          }
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSignup && (
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="Enter your full name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder={`${role}@example.com`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          {!isSignup && (
            <a href="#" className="text-sm text-primary hover:underline">
              Forgot password?
            </a>
          )}
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (isSignup ? 'Creating account...' : 'Signing in...') : (isSignup ? 'Create Account' : 'Sign In')}
      </Button>
      
      <div className="text-center">
        <button
          type="button"
          onClick={() => setIsSignup(!isSignup)}
          className="text-sm text-primary hover:underline"
        >
          {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
