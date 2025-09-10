"use client";

import { useState, useTransition, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Camera, X, CheckCircle, XCircle, Wand2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { generateDressCodeRecommendations } from '@/ai/flows/generate-dress-code-recommendations';
import ResultsTable from './ResultsTable';
import type { AttendanceRecord, PeriodAttendance } from '@/lib/types';
import { mockAttendanceData, mockViolations } from '@/lib/mock-data';
import { useAuth } from '@/context/AuthContext';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';


interface DetectionResult {
  compliant: boolean;
  violation?: string;
}

export default function CodeCheck() {
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>(mockAttendanceData);
  const [isPending, startTransition] = useTransition();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("1");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

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
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
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
      toast({
        title: 'Error',
        description: 'Camera or user not available.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setDetectionResult(null);
    setRecommendations(null);

    const canvas = canvasRef.current ?? document.createElement('canvas');
    if (!canvasRef.current) {
        canvasRef.current = canvas;
    }

    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    const capturedImage = canvas.toDataURL('image/jpeg');
    setImagePreview(capturedImage);

    // This is where you would call your actual ML model API.
    // For now, we simulate the detection process.
    await new Promise(resolve => setTimeout(resolve, 1500));

    const isCompliant = Math.random() > 0.4; // Simulate compliance check
    
    const userAttendanceIndex = attendanceData.findIndex(record => record.userId === user.id);

    if (userAttendanceIndex === -1) {
        toast({ title: "User not in attendance list", variant: "destructive" });
        setIsProcessing(false);
        return;
    }

    // Create a deep copy to avoid direct state mutation
    const newAttendanceData = JSON.parse(JSON.stringify(attendanceData));
    const userRecord = newAttendanceData[userAttendanceIndex];
    const periodIndex = userRecord.periods.findIndex((p: PeriodAttendance) => p.period === parseInt(selectedPeriod, 10));

    if (periodIndex === -1) {
        toast({ title: "Selected period not found for this user", variant: "destructive" });
        setIsProcessing(false);
        return;
    }

    if (isCompliant) {
      setDetectionResult({ compliant: true });
      userRecord.periods[periodIndex].status = 'Compliant';
      userRecord.periods[periodIndex].violation = undefined;
    } else {
      const violation = mockViolations[Math.floor(Math.random() * mockViolations.length)];
      setDetectionResult({ compliant: false, violation });
      userRecord.periods[periodIndex].status = 'Non-Compliant';
      userRecord.periods[periodIndex].violation = violation;

      startTransition(async () => {
        try {
          const result = await generateDressCodeRecommendations({ detectedViolations: violation });
          setRecommendations(result.recommendations);
        } catch (error) {
          console.error("AI recommendation failed:", error);
          setRecommendations("Could not generate recommendations at this time.");
        }
      });
    }

    setAttendanceData(newAttendanceData);
    setIsProcessing(false);
  };

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
                      <SelectItem value="1">Period 1</SelectItem>
                      <SelectItem value="2">Period 2</SelectItem>
                      <SelectItem value="3">Period 3</SelectItem>
                      <SelectItem value="4">Period 4</SelectItem>
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
        <h2 className="text-3xl font-bold tracking-tight">Today's Attendance</h2>
        <ResultsTable attendanceData={attendanceData} />
      </div>
    </div>
  );
}
