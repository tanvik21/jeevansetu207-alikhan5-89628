import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MessageCircle, FileText, Search, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="md:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Access your most-used features</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-20 flex flex-col" onClick={() => navigate('/symptom-checker')}>
            <Search className="h-5 w-5 mb-2" />
            <span className="text-sm">Symptom Check</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col">
            <Calendar className="h-5 w-5 mb-2" />
            <span className="text-sm">Book Appointment</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col" onClick={() => navigate('/health-records')}>
            <FileText className="h-5 w-5 mb-2" />
            <span className="text-sm">Health Records</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col">
            <MessageCircle className="h-5 w-5 mb-2" />
            <span className="text-sm">Chat with AI</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col col-span-2 bg-red-flag/5 border-red-flag/30 hover:bg-red-flag/10">
            <MapPin className="h-5 w-5 mb-2 text-red-flag" />
            <span className="text-sm text-red-flag font-medium">Find Cancer Screening</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;