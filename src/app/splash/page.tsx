"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap } from 'lucide-react';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 1500); // 1.5-second delay

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-background to-slate-900 text-foreground">
      <div className="flex animate-fade-in-down flex-col items-center gap-4">
        <div className="rounded-full bg-gradient-to-br from-primary-purple to-primary-orange p-4 shadow-lg animate-pulse">
          <GraduationCap className="h-16 w-16" />
        </div>
        <h1 className="text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary-purple to-primary-orange">
          ESEC CHROMA GRADE
        </h1>
        <p className="text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          The future of automated attendance and compliance.
        </p>
      </div>
      <div className="absolute bottom-6 text-sm text-muted-foreground/50 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        Powered by ChromaGrade
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
          animation: fade-in-down 0.5s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
