"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { mockUsers } from '@/lib/mock-data';

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImageUrl = e.target?.result as string;
        
        // Update context state
        const updatedUser = { ...user, imageUrl: newImageUrl };
        setUser(updatedUser);

        // Update mock data to simulate persistence
        const userIndex = mockUsers.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            mockUsers[userIndex].imageUrl = newImageUrl;
        }

        toast({
          title: "Profile Picture Updated",
          description: "Your new profile picture has been set.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  if (!user) {
    return (
       <DashboardLayout>
            <div className="flex-1 space-y-4 p-8 pt-6">
                <p>Loading user profile...</p>
            </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Profile & Settings</h2>
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>
              View and update your personal information.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6 md:flex-row">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-primary-orange shadow-lg">
                <AvatarImage src={user.imageUrl} alt={user.name} />
                <AvatarFallback className="text-4xl">{user.name?.[0]}</AvatarFallback>
              </Avatar>
               <Input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePictureChange} 
                className="hidden" 
                accept="image/*"
              />
              <Button 
                onClick={handleButtonClick}
                className="absolute bottom-0 right-0"
                size="sm"
              >
                Change Picture
              </Button>
            </div>
            <div className="space-y-2 text-center md:text-left">
                <h3 className="text-2xl font-bold">{user.name}</h3>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-muted-foreground">{user.role} - {user.department}</p>
                {user.role === 'Student' && (
                    <>
                        <p className="text-sm text-muted-foreground">Roll No: {user.rollNumber}</p>
                        <p className="text-sm text-muted-foreground">Register No: {user.registerNumber}</p>
                    </>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
