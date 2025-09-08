import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'CodeLook Attendance',
  description: 'AI-powered dress code detection and attendance system.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
            <div className="relative flex min-h-screen w-full flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            </div>
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
