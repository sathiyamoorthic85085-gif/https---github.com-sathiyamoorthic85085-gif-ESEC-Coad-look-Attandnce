"use client"

import * as React from "react"

interface ProgressRingProps {
  value: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
}

export function ProgressRing({
  value,
  label,
  size = 80,
  strokeWidth = 8,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const id = React.useId();

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute top-0 left-0" width={size} height={size}>
        <defs>
            <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary-orange))" />
            <stop offset="100%" stopColor="hsl(var(--primary-purple))" />
            </linearGradient>
        </defs>
        <circle
          className="text-white/10"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="transform -rotate-90 origin-center transition-all duration-500 drop-shadow-[0_0_3px_hsl(var(--primary-orange))]"
          stroke={`url(#gradient-${id})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {label && (
        <span className="absolute text-xs font-semibold text-white/80">
          {value}%
        </span>
      )}
    </div>
  );
}
