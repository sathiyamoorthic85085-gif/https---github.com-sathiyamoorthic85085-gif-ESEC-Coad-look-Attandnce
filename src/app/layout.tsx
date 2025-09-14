
import type { Metadata } from 'next';
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'ESEC CHROMA GRADE',
  description: 'AI-powered dress code and attendance system.',
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
        <StackProvider app={stackServerApp}>
          <AuthProvider>
            <StackTheme>
              <div className="relative flex min-h-screen w-full flex-col">
                <main className="flex-1">{children}</main>
              </div>
              <Toaster />
            </StackTheme>
          </AuthProvider>
        </StackProvider>
      </body>
    </html>
  );
}
