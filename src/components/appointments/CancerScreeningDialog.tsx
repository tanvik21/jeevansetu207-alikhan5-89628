import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { toast } from 'sonner';

interface CancerScreeningDialogProps {
  children?: React.ReactNode;
}

const CancerScreeningDialog: React.FC<CancerScreeningDialogProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [screeningType, setScreeningType] = useState('');

  const screeningTypes = [
    'Breast Cancer Screening',
    'Cervical Cancer Screening',
    'Colorectal Cancer Screening',
    'Lung Cancer Screening',
    'Prostate Cancer Screening',
    'Skin Cancer Screening',
    'General Cancer Screening'
  ];

  const mockCenters = [
    {
      id: 1,
      name: 'City Cancer Screening Center',
      address: '123 Medical District, Downtown',
      distance: '2.3 km',
      phone: '555-0101',
      hours: 'Mon-Fri: 8AM-6PM',
      types: ['Breast', 'Cervical', 'Colorectal'],
      waitTime: '2-3 days'
    },
    {
      id: 2,
      name: 'Regional Health Screening Facility',
      address: '456 Healthcare Ave, Medical Plaza',
      distance: '5.1 km',
      phone: '555-0202',
      hours: 'Mon-Sat: 7AM-8PM',
      types: ['All Types'],
      waitTime: 'Same day'
    },
    {
      id: 3,
      name: 'Community Wellness Screening Center',
      address: '789 Wellness Blvd, Health District',
      distance: '7.8 km',
      phone: '555-0303',
      hours: 'Mon-Fri: 9AM-5PM',
      types: ['Breast', 'Prostate', 'Skin'],
      waitTime: '1 week'
    }
  ];

  const handleSearch = () => {
    if (!location && !screeningType) {
      toast.error('Please enter your location or select a screening type');
      return;
    }
    
    toast.success('Searching for screening centers near you...');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="bg-red-flag/5 border-red-flag/30 hover:bg-red-flag/10">
            <MapPin className="h-4 w-4 mr-2 text-red-flag" />
            <span className="text-red-flag font-medium">Find Cancer Screening</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-red-flag">Find Cancer Screening Centers</DialogTitle>
          <DialogDescription>
            Locate nearby facilities offering cancer screening services
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Your Location</Label>
              <Input
                id="location"
                placeholder="Enter city or zip code"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="screening-type">Screening Type</Label>
              <Select value={screeningType} onValueChange={setScreeningType}>
                <SelectTrigger id="screening-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {screeningTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleSearch} className="w-full">
            <Navigation className="h-4 w-4 mr-2" />
            Search Nearby Centers
          </Button>

          <div className="space-y-3 mt-6">
            <h3 className="font-semibold text-sm">Screening Centers Near You</h3>
            {mockCenters.map((center) => (
              <div key={center.id} className="border rounded-lg p-4 space-y-3 hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold">{center.name}</h4>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{center.address}</span>
                      <span className="ml-2 text-primary font-medium">• {center.distance}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {center.waitTime}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  {center.types.map((type) => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    <span>{center.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{center.hours}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1" onClick={() => toast.success('Booking appointment...')}>
                    Book Screening
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.info('Opening directions...')}>
                    Get Directions
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancerScreeningDialog;