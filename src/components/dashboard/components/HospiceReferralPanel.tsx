import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Send, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface Referral {
  id: string;
  hospiceName: string;
  status: 'sent' | 'accepted' | 'in-progress';
  date: string;
}

const HospiceReferralPanel: React.FC = () => {
  const [selectedHospice, setSelectedHospice] = useState<string>('');
  const [referrals, setReferrals] = useState<Referral[]>([
    {
      id: '1',
      hospiceName: 'Karunashraya',
      status: 'in-progress',
      date: '2025-04-10'
    }
  ]);

  const hospicePartners = [
    'Karunashraya',
    'CanSupport',
    'Cipla Palliative Care',
    'Shanti Avedna Sadan',
    'Pallium India'
  ];

  const handleReferral = () => {
    if (!selectedHospice) {
      toast.error('Please select a hospice partner');
      return;
    }

    const newReferral: Referral = {
      id: Date.now().toString(),
      hospiceName: selectedHospice,
      status: 'sent',
      date: new Date().toISOString()
    };

    setReferrals([newReferral, ...referrals]);
    toast.success(`Referral sent to ${selectedHospice}`);
    setSelectedHospice('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-blue-500';
      case 'accepted':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-purple-500';
      default:
        return 'bg-muted';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Referral Sent';
      case 'accepted':
        return 'Accepted';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card className="border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
          <Heart className="h-5 w-5" />
          Palliative / Hospice Referral
        </CardTitle>
        <CardDescription>
          Coordinate compassionate end-of-life care with partner hospices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Referral Form */}
        <div className="space-y-4 p-4 bg-accent/30 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Hospice Partner</label>
            <Select value={selectedHospice} onValueChange={setSelectedHospice}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a hospice..." />
              </SelectTrigger>
              <SelectContent>
                {hospicePartners.map((hospice) => (
                  <SelectItem key={hospice} value={hospice}>
                    {hospice}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-background/50 rounded p-3 text-sm space-y-1">
            <p className="font-medium">Auto-generated Referral Summary:</p>
            <p className="text-muted-foreground">• Patient: Sarah Williams, 62F</p>
            <p className="text-muted-foreground">• Diagnosis: Stage IV Pancreatic Cancer</p>
            <p className="text-muted-foreground">• Last Treatment: Palliative chemo stopped 2 weeks ago</p>
            <p className="text-muted-foreground">• Current Symptoms: Severe pain (8/10), fatigue, loss of appetite</p>
          </div>

          <Button onClick={handleReferral} className="w-full bg-purple-600 hover:bg-purple-700">
            <Send className="h-4 w-4 mr-2" />
            Refer to Hospice
          </Button>
        </div>

        {/* Status Tracker */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Recent Referrals</h4>
          {referrals.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No referrals yet</p>
          ) : (
            referrals.map((referral) => (
              <div key={referral.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${getStatusColor(referral.status)}`} />
                  <div>
                    <p className="font-medium text-sm">{referral.hospiceName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(referral.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {getStatusLabel(referral.status)}
                </Badge>
              </div>
            ))
          )}
        </div>

        {/* Status Flow */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <Send className="h-3 w-3" />
            <span>Sent</span>
          </div>
          <ArrowRight className="h-3 w-3" />
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Accepted</span>
          </div>
          <ArrowRight className="h-3 w-3" />
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>In Progress</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HospiceReferralPanel;
