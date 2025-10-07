import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UserAvatar from '../shared/UserAvatar';
import { Edit, Save, X, Award, Target, Star, TrendingUp, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface InternProfileData {
  id: string;
  full_name: string;
  email: string;
  role: string;
  bio?: string;
  phone?: string;
  specialty?: string;
  hospital?: string;
  years_experience?: number;
  study_year?: number;
  certifications?: string[];
  skills?: string[];
  learning_goals?: string[];
  avatar_url?: string;
  free_community_hours?: number;
  rating?: number;
}

const InternProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<InternProfileData | null>(null);
  const [editedData, setEditedData] = useState<InternProfileData | null>(null);
  const [newCertification, setNewCertification] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newGoal, setNewGoal] = useState('');

  const medicalSpecialties = [
    'General Medicine',
    'Cardiology',
    'Oncology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Dermatology',
    'Psychiatry',
    'Emergency Medicine',
    'Internal Medicine'
  ];

  useEffect(() => {
    fetchProfile();

    // Subscribe to profile changes for real-time updates
    const channel = supabase
      .channel('intern-profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          if (payload.new) {
            const updatedProfile: InternProfileData = {
              ...payload.new as any,
              email: profileData?.email || ''
            };
            setProfileData(updatedProfile);
            setEditedData(updatedProfile);
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

      const profileWithEmail: InternProfileData = {
        ...profile,
        email: user.email || '',
      };

      setProfileData(profileWithEmail);
      setEditedData(profileWithEmail);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editedData) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editedData.full_name,
          bio: editedData.bio,
          phone: editedData.phone,
          specialty: editedData.specialty,
          hospital: editedData.hospital,
          years_experience: editedData.years_experience,
          study_year: editedData.study_year,
          certifications: editedData.certifications,
          skills: editedData.skills,
          learning_goals: editedData.learning_goals,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editedData.id);

      if (error) throw error;

      setProfileData(editedData);
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
    setEditedData(profileData);
    setIsEditing(false);
  };

  const addCertification = () => {
    if (newCertification.trim() && editedData) {
      setEditedData({
        ...editedData,
        certifications: [...(editedData.certifications || []), newCertification.trim()],
      });
      setNewCertification('');
    }
  };

  const removeCertification = (index: number) => {
    if (editedData) {
      const updated = [...(editedData.certifications || [])];
      updated.splice(index, 1);
      setEditedData({ ...editedData, certifications: updated });
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && editedData) {
      setEditedData({
        ...editedData,
        skills: [...(editedData.skills || []), newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    if (editedData) {
      const updated = [...(editedData.skills || [])];
      updated.splice(index, 1);
      setEditedData({ ...editedData, skills: updated });
    }
  };

  const addGoal = () => {
    if (newGoal.trim() && editedData) {
      setEditedData({
        ...editedData,
        learning_goals: [...(editedData.learning_goals || []), newGoal.trim()],
      });
      setNewGoal('');
    }
  };

  const removeGoal = (index: number) => {
    if (editedData) {
      const updated = [...(editedData.learning_goals || [])];
      updated.splice(index, 1);
      setEditedData({ ...editedData, learning_goals: updated });
    }
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

  if (!editedData) return null;

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
              <UserAvatar name={editedData.full_name} role="intern" size="lg" />
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{editedData.full_name}</h1>
                <p className="text-muted-foreground">{editedData.email}</p>
                <div className="flex items-center gap-2 text-muted-foreground mb-2 mt-2">
                  {editedData.study_year && (
                    <>
                      <span>MBBS Year {editedData.study_year}</span>
                      {(editedData.specialty || editedData.hospital) && <span>•</span>}
                    </>
                  )}
                  {editedData.specialty && (
                    <>
                      <span>Specializing in {editedData.specialty}</span>
                      {editedData.hospital && <span>•</span>}
                    </>
                  )}
                  {editedData.hospital && <span>{editedData.hospital}</span>}
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>{editedData.rating || 0}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{editedData.years_experience || 0} years exp.</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-primary mr-1" />
                    <span>{editedData.free_community_hours || 0} learning hours</span>
                  </div>
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
                    value={editedData.full_name}
                    onChange={(e) => setEditedData({...editedData, full_name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={editedData.phone || ''}
                    onChange={(e) => setEditedData({...editedData, phone: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialty">Area of Interest</Label>
                  <Select
                    value={editedData.specialty || ''}
                    onValueChange={(value) => setEditedData({...editedData, specialty: value})}
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
                  <Label htmlFor="hospital">Institution</Label>
                  <Input
                    id="hospital"
                    value={editedData.hospital || ''}
                    onChange={(e) => setEditedData({...editedData, hospital: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={editedData.years_experience || 0}
                    onChange={(e) => setEditedData({...editedData, years_experience: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="study_year">MBBS Study Year</Label>
                  <Select
                    value={editedData.study_year?.toString() || ''}
                    onValueChange={(value) => setEditedData({...editedData, study_year: parseInt(value)})}
                  >
                    <SelectTrigger id="study_year">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Year 1</SelectItem>
                      <SelectItem value="2">Year 2</SelectItem>
                      <SelectItem value="3">Year 3</SelectItem>
                      <SelectItem value="4">Year 4</SelectItem>
                      <SelectItem value="5">Year 5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">About Me</Label>
                <Textarea
                  id="bio"
                  value={editedData.bio || ''}
                  onChange={(e) => setEditedData({...editedData, bio: e.target.value})}
                  rows={4}
                  placeholder="Tell us about yourself, your interests, and career goals..."
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Tabs defaultValue="certifications">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="goals">Learning Goals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="certifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Certifications & Training</CardTitle>
              <CardDescription>Add your completed certifications and training programs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., BLS Certification, ACLS, etc."
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                  />
                  <Button onClick={addCertification}>Add</Button>
                </div>
              )}
              
              <div className="space-y-2">
                {editedData.certifications && editedData.certifications.length > 0 ? (
                  editedData.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        <span>{cert}</span>
                      </div>
                      {isEditing && (
                        <Button variant="ghost" size="sm" onClick={() => removeCertification(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">No certifications added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="skills" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Skills & Competencies</CardTitle>
              <CardDescription>Track your developing medical skills</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Patient Assessment, Suturing, etc."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button onClick={addSkill}>Add</Button>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {editedData.skills && editedData.skills.length > 0 ? (
                  editedData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-sm py-2 px-3">
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeSkill(index)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center w-full py-4">No skills added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="goals" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Goals</CardTitle>
              <CardDescription>Set and track your professional development goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Master ultrasound imaging techniques"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                  />
                  <Button onClick={addGoal}>Add</Button>
                </div>
              )}
              
              <div className="space-y-3">
                {editedData.learning_goals && editedData.learning_goals.length > 0 ? (
                  editedData.learning_goals.map((goal, index) => (
                    <div key={index} className="flex items-start justify-between p-3 border rounded-md">
                      <div className="flex items-start gap-2">
                        <Target className="h-5 w-5 text-primary mt-0.5" />
                        <span>{goal}</span>
                      </div>
                      {isEditing && (
                        <Button variant="ghost" size="sm" onClick={() => removeGoal(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">No learning goals set yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InternProfile;