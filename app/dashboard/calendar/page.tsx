"use client";

import { JobsCalendar } from "@/components/dashboard/calendar/jobs-calendar";

export default function CalendarPage() {
  return (
    <div className="space-y-4 flex flex-col h-full min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Jobs Calendar
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          View all done and pending jobs by date.
        </p>
      </div>

      <div className="flex-1 bg-card rounded-xl border border-border shadow-sm overflow-hidden p-6 flex flex-col">
        <JobsCalendar />
      </div>
    </div>
  );
}
