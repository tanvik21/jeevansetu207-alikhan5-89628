
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import UserAvatar from '@/components/shared/UserAvatar';
import { Heart, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const UserProfile = () => {
  const [userName, setUserName] = useState('Loading...');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserName(profile.full_name);
          setUserId(user.id.slice(0, 8));
        }
      }
    };
    
    fetchUserProfile();
  }, []);

  return (
    <Card className="health-gradient text-white">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-medium">Welcome Back</h2>
            <p className="text-3xl font-bold mt-2">{userName}</p>
            <p className="mt-1 opacity-90">Patient ID: #{userId}</p>
          </div>
          <UserAvatar name={userName} size="lg" />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white/20 rounded-lg p-3">
            <div className="flex items-center">
              <Heart className="h-5 w-5 mr-2" fill="white" />
              <span className="text-sm">Health Score</span>
            </div>
            <p className="text-2xl font-bold mt-1">92/100</p>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <div className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              <span className="text-sm">Appointments</span>
            </div>
            <p className="text-2xl font-bold mt-1">2</p>
            <p className="text-xs">Upcoming</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
