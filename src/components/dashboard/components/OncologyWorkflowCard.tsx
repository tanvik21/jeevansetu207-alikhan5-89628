import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileUp, FileText, Image, Calendar } from 'lucide-react';

const OncologyWorkflowCard: React.FC = () => {
  const uploadedReports = [
    { type: 'Biopsy Report', date: '2025-09-15', version: 'v2' },
    { type: 'MRI Scan', date: '2025-09-20', version: 'v1' }
  ];

  return (
    <Card className="border-red-flag/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-red-flag" />
            Oncology Workflow
          </CardTitle>
          <Badge variant="outline" className="bg-red-flag/10 text-red-flag border-red-flag">
            Active
          </Badge>
        </div>
        <CardDescription>
          Manage oncology-specific documents and reports
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Sections */}
        <div className="space-y-3">
          <div className="border-2 border-dashed rounded-lg p-4 hover:border-red-flag/50 transition-colors">
            <input
              type="file"
              id="biopsy-upload"
              accept=".pdf,.jpg,.png"
              className="hidden"
            />
            <label htmlFor="biopsy-upload" className="cursor-pointer">
              <div className="flex items-center gap-3">
                <FileUp className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Upload Biopsy Report</p>
                  <p className="text-xs text-muted-foreground">PDF, JPG, PNG (max 10MB)</p>
                </div>
              </div>
            </label>
          </div>

          <div className="border-2 border-dashed rounded-lg p-4 hover:border-red-flag/50 transition-colors">
            <input
              type="file"
              id="radiology-upload"
              accept=".pdf,.jpg,.png,.dcm"
              className="hidden"
            />
            <label htmlFor="radiology-upload" className="cursor-pointer">
              <div className="flex items-center gap-3">
                <Image className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">Upload Radiology/Imaging</p>
                  <p className="text-xs text-muted-foreground">X-ray, MRI, CT (DICOM supported)</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Uploaded Reports */}
        {uploadedReports.length > 0 && (
          <div className="pt-3 border-t">
            <h4 className="font-medium text-sm mb-3">Uploaded Documents</h4>
            <div className="space-y-2">
              {uploadedReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-accent/50 rounded">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{report.type}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(report.date).toLocaleDateString()}</span>
                        <Badge variant="outline" className="text-xs">{report.version}</Badge>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">View</Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Documents
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OncologyWorkflowCard;