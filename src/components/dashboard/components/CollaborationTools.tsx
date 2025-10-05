import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, FileText, Send, Home, Pill, UserCog } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: string;
  role: 'doctor' | 'nurse' | 'hospice';
  message: string;
  timestamp: string;
  tags: string[];
}

const CollaborationTools: React.FC = () => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState<'doctor' | 'nurse' | 'hospice'>('doctor');
  const [messages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Dr. Ramesh Kumar',
      role: 'doctor',
      message: 'Patient responding well to current pain management protocol.',
      timestamp: '2025-04-17 09:30',
      tags: ['pain-management', 'oncology']
    },
    {
      id: '2',
      sender: 'Nurse Priya',
      role: 'nurse',
      message: 'Home visit completed. Family needs emotional support resources.',
      timestamp: '2025-04-17 14:15',
      tags: ['home-visit', 'family-support']
    },
    {
      id: '3',
      sender: 'Hospice Coordinator Maria',
      role: 'hospice',
      message: 'Scheduling weekly check-in with palliative care team.',
      timestamp: '2025-04-17 16:00',
      tags: ['palliative', 'scheduling']
    }
  ]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    toast.success(`Message sent to ${selectedRole} team`);
    setNewMessage('');
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'doctor':
        return 'bg-blue-500 text-white';
      case 'nurse':
        return 'bg-green-500 text-white';
      case 'hospice':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-muted';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          Collaboration Tools
        </CardTitle>
        <CardDescription>
          Coordinate with oncology and hospice care teams
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="messages" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="messages">Team Messages</TabsTrigger>
            <TabsTrigger value="notes">Shared Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-4">
            {/* Message List */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {messages.map((msg) => (
                <div key={msg.id} className="bg-accent/50 rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{msg.sender}</p>
                        <Badge className={`text-xs ${getRoleBadgeColor(msg.role)}`}>
                          {msg.role}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {msg.tags.map((tag) => (
                          <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                  </div>
                  <p className="text-sm">{msg.message}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 p-3 bg-accent/30 rounded-lg border">
              <p className="text-sm font-medium mb-2">Quick Actions</p>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <Home className="h-4 w-4 mr-2" />
                  Request Home Visit
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <Pill className="h-4 w-4 mr-2" />
                  Adjust Pain Meds
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <UserCog className="h-4 w-4 mr-2" />
                  Consult Specialist
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Update Care Plan
                </Button>
              </div>
            </div>

            {/* Message Input */}
            <div className="space-y-2">
              <div className="flex gap-2 items-center">
                <label className="text-sm font-medium">Send to:</label>
                <Select value={selectedRole} onValueChange={(value: any) => setSelectedRole(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="nurse">Nurse</SelectItem>
                    <SelectItem value="hospice">Hospice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder="Type your message to the care team..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="min-h-[80px]"
              />
              <Button onClick={handleSendMessage} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <div className="bg-accent/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Shared Patient Notes
                </h4>
                <Button size="sm" variant="outline">Edit</Button>
              </div>
              <div className="text-sm space-y-2 text-muted-foreground">
                <p><strong>Current Status:</strong> Patient in palliative phase, pain management optimized</p>
                <p><strong>Family Support:</strong> Daughter is primary caregiver, needs respite care options</p>
                <p><strong>Treatment Plan:</strong> Focus on comfort, weekly hospice nurse visits</p>
                <p><strong>Next Review:</strong> Team meeting scheduled for April 25, 2025</p>
              </div>
            </div>

            {/* Hospice Notes Section */}
            <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4 space-y-3 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <h4 className="font-semibold text-sm">Hospice Team Notes</h4>
              </div>
              <div className="text-sm space-y-2">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Last Visit:</strong> April 16, 2025 - Pain levels stable, family coping well
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Equipment:</strong> Hospital bed and oxygen concentrator delivered
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Next Steps:</strong> Social worker visit scheduled for emotional support counseling
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Last edited by Dr. Ramesh Kumar on April 17, 2025
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CollaborationTools;
