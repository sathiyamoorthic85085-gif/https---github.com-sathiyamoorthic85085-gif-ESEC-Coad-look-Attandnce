
"use client";

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

interface DashboardActionCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
}

export function DashboardActionCard({ title, description, icon, href }: DashboardActionCardProps) {
    return (
        <Card className="flex flex-col group hover:border-primary-orange transition-all">
            <CardHeader className="flex-grow">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <div className="text-primary-orange group-hover:animate-pulse">
                        {icon}
                    </div>
                </div>
                <p className="text-sm text-muted-foreground pt-2">{description}</p>
            </CardHeader>
            <CardContent>
                <Button asChild variant="outline" className="w-full">
                    <Link href={href}>
                        View All
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
}
