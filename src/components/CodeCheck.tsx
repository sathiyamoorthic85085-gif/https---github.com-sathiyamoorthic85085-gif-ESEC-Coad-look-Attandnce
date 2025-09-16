
"use client";

import { useState, useTransition, useRef, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Camera, X, CheckCircle, XCircle, Wand2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { generateDressCodeRecommendations } from '@/ai/flows/generate-dress-code-recommendations';
import ResultsTable from './ResultsTable';
import type { AttendanceRecord } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockTimetables } from '@/lib/mock-data';

// Roboflow has been removed as it's not a standard library.
// We will simulate the detection result.

interface DetectionResult {
  compliant: boolean;
  violation?: string;
  confidence: number;
}

export default function CodeCheck() {
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [isPending, startTransition] = useTransition();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("1");

  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const timetable = useMemo(() => {
    if (!user) return null;
    return mockTimetables.find(t => t.classId === user.classId || t.departmentId === (user.department && mockDepartments.find(d => d.name === user.department)?.id));
  }, [user]);

   const fetchAttendance = useCallback(async () => {
    try {
        const response = await fetch('/api/predictions');
        if (response.ok) {
            const data = await response.json();
            // This is a temporary transform. In a real app, the backend should return the expected structure.
            const transformedData: AttendanceRecord[] = data.map((p: any) => ({
                id: p.id,
                userId: p.user_id,
                name: p.user?.name || 'Unknown User',
                date: new Date(p.created_at).toLocaleDateString(),
                imageUrl: p.user?.imageUrl || `https://picsum.photos/seed/${p.user_id}/40/40`,
                periods: [
                    { period: 1, subject: 'Data Structures', status: p.label === 'compliant' ? 'Compliant' : 'Non-Compliant', violation: p.label !== 'compliant' ? 'Violation detected' : undefined },
                    { period: 2, subject: 'Algorithms', status: 'Pending' },
                    { period: 3, subject: 'Database Systems', status: 'Pending' },
                    { period: 4, subject: 'Operating Systems', status: 'Pending' },
                ]
            }));
            setAttendanceData(transformedData);
        } else {
            console.error("Failed to fetch attendance");
        }
    } catch (error) {
        console.error("Error fetching attendance:", error);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
    const interval = setInterval(fetchAttendance, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [fetchAttendance]);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Camera API not supported');
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support the camera API.',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };
    getCameraPermission();
  }, [toast]);

  const handleRemoveImage = () => {
    setImagePreview(null);
    setDetectionResult(null);
    setRecommendations(null);
  };

  const handleCaptureAndDetect = async () => {
    if (!videoRef.current || !user) {
      toast({ title: 'Error', description: 'Camera or user not available.', variant: 'destructive' });
      return;
    }

    setIsProcessing(true);
    setDetectionResult(null);
    setRecommendations(null);

    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    const capturedImage = canvas.toDataURL('image/jpeg');
    setImagePreview(capturedImage);
    
    try {
      // Simulate Roboflow API call result
      const isCompliant = Math.random() > 0.3; // 70% chance of being compliant
      const confidence = Math.random() * (0.98 - 0.7) + 0.7; // Random confidence between 70% and 98%
      const violation = isCompliant ? undefined : "Improper uniform";

      setDetectionResult({ compliant: isCompliant, violation, confidence });
      
      // Save prediction to our own DB
      const response = await fetch('/api/predictions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              userId: user.id,
              label: isCompliant ? 'compliant' : 'non_compliant',
              confidence: confidence,
              imageId: 'live_capture' // In a real app, you'd upload the image and get an ID
          })
      });

      if (response.ok) {
        toast({ title: "Analysis Complete", description: `Compliance: ${isCompliant ? 'Yes' : 'No'}. Record saved.` });
        fetchAttendance(); // Refetch attendance to update the table
      } else {
        throw new Error('Failed to save the prediction.');
      }

      if (!isCompliant) {
        startTransition(async () => {
          try {
            const recommendationsResult = await generateDressCodeRecommendations({ detectedViolations: violation! });
            setRecommendations(recommendationsResult.recommendations);
          } catch (error) {
            console.error("AI recommendation failed:", error);
            setRecommendations("Could not generate recommendations at this time.");
          }
        });
      }

    } catch (error: any) {
      console.error("Processing failed:", error);
      toast({ title: "Analysis Failed", description: error.message || "An unknown error occurred.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const periodOptions = useMemo(() => {
    if (timetable?.schedule) {
      return timetable.schedule.slice(0, 4).map(p => ({
        value: p.period.toString(),
        label: `Period ${p.period}: ${p.subject}`
      }));
    }
    return [
      { value: "1", label: "Period 1" },
      { value: "2", label: "Period 2" },
      { value: "3", label: "Period 3" },
      { value: "4", label: "Period 4" },
    ];
  }, [timetable]);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Uniform Check</CardTitle>
          <CardDescription>Use the camera to verify dress code compliance and mark attendance for a specific period.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col items-center justify-center gap-6">
          <div className="relative w-full max-w-sm">
            {imagePreview ? (
                <>
                    <Image
                        src={imagePreview}
                        alt="Captured image"
                        width={400}
                        height={400}
                        className="rounded-lg object-cover aspect-square"
                    />
                    <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 rounded-full h-8 w-8"
                        onClick={handleRemoveImage}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </>
            ) : (
                <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
                </div>
            )}
             {hasCameraPermission === false && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <AlertDescription>
                    Please allow camera access in your browser to use this feature.
                  </AlertDescription>
                </Alert>
            )}
          </div>

          <div className="w-full max-w-sm space-y-4">
            <div>
              <Label htmlFor="period-select">Select Period</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger id="period-select">
                      <SelectValue placeholder="Select a period" />
                  </SelectTrigger>
                  <SelectContent>
                      {periodOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
            </div>
          
            <Button onClick={handleCaptureAndDetect} disabled={hasCameraPermission !== true || isProcessing} className="w-full">
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                  <>
                      <Camera className="mr-2 h-4 w-4" />
                      Scan for Period {selectedPeriod}
                  </>
              )}
            </Button>
          </div>


          {detectionResult && (
             <Card className="w-full max-w-sm bg-card">
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        {detectionResult.compliant ? (
                            <CheckCircle className="h-10 w-10 text-green-500" />
                        ) : (
                            <XCircle className="h-10 w-10 text-red-500" />
                        )}
                        <div>
                            <h3 className="font-semibold text-lg">
                                {detectionResult.compliant ? "Dress Code Compliant" : "Dress Code Violation"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {detectionResult.compliant ? `Attendance marked for Period ${selectedPeriod}.` : detectionResult.violation}
                            </p>
                        </div>
                    </div>
                </CardContent>
             </Card>
          )}

          {(isPending || recommendations) && (
            <Card className="w-full max-w-sm border-accent">
                <CardHeader className="flex-row items-center gap-2 space-y-0 pb-2">
                    <Wand2 className="h-5 w-5 text-accent" />
                    <CardTitle>AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                    {isPending ? (
                      <p className="text-sm text-muted-foreground flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</p>
                    ) : (
                      <p className="text-sm">{recommendations}</p>
                    )}
                </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
      
      <div className="flex flex-col gap-8 mt-8 md:mt-0">
        <h2 className="text-3xl font-bold tracking-tight">Today's Live Attendance</h2>
        <ResultsTable attendanceData={attendanceData} />
      </div>
    </div>
  );
}
