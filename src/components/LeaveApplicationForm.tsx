"use client";

import React, { useState, useTransition } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Loader2, Wand2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import type { LeaveRequest, LeaveType } from '@/lib/types';
import { analyzeLeaveRequest } from '@/ai/flows/analyze-leave-request';
import { useToast } from '@/hooks/use-toast';

interface LeaveApplicationFormProps {
    onSubmit: (request: Omit<LeaveRequest, 'id' | 'status' | 'userId' | 'userName' | 'userRole'>) => void;
}

export function LeaveApplicationForm({ onSubmit }: LeaveApplicationFormProps) {
    const [type, setType] = useState<LeaveType | ''>('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [reason, setReason] = useState('');
    const [aiSummary, setAiSummary] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAnalyzing, startTransition] = useTransition();
    const { toast } = useToast();

    const handleAnalyzeReason = () => {
        if (!reason) {
            toast({ title: 'Reason is empty', description: 'Please provide a reason before analyzing.', variant: 'destructive' });
            return;
        }
        startTransition(async () => {
            try {
                const result = await analyzeLeaveRequest({ reason });
                setAiSummary(result.summary);
            } catch (error) {
                console.error("AI analysis failed:", error);
                toast({ title: 'Analysis Failed', description: 'Could not generate an AI summary.', variant: 'destructive' });
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!type || !dateRange?.from || !dateRange?.to || !reason) {
            toast({ title: 'Missing Fields', description: 'Please fill out all fields.', variant: 'destructive' });
            return;
        }

        setIsSubmitting(true);
        // Simulate submission delay
        setTimeout(() => {
            onSubmit({
                type: type as LeaveType,
                startDate: format(dateRange.from!, 'yyyy-MM-dd'),
                endDate: format(dateRange.to!, 'yyyy-MM-dd'),
                reason,
                aiSummary,
            });

            // Reset form
            setType('');
            setDateRange(undefined);
            setReason('');
            setAiSummary('');
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <Card>
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle>Apply for Leave / OD</CardTitle>
                    <CardDescription>Fill out the form below to submit your request.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="leave-type">Request Type</Label>
                        <Select value={type} onValueChange={(value) => setType(value as LeaveType)}>
                            <SelectTrigger id="leave-type">
                                <SelectValue placeholder="Select a request type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Leave">Leave</SelectItem>
                                <SelectItem value="OD">On-Duty (OD)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Date Range</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !dateRange && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dateRange?.from ? (
                                        dateRange.to ? (
                                            <>
                                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                                {format(dateRange.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(dateRange.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Pick a date range</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={dateRange?.from}
                                    selected={dateRange}
                                    onSelect={setDateRange}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason for {type || 'request'}</Label>
                        <Textarea id="reason" placeholder="Please provide a detailed reason..." value={reason} onChange={e => setReason(e.target.value)} />
                    </div>

                    {reason && (
                         <div className="space-y-2">
                            <Button type="button" variant="outline" size="sm" onClick={handleAnalyzeReason} disabled={isAnalyzing}>
                                {isAnalyzing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Analyzing...</> : <><Wand2 className="mr-2 h-4 w-4"/>Generate AI Summary</>}
                            </Button>
                            {aiSummary && (
                                <Card className="bg-muted/50 mt-2">
                                    <CardHeader className="p-3">
                                        <CardTitle className="text-sm">AI Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-3 pt-0 text-sm text-muted-foreground">
                                        {aiSummary}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
