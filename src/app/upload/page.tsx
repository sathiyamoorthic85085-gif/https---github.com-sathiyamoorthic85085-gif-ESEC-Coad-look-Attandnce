"use client";

import React, { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, File as FileIcon, X, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

interface CheckResult {
    prediction: 'compliant' | 'non_compliant';
    confidence: number;
    violation?: string;
}

export default function UploadPage() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setResult(null);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
    maxFiles: 1,
  });

  const handleClear = () => {
      setFile(null);
      setPreview(null);
      setResult(null);
  }

  const handleUpload = async () => {
    if (!file) {
      toast({ title: "No File Selected", description: "Please select an image to upload.", variant: "destructive" });
      return;
    }
    if (!user?.id) {
      toast({ title: "Authentication Error", description: "You must be logged in to perform a check.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", user.id);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict`, {
        method: "POST",
        body: formData,
        headers: { "X-APP-KEY": process.env.NEXT_PUBLIC_APP_KEY! },
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
       toast({ title: "Analysis Complete", description: "Dress code compliance has been checked." });

    } catch (error: any) {
      console.error("Upload failed:", error);
      toast({ title: "Upload Failed", description: error.message || "An unknown error occurred.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Upload for Compliance Check</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Upload Image</CardTitle>
                    <CardDescription>
                    Select or drop an image to check for dress code compliance.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div
                    {...getRootProps()}
                    className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                        ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
                    >
                    <input {...getInputProps()} />
                    <UploadCloud className="w-12 h-12 text-muted-foreground" />
                    <p className="mt-4 text-center text-muted-foreground">
                        {isDragActive ? "Drop the image here..." : "Drag & drop an image, or click to select"}
                    </p>
                    <p className="text-xs text-muted-foreground/80">PNG, JPG, JPEG</p>
                    </div>
                    
                    {preview && file && (
                    <div className="mt-6 flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Image src={preview} alt="File preview" width={40} height={40} className="rounded-md object-cover" />
                            <span className="text-sm font-medium">{file.name}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleClear}>
                        <X className="w-4 h-4" />
                        </Button>
                    </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handleUpload} disabled={!file || isLoading}>
                        {isLoading ? <><Loader2 className="animate-spin" /> Checking...</> : 'Check Compliance'}
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Analysis Result</CardTitle>
                    <CardDescription>The results of the compliance check will appear here.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-full">
                    {isLoading && <Loader2 className="h-16 w-16 animate-spin text-primary" />}
                    
                    {!isLoading && result && (
                        <div className="flex flex-col items-center gap-4 text-center">
                            {result.prediction === 'compliant' ? (
                                <CheckCircle className="h-20 w-20 text-green-500" />
                            ) : (
                                <XCircle className="h-20 w-20 text-red-500" />
                            )}
                            <h3 className="font-semibold text-2xl">
                                {result.prediction === 'compliant' ? "Dress Code Compliant" : "Dress Code Violation"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {result.prediction === 'non_compliant' && result.violation ? result.violation : `Confidence: ${Math.round(result.confidence * 100)}%`}
                            </p>
                            <pre className="mt-4 p-4 bg-muted/50 rounded-lg text-xs w-full text-left">{JSON.stringify(result, null, 2)}</pre>
                        </div>
                    )}

                    {!isLoading && !result && (
                        <div className="text-muted-foreground">
                            <p>Awaiting upload...</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
