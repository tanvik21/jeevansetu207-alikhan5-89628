import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UserAvatar from '../shared/UserAvatar';
import { Calendar, MessageCircle, Award, MapPin, Clock, Star, ThumbsUp, Users, Medal, Trophy, Edit, Save, X } from 'lucide-react';
import { Doctor } from '@/types';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Mock data for a doctor profile
const mockDoctor: Doctor = {
  id: '1',
  name: 'Dr. Jane Smith',
  email: 'jane.smith@example.com',
  role: 'doctor',
  specialty: 'Cardiology',
  hospital: 'City General Hospital',
  bio: 'Board-certified cardiologist with over 12 years of experience in treating cardiovascular diseases. Specializing in preventive cardiology and heart failure management.',
  yearsExperience: 12,
  education: [
    'MD, Harvard Medical School',
    'Residency, Massachusetts General Hospital',
    'Fellowship in Cardiology, Johns Hopkins Hospital'
  ],
  freeCommunityHours: 120,
  rating: 4.9,
  availability: ['Mon 9-5', 'Wed 9-5', 'Fri 9-1']
};

interface DoctorProfileProps {
  doctor?: Doctor;
}

const DoctorProfile: React.FC<DoctorProfileProps> = ({ doctor = mockDoctor }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<Doctor | null>(null);
  const [editedDoctor, setEditedDoctor] = useState(doctor);

  useEffect(() => {
    fetchProfile();

    // Subscribe to profile changes for real-time updates
    const channel = supabase
      .channel('doctor-profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          if (payload.new && payload.new.id === profileData?.id) {
            const updatedProfile: Doctor = {
              ...profileData,
              name: payload.new.full_name,
              bio: payload.new.bio || profileData.bio,
              specialty: payload.new.specialty || profileData.specialty,
              hospital: payload.new.hospital || profileData.hospital,
              yearsExperience: payload.new.years_experience || profileData.yearsExperience,
              education: payload.new.education || profileData.education,
              availability: payload.new.availability || profileData.availability,
              freeCommunityHours: payload.new.free_community_hours || profileData.freeCommunityHours,
              rating: payload.new.rating || profileData.rating
            };
            setProfileData(updatedProfile);
            setEditedDoctor(updatedProfile);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please log in to view your profile');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      const doctorProfile: Doctor = {
        id: profile.id,
        name: profile.full_name,
        email: user.email || '',
        role: 'doctor',
        specialty: profile.specialty || mockDoctor.specialty,
        hospital: profile.hospital || mockDoctor.hospital,
        bio: profile.bio || mockDoctor.bio,
        yearsExperience: profile.years_experience || mockDoctor.yearsExperience,
        education: profile.education || mockDoctor.education,
        freeCommunityHours: profile.free_community_hours || mockDoctor.freeCommunityHours,
        rating: profile.rating || mockDoctor.rating,
        availability: profile.availability || mockDoctor.availability,
      };

      setProfileData(doctorProfile);
      setEditedDoctor(doctorProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfileData(mockDoctor);
      setEditedDoctor(mockDoctor);
    } finally {
      setLoading(false);
    }
  };

  const medicalSpecialties = [
    'Cardiology',
    'Oncology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Dermatology',
    'Psychiatry',
    'Radiology',
    'Anesthesiology',
    'Emergency Medicine',
    'General Practice',
    'Internal Medicine'
  ];

  const handleSave = async () => {
    if (!editedDoctor || !profileData) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editedDoctor.name,
          bio: editedDoctor.bio,
          specialty: editedDoctor.specialty,
          hospital: editedDoctor.hospital,
          years_experience: editedDoctor.yearsExperience,
          education: editedDoctor.education,
          availability: editedDoctor.availability,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editedDoctor.id);

      if (error) throw error;

      setProfileData(editedDoctor);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedDoctor(profileData || doctor);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Loading Profile...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button onClick={handleCancel} size="sm" variant="outline" disabled={saving}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {!isEditing ? (
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <UserAvatar name={editedDoctor.name} role="doctor" size="lg" />
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{editedDoctor.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <span>{editedDoctor.specialty}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {editedDoctor.hospital}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>{editedDoctor.rating}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{editedDoctor.yearsExperience} years exp.</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 text-amber-500 mr-1" />
                    <span>{editedDoctor.freeCommunityHours}+ community hours</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editedDoctor.name}
                    onChange={(e) => setEditedDoctor({...editedDoctor, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedDoctor.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialty">Medical Specialty</Label>
                  <Select
                    value={editedDoctor.specialty}
                    onValueChange={(value) => setEditedDoctor({...editedDoctor, specialty: value})}
                  >
                    <SelectTrigger id="specialty">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicalSpecialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hospital">Hospital/Clinic</Label>
                  <Input
                    id="hospital"
                    value={editedDoctor.hospital}
                    onChange={(e) => setEditedDoctor({...editedDoctor, hospital: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={editedDoctor.yearsExperience}
                    onChange={(e) => setEditedDoctor({...editedDoctor, yearsExperience: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Biography</Label>
                <Textarea
                  id="bio"
                  value={editedDoctor.bio}
                  onChange={(e) => setEditedDoctor({...editedDoctor, bio: e.target.value})}
                  rows={4}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Tabs defaultValue="about">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Biography</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{editedDoctor.bio}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Education & Training</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {editedDoctor.education?.map((edu, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Award className="h-5 w-5 text-primary mt-0.5" />
                    <span>{edu}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="achievements" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Service</CardTitle>
              <CardDescription>
                Providing free healthcare services to underserved communities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">
                      Total community service hours
                    </span>
                    <span className="text-sm font-medium">
                      {editedDoctor.freeCommunityHours} hours
                    </span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="flex flex-col items-center p-4 bg-accent rounded-lg">
                    <Medal className="h-8 w-8 text-amber-500 mb-2" />
                    <p className="text-sm font-medium">Top 5% of doctors</p>
                    <p className="text-xs text-muted-foreground">Community service ranking</p>
                  </div>
                  
                  <div className="flex flex-col items-center p-4 bg-accent rounded-lg">
                    <ThumbsUp className="h-8 w-8 text-primary mb-2" />
                    <p className="text-sm font-medium">98% Satisfaction</p>
                    <p className="text-xs text-muted-foreground">Patient feedback</p>
                  </div>
                  
                  <div className="flex flex-col items-center p-4 bg-accent rounded-lg">
                    <Users className="h-8 w-8 text-secondary mb-2" />
                    <p className="text-sm font-medium">500+ Patients</p>
                    <p className="text-xs text-muted-foreground">Helped through free service</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="availability" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Availability</CardTitle>
              <CardDescription>
                Book a consultation during these hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {editedDoctor.availability?.map((slot, index) => (
                  <div key={index} className="flex items-center p-3 border rounded-md">
                    <Calendar className="h-5 w-5 text-primary mr-2" />
                    <span>{slot}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4">View All Available Slots</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Reviews</CardTitle>
              <CardDescription>
                What patients are saying about Dr. {editedDoctor.name.split(' ')[1]}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <UserAvatar name={`Patient ${i + 1}`} role="patient" size="sm" />
                        <div>
                          <p className="text-sm font-medium">Patient {i + 1}</p>
                          <div className="flex text-yellow-500 text-xs">
                            {Array(5).fill(0).map((_, j) => (
                              <span key={j}>★</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">
                      {i === 0 ? 
                        "Dr. Smith was incredibly thorough and took the time to explain everything. I felt truly cared for during my appointment." :
                        i === 1 ?
                        "Very professional and knowledgeable. The virtual consultation was convenient and Dr. Smith followed up promptly with additional information." :
                        "Excellent bedside manner and very attentive. Dr. Smith made complex medical issues easy to understand."
                      }
                    </p>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full">Load More Reviews</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorProfile;
