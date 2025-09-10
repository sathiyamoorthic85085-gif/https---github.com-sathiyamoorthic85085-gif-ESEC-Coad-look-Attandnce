
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap } from 'lucide-react';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 3000); // 3-second delay before redirecting

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-background to-slate-900 text-foreground">
      <div className="flex animate-fade-in-down flex-col items-center gap-4">
        <div className="rounded-full bg-gradient-to-br from-primary to-accent p-4 shadow-lg animate-pulse">
          <GraduationCap className="h-16 w-16" />
        </div>
        <h1 className="text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          ChromaGrade
        </h1>
        <p className="text-muted-foreground animate-fade-in-up delay-500">
          The future of automated attendance and compliance.
        </p>
      </div>
      <div className="absolute bottom-6 text-sm text-muted-foreground/50 animate-fade-in-up delay-1000">
        Made by ESEC (EIE)
      </div>
      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
