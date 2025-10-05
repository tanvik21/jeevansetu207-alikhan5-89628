import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import UserAvatar from '../shared/UserAvatar';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  GraduationCap, 
  Calendar, 
  Award, 
  BookOpen, 
  FileText, 
  Activity,
  Edit,
  Save,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InternProfileData {
  name: string;
  email: string;
  phone: string;
  hospital: string;
  medicalSchool: string;
  yearOfResidency: number;
  specialty: string;
  supervisor: string;
  bio: string;
  interests: string[];
}

const InternProfile: React.FC = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<InternProfileData>({
    name: 'Alex Johnson',
    email: 'alex.johnson@medical.edu',
    phone: '+1 (555) 123-4567',
    hospital: 'City General Hospital',
    medicalSchool: 'City Medical School',
    yearOfResidency: 2,
    specialty: 'Internal Medicine',
    supervisor: 'Dr. Sarah Williams',
    bio: 'Passionate medical intern focused on AI-assisted diagnostics and patient care. Interested in oncology and palliative care.',
    interests: ['AI Diagnostics', 'Oncology', 'Palliative Care', 'Telemedicine']
  });

  const [editedData, setEditedData] = useState(profileData);

  const handleSave = () => {
    setProfileData(editedData);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setEditedData(profileData);
    setIsEditing(false);
  };

  const achievements = [
    { title: 'First AI Case Review', date: '2025-01-15', icon: Award },
    { title: 'Completed 50 Case Studies', date: '2025-03-10', icon: BookOpen },
    { title: 'Oncology Training Module', date: '2025-04-01', icon: Activity },
  ];

  const learningProgress = [
    { module: 'AI Diagnostic Interpretation', progress: 75 },
    { module: 'Telemedicine Best Practices', progress: 90 },
    { module: 'Electronic Health Records', progress: 40 },
    { module: 'Oncology Diagnostics', progress: 25 },
  ];

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Intern Profile</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <UserAvatar name={profileData.name} role="intern" size="lg" />
                <div>
                  <CardTitle className="text-2xl">{profileData.name}</CardTitle>
                  <CardDescription>Medical Intern, Year {profileData.yearOfResidency}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    {isEditing ? (
                      <div className="flex-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={editedData.email}
                          onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                        />
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{profileData.email}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    {isEditing ? (
                      <div className="flex-1">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={editedData.phone}
                          onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                        />
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{profileData.phone}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    {isEditing ? (
                      <div className="flex-1">
                        <Label htmlFor="hospital">Hospital</Label>
                        <Input
                          id="hospital"
                          value={editedData.hospital}
                          onChange={(e) => setEditedData({ ...editedData, hospital: e.target.value })}
                        />
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-muted-foreground">Hospital</p>
                        <p className="font-medium">{profileData.hospital}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-muted-foreground" />
                    {isEditing ? (
                      <div className="flex-1">
                        <Label htmlFor="medicalSchool">Medical School</Label>
                        <Input
                          id="medicalSchool"
                          value={editedData.medicalSchool}
                          onChange={(e) => setEditedData({ ...editedData, medicalSchool: e.target.value })}
                        />
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-muted-foreground">Medical School</p>
                        <p className="font-medium">{profileData.medicalSchool}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                    {isEditing ? (
                      <div className="flex-1">
                        <Label htmlFor="specialty">Specialty</Label>
                        <Input
                          id="specialty"
                          value={editedData.specialty}
                          onChange={(e) => setEditedData({ ...editedData, specialty: e.target.value })}
                        />
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-muted-foreground">Specialty</p>
                        <p className="font-medium">{profileData.specialty}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    {isEditing ? (
                      <div className="flex-1">
                        <Label htmlFor="supervisor">Supervisor</Label>
                        <Input
                          id="supervisor"
                          value={editedData.supervisor}
                          onChange={(e) => setEditedData({ ...editedData, supervisor: e.target.value })}
                        />
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-muted-foreground">Supervisor</p>
                        <p className="font-medium">{profileData.supervisor}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {isEditing ? (
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editedData.bio}
                      onChange={(e) => setEditedData({ ...editedData, bio: e.target.value })}
                      rows={4}
                    />
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Bio</p>
                    <p className="text-sm">{profileData.bio}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Areas of Interest</p>
                <div className="flex flex-wrap gap-2">
                  {profileData.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Education & Training</CardTitle>
              <CardDescription>Your academic background and medical training</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <GraduationCap className="h-6 w-6 text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{profileData.medicalSchool}</h3>
                    <p className="text-sm text-muted-foreground">Medical Degree (M.D.)</p>
                    <p className="text-sm text-muted-foreground">2021 - 2025</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Building2 className="h-6 w-6 text-primary mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{profileData.hospital}</h3>
                    <p className="text-sm text-muted-foreground">Medical Internship - Year {profileData.yearOfResidency}</p>
                    <p className="text-sm text-muted-foreground">Specialty: {profileData.specialty}</p>
                    <p className="text-sm text-muted-foreground">Supervisor: {profileData.supervisor}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Certifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Award className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">Basic Life Support (BLS)</p>
                      <p className="text-xs text-muted-foreground">Valid until 2026</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Award className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">Advanced Cardiac Life Support (ACLS)</p>
                      <p className="text-xs text-muted-foreground">Valid until 2026</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Achievements & Milestones</CardTitle>
              <CardDescription>Your accomplishments during internship</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg card-hover">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(achievement.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">78%</p>
                      <p className="text-sm text-muted-foreground">Training Completed</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">45</p>
                      <p className="text-sm text-muted-foreground">Cases Observed</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">12</p>
                      <p className="text-sm text-muted-foreground">Cases Assisted</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>Track your training modules and completion status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {learningProgress.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{item.module}</h3>
                      <span className="text-sm text-muted-foreground">{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Overall Progress</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Progress value={58} className="h-3" />
                  </div>
                  <span className="text-lg font-bold">58%</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Keep up the great work! Complete more modules to enhance your skills.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InternProfile;
