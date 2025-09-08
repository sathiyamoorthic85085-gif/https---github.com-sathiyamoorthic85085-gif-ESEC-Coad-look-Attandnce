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
import type { AttendanceRecord } from '@/lib/types';
import { mockAttendanceData, mockViolations } from '@/lib/mock-data';

interface DetectionResult {
  compliant: boolean;
  violation?: string;
  imageUrl: string;
}

export default function CodeCheck() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>(mockAttendanceData);
  const [isPending, startTransition] = useTransition();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

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
    if (!videoRef.current) {
      toast({
        title: 'Camera Not Ready',
        description: 'The camera feed is not available.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setDetectionResult(null);
    setRecommendations(null);

    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas) {
        canvasRef.current = document.createElement('canvas');
    }
    const context = canvasRef.current!.getContext('2d');
    
    canvasRef.current!.width = video.videoWidth;
    canvasRef.current!.height = video.videoHeight;
    context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    const capturedImage = canvasRef.current!.toDataURL('image/jpeg');
    setImagePreview(capturedImage);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const isCompliant = Math.random() > 0.4;
    const randomUserIndex = Math.floor(Math.random() * attendanceData.length);
    const updatedUser = { ...attendanceData[randomUserIndex] };

    if (isCompliant) {
      setDetectionResult({ compliant: true, imageUrl: capturedImage });
      updatedUser.status = 'Compliant';
      updatedUser.attendance = 'Present';
      updatedUser.violation = undefined;
    } else {
      const violation = mockViolations[Math.floor(Math.random() * mockViolations.length)];
      setDetectionResult({ compliant: false, violation, imageUrl: capturedImage });
      updatedUser.status = 'Non-Compliant';
      updatedUser.attendance = 'Present';
      updatedUser.violation = violation;

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

    const newAttendanceData = [...attendanceData];
    newAttendanceData[randomUserIndex] = updatedUser;
    setAttendanceData(newAttendanceData);

    setIsProcessing(false);
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Dress Code Check</CardTitle>
          <CardDescription>Use the camera to verify dress code compliance and mark attendance.</CardDescription>
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
         
          <Button onClick={handleCaptureAndDetect} disabled={hasCameraPermission !== true || isProcessing} className="w-full max-w-sm">
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
                <>
                    <Camera className="mr-2 h-4 w-4" />
                    Scan Dress Code
                </>
            )}
          </Button>

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
                                {detectionResult.compliant ? "Attendance marked as Present." : detectionResult.violation}
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
                    <CardTitle className="font-headline text-lg font-semibold text-accent">AI Recommendations</CardTitle>
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
      
      <div className="flex flex-col gap-8">
        <h2 className="font-headline text-3xl font-bold tracking-tight">Today's Attendance</h2>
        <ResultsTable attendanceData={attendanceData} />
      </div>
    </div>
  );
}
