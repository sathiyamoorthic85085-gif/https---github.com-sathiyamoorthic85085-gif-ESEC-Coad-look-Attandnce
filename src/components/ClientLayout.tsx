
"use client";

import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "@/stack-client";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/AuthContext';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <StackProvider app={stackClientApp}>
      <AuthProvider>
        <StackTheme>
          <div className="relative flex min-h-screen w-full flex-col">
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </StackTheme>
      </AuthProvider>
    </StackProvider>
  );
}
