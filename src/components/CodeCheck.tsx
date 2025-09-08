"use client";

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Upload, X, CheckCircle, XCircle, Wand2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>(mockAttendanceData);
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setDetectionResult(null);
      setRecommendations(null);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setDetectionResult(null);
    setRecommendations(null);
  };

  const handleDetect = async () => {
    if (!imageFile) {
      toast({
        title: 'No Image Selected',
        description: 'Please upload an image to check the dress code.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setDetectionResult(null);
    setRecommendations(null);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const isCompliant = Math.random() > 0.4;
    const randomUserIndex = Math.floor(Math.random() * attendanceData.length);
    const updatedUser = { ...attendanceData[randomUserIndex] };

    if (isCompliant) {
      setDetectionResult({ compliant: true, imageUrl: imagePreview! });
      updatedUser.status = 'Compliant';
      updatedUser.attendance = 'Present';
      updatedUser.violation = undefined;
    } else {
      const violation = mockViolations[Math.floor(Math.random() * mockViolations.length)];
      setDetectionResult({ compliant: false, violation, imageUrl: imagePreview! });
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
          <CardDescription>Upload an image to verify dress code compliance and mark attendance.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col items-center justify-center gap-6">
          {imagePreview ? (
            <div className="relative w-full max-w-sm">
              <Image
                src={imagePreview}
                alt="Image preview"
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
            </div>
          ) : (
            <div className="w-full">
                <Label
                htmlFor="picture"
                className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/50 bg-primary/10 p-10 text-center transition hover:bg-primary/20"
                >
                <Upload className="h-10 w-10 text-primary" />
                <span className="font-semibold text-primary">Click to upload image</span>
                <p className="text-xs text-foreground/70">PNG, JPG, or GIF</p>
                </Label>
                <Input id="picture" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
            </div>
          )}
          <Button onClick={handleDetect} disabled={!imageFile || isProcessing} className="w-full max-w-sm">
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Detect Dress Code'
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
