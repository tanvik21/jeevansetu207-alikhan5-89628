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
import { MapPin, Phone, Clock, Navigation, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CancerScreeningDialogProps {
  children?: React.ReactNode;
}

const CancerScreeningDialog: React.FC<CancerScreeningDialogProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [screeningType, setScreeningType] = useState('');
  const [centers, setCenters] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const screeningTypes = [
    'Breast Cancer Screening',
    'Cervical Cancer Screening',
    'Colorectal Cancer Screening',
    'Lung Cancer Screening',
    'Prostate Cancer Screening',
    'Skin Cancer Screening',
    'General Cancer Screening'
  ];

  const handleSearch = async () => {
    if (!location.trim()) {
      toast.error('Please enter your location');
      return;
    }
    
    setIsSearching(true);
    toast.loading('Searching for screening centers near you...');

    try {
      const { data, error } = await supabase.functions.invoke('cancer-screening-locations', {
        body: { 
          location: location,
          screeningType: screeningType
        }
      });

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      console.log('Search results:', data);
      setCenters(data.centers || []);
      toast.dismiss();
      toast.success(`Found ${data.centers?.length || 0} screening centers near ${location}`);
    } catch (error) {
      console.error('Error searching for centers:', error);
      toast.dismiss();
      toast.error('Failed to search for centers. Please try again.');
    } finally {
      setIsSearching(false);
    }
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

          <Button onClick={handleSearch} className="w-full" disabled={isSearching}>
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Navigation className="h-4 w-4 mr-2" />
                Search Nearby Centers
              </>
            )}
          </Button>

          {centers.length > 0 && (
            <div className="space-y-3 mt-6">
              <h3 className="font-semibold text-sm">Screening Centers Near You</h3>
              {centers.map((center) => (
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancerScreeningDialog;