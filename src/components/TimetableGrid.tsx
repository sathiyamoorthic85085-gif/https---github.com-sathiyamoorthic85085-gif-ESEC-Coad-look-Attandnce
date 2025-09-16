"use client";

import { TimetableEntry } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { User, Clock } from "lucide-react";

interface TimetableGridProps {
  schedule: TimetableEntry[];
}

const timeSlots = ["09:00 - 10:00", "10:00 - 11:00", "11:15 - 12:15", "01:00 - 02:00"];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// This is a simplified mapping. In a real app, this would be more dynamic.
const getDayForPeriod = (period: number): string => {
    // Assuming 4 periods per day for 5 days
    const dayIndex = Math.floor((period - 1) / 4);
    return days[dayIndex] || "Unknown";
}


export default function TimetableGrid({ schedule }: TimetableGridProps) {
    
    // A simple grid structure based on periods. A more robust solution might use dates/days.
    // This assumes a linear sequence of periods for the week.
    
    const getPeriodForDayAndTime = (day: string, time: string): TimetableEntry | undefined => {
        // This is a mock association. In a real system, you'd have day/time data per entry.
        // For now, we'll try to map periods to a grid.
         const dayIndex = days.indexOf(day);
         const timeIndex = timeSlots.indexOf(time);
         
         if (dayIndex === -1 || timeIndex === -1) return undefined;

         // This logic assumes periods 1-4 are Monday, 5-8 are Tuesday, etc.
         // This is a limitation of the mock data structure.
         const periodNumber = dayIndex * 4 + timeIndex + 1;

         return schedule.find(s => s.period === periodNumber);
    }


  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-1">
        {days.map(day => (
            <div key={day} className="flex flex-col gap-1">
                 <h3 className="font-bold text-center text-muted-foreground py-2">{day}</h3>
                {timeSlots.map(time => {
                    const entry = getPeriodForDayAndTime(day, time);
                    return (
                        <Card key={`${day}-${time}`} className="min-h-[120px] bg-muted/30 flex flex-col justify-between">
                             <CardHeader className="p-3">
                                <CardDescription className="flex items-center gap-2 text-xs">
                                    <Clock className="h-3 w-3" />
                                    {time}
                                </CardDescription>
                            </CardHeader>
                            {entry ? (
                                <CardContent className="p-3">
                                    <p className="font-semibold text-sm">{entry.subject}</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                                        <User className="h-3 w-3" />
                                        {entry.faculty}
                                    </p>
                                </CardContent>
                            ) : (
                                <CardContent className="p-3 flex items-center justify-center">
                                    <p className="text-xs text-muted-foreground">Free</p>
                                </CardContent>
                            )}
                        </Card>
                    )
                })}
            </div>
        ))}
    </div>
  );
}