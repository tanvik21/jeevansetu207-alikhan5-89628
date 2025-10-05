
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { AIAnalysis } from '@/types';
import { 
  Brain, 
  Check, 
  Clock, 
  FileUp, 
  Stethoscope, 
  ArrowRight, 
  AlertTriangle, 
  Shield, 
  Lightbulb
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

// Mock AI analysis response
const mockAnalysis: AIAnalysis = {
  id: '1',
  patientId: '101',
  createdAt: new Date().toISOString(),
  symptoms: ['Headache', 'Fever', 'Fatigue'],
  possibleConditions: [
    { condition: 'Common Cold', probability: 0.85 },
    { condition: 'Influenza', probability: 0.65 },
    { condition: 'Sinusitis', probability: 0.40 },
  ],
  recommendedTests: ['Complete Blood Count', 'Inflammation markers'],
  severity: 'medium',
  doctorVerified: false
};

const SymptomChecker: React.FC = () => {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState('text');
  const [showOncologyAlert, setShowOncologyAlert] = useState(false);
  
  // Oncology keywords detection
  const oncologyKeywords = ['lump', 'chronic cough', 'weight loss', 'unexplained', 'tumor', 'mass', 'cancer', 'swelling', 'bleeding'];
  
  const checkForOncologyKeywords = (text: string) => {
    const lowerText = text.toLowerCase();
    return oncologyKeywords.some(keyword => lowerText.includes(keyword));
  };
  
  const handleAnalyze = () => {
    if (!symptoms.trim()) {
      toast.error('Please describe your symptoms first');
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      setAnalysisResult(mockAnalysis);
      setIsAnalyzing(false);
      toast.success('Analysis complete - redirecting to dashboard');
      
      // Redirect to dashboard after analysis
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }, 2000);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, upload and process the file
      toast.success(`Uploaded: ${file.name}`);
      setIsAnalyzing(true);
      
      setTimeout(() => {
        setAnalysisResult(mockAnalysis);
        setIsAnalyzing(false);
        toast.success('Image analysis complete');
      }, 2500);
    }
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-amber-500';
      case 'high': return 'text-red-flag';
      default: return 'text-muted-foreground';
    }
  };
  
  const getSeverityBgColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-50 border-green-200';
      case 'medium': return 'bg-amber-50 border-amber-200';
      case 'high': return 'bg-red-flag/10 border-red-flag';
      default: return 'bg-muted/50';
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span>AI Symptom Checker</span>
          </CardTitle>
          <CardDescription>
            Describe your symptoms or upload medical images for AI analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="text" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="text">
                <Stethoscope className="h-4 w-4 mr-2" />
                Describe Symptoms
              </TabsTrigger>
              <TabsTrigger value="image">
                <FileUp className="h-4 w-4 mr-2" />
                Upload Images
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="text">
              <Textarea
                placeholder="Describe your symptoms in detail. For example: I've had a headache for the past 3 days, along with fever and fatigue..."
                className="min-h-[150px] mb-4"
                value={symptoms}
                onChange={(e) => {
                  const value = e.target.value;
                  setSymptoms(value);
                  if (checkForOncologyKeywords(value)) {
                    setShowOncologyAlert(true);
                  } else {
                    setShowOncologyAlert(false);
                  }
                }}
              />
              {showOncologyAlert && (
                <div className="bg-red-flag/10 border-l-4 border-red-flag p-4 rounded-md mb-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-flag mt-0.5" />
                    <div>
                      <p className="font-medium text-red-flag">Specialist Attention Required</p>
                      <p className="text-sm mt-1">Your input suggests a condition that requires specialist attention. The AI will flag this for your care team.</p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="image">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-3">
                    <FileUp className="h-10 w-10 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Click to upload an image</p>
                      <p className="text-sm text-muted-foreground">
                        Supported formats: JPG, PNG, DICOM
                      </p>
                    </div>
                    <Button variant="outline" className="mt-2">Browse files</Button>
                  </div>
                </label>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                * For X-rays, MRIs, CT scans, or dermatology images
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || (activeTab === 'text' && !symptoms.trim())}
          >
            {isAnalyzing ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Analyze with AI
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {analysisResult && (
        <Card className={analysisResult.severity === 'high' ? 'border-red-flag' : 'border-secondary/20'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-secondary" />
              AI Analysis Results
            </CardTitle>
            <CardDescription>
              This is an automated analysis and should be verified by a healthcare professional
            </CardDescription>
          </CardHeader>
          {analysisResult.severity === 'high' && (
            <div className="px-6">
              <div className="bg-red-flag/10 border-l-4 border-red-flag p-4 rounded-md mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-flag" />
                  <span className="font-semibold text-red-flag">HIGH RISK - Requires URGENT Specialist Review</span>
                </div>
              </div>
            </div>
          )}
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Reported Symptoms</h3>
              <div className="flex flex-wrap gap-2">
                {analysisResult.symptoms.map((symptom, index) => (
                  <div key={index} className="bg-accent px-3 py-1 rounded-full text-sm">
                    {symptom}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Possible Conditions</h3>
              <div className="space-y-3">
                {analysisResult.possibleConditions.map((condition, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{condition.condition}</span>
                      <span>{Math.round(condition.probability * 100)}% match</span>
                    </div>
                    <Progress value={condition.probability * 100} className="h-2" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                * Probabilities represent pattern matches, not definitive diagnoses
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className={getSeverityBgColor(analysisResult.severity)}>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className={`rounded-full p-2 mb-2 ${getSeverityColor(analysisResult.severity)}`}>
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <h4 className="font-medium">Severity Level</h4>
                  <p className={`capitalize font-medium ${getSeverityColor(analysisResult.severity)}`}>
                    {analysisResult.severity === 'high' ? 'High Risk' : analysisResult.severity}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/50">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="rounded-full p-2 mb-2 text-blue-500 bg-accent">
                    <Shield className="h-5 w-5" />
                  </div>
                  <h4 className="font-medium">Doctor Verified</h4>
                  <p className="font-medium text-muted-foreground">
                    {analysisResult.doctorVerified ? (
                      <span className="text-green-500">Yes</span>
                    ) : (
                      <span>Pending</span>
                    )}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/50">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="rounded-full p-2 mb-2 text-primary bg-accent">
                    <Clock className="h-5 w-5" />
                  </div>
                  <h4 className="font-medium">Generated On</h4>
                  <p className="text-muted-foreground">
                    {new Date(analysisResult.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {analysisResult.recommendedTests && (
              <div>
                <h3 className="font-medium mb-2">Recommended Tests</h3>
                <ul className="space-y-1">
                  {analysisResult.recommendedTests.map((test, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      {test}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button className="w-full sm:w-auto">
              <Stethoscope className="mr-2 h-4 w-4" />
              Consult a Doctor
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              Save to Health Records
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default SymptomChecker;
