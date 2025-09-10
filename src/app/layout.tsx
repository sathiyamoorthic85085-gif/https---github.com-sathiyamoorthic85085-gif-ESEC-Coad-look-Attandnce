import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/AuthContext';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} dark`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <AuthProvider>
            <div className="relative flex min-h-screen w-full flex-col">
            <main className="flex-1">{children}</main>
            </div>
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
