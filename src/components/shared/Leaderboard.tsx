
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserAvatar from './UserAvatar';
import { Doctor } from '@/types';
import { Trophy } from 'lucide-react';

// Mock data for the community service leaderboard
const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Jane Smith',
    email: 'jane.smith@example.com',
    role: 'doctor',
    specialty: 'Cardiology',
    yearsExperience: 12,
    freeCommunityHours: 120,
    rating: 4.9,
    hospital: 'City General Hospital'
  },
  {
    id: '2',
    name: 'Dr. James Wilson',
    email: 'james.wilson@example.com',
    role: 'doctor',
    specialty: 'Neurology',
    yearsExperience: 15,
    freeCommunityHours: 95,
    rating: 4.8,
    hospital: 'University Medical Center'
  },
  {
    id: '3',
    name: 'Dr. Maria Rodriguez',
    email: 'maria.rodriguez@example.com',
    role: 'doctor',
    specialty: 'Pediatrics',
    yearsExperience: 8,
    freeCommunityHours: 87,
    rating: 4.9,
    hospital: 'Children\'s Hospital'
  },
  {
    id: '4',
    name: 'Dr. David Chen',
    email: 'david.chen@example.com',
    role: 'doctor',
    specialty: 'Dermatology',
    yearsExperience: 10,
    freeCommunityHours: 72,
    rating: 4.7,
    hospital: 'Skin Health Clinic'
  },
  {
    id: '5',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'doctor',
    specialty: 'Psychiatry',
    yearsExperience: 9,
    freeCommunityHours: 65,
    rating: 4.8,
    hospital: 'Mental Health Institute'
  }
];

interface LeaderboardProps {
  className?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ className }) => {
  // Sort doctors by community service hours
  const sortedDoctors = [...mockDoctors].sort((a, b) => b.freeCommunityHours - a.freeCommunityHours);
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span>Community Service Leaderboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedDoctors.map((doctor, index) => (
            <div key={doctor.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-sm font-medium">
                  {index + 1}
                </div>
                <UserAvatar name={doctor.name} role="doctor" />
                <div>
                  <p className="text-sm font-medium">{doctor.name}</p>
                  <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{doctor.freeCommunityHours} hrs</p>
                <div className="flex items-center justify-end text-xs text-yellow-500">
                  {Array(5).fill(0).map((_, i) => (
                    <span key={i} className="inline-block">★</span>
                  ))}
                  <span className="ml-1 text-muted-foreground">{doctor.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
