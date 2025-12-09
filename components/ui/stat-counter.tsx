"use client";

import { useCountUp } from "@/lib/hooks/use-count-up";

interface StatCounterProps {
  value: number;
  label: string;
  suffix?: string;
}

export function StatCounter({ value, label, suffix = "+" }: StatCounterProps) {
  const count = useCountUp(value);

  return (
    <div className="space-y-1">
      <p className="text-3xl md:text-4xl font-bold">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
