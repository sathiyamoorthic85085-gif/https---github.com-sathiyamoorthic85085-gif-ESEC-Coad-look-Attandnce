import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Camera } from 'lucide-react';

export default function Header() {
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/admin', label: 'Admin Dashboard' },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur-sm sm:px-6">
      <Link href="/" className="flex items-center gap-2">
        <Camera className="h-6 w-6 text-primary" />
        <span className="font-headline text-xl font-semibold tracking-tight">
          CodeLook Attendance
        </span>
      </Link>
      
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
                <Camera className="h-6 w-6 text-primary" />
                <span className="font-headline">CodeLook</span>
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-foreground/80 hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
