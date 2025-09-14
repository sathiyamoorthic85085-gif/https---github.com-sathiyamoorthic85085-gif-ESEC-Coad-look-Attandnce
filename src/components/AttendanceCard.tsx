"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { List } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

interface Prediction {
    id: string;
    user: { name: string };
    label: string;
    confidence: number;
    created_at: string;
}

export default function AttendanceCard() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    const fetchPredictions = () => {
        fetch("/api/predictions")
          .then(res => res.json())
          .then(setPredictions)
          .catch(err => console.error("Failed to fetch predictions:", err));
    };
    
    fetchPredictions();
    const interval = setInterval(fetchPredictions, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Predictions</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
      <CardContent>
        <ScrollArea className="h-24">
            {predictions.length === 0 && <p className="text-xs text-muted-foreground text-center pt-8">Awaiting predictions...</p>}
            <div className="space-y-2">
                {predictions.map(p => (
                    <div key={p.id} className="flex justify-between items-center text-xs">
                        <div>
                            <p className="font-medium">{p.user?.name || 'Unknown User'}</p>
                            <p className="text-muted-foreground">{new Date(p.created_at).toLocaleTimeString()}</p>
                        </div>
                        <Badge variant={p.label === 'compliant' ? 'default' : 'destructive'}>
                            {p.label} ({(p.confidence*100).toFixed(0)}%)
                        </Badge>
                    </div>
                ))}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
