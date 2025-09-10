"use client";

import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Camera, LogIn, LayoutDashboard, LogOut, GraduationCap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  const navItems = [
    { href: '/', label: 'Home', icon: <Camera /> },
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur-sm sm:px-6">
      <Link href="/" className="flex items-center gap-2">
        <GraduationCap className="h-6 w-6 text-primary" />
        <span className="font-headline text-xl font-semibold tracking-tight">
          ChromaGrade
        </span>
      </Link>
      
      <div className="flex items-center gap-4">
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="hidden md:block">
            {user ? (
                <Button onClick={logout} variant="outline">
                    <LogOut className="mr-2" />
                    Logout
                </Button>
            ) : (
                <Button asChild>
                    <Link href="/login">
                        <LogIn className="mr-2" />
                        Login
                    </Link>
                </Button>
            )}
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <span className="font-headline">ChromaGrade</span>
                </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-foreground/80 hover:text-foreground flex items-center gap-2"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
                 {user ? (
                    <Button onClick={logout} variant="outline" className="flex items-center gap-2">
                        <LogOut />
                        Logout
                    </Button>
                 ) : (
                    <Link href="/login" className="text-foreground/80 hover:text-foreground flex items-center gap-2">
                        <LogIn />
                        Login
                    </Link>
                 )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
