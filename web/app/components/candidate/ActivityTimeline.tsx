"use client";

import React from "react";

type ActivityEvent = {
  date?: string;
  type?: string;
  count?: number;
};

export function ActivityTimeline({
  events,
  days = 90,
}: {
  events?: ActivityEvent[];
  days?: number;
}) {
  const list = events ?? [];

  return (
    <div className="border rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-semibold">Activity (last {days} days)</h2>
        <span className="text-xs text-gray-500">Events: {list.length}</span>
      </div>

      {list.length === 0 ? (
        <p className="text-sm text-gray-600 mt-4">No activity data available.</p>
      ) : (
        <div className="mt-4 space-y-2">
          {list.slice(0, 12).map((e, i) => (
            <div key={i} className="text-sm text-gray-800 border-b pb-1">
              <span className="text-gray-500">{e.date ?? "Unknown date"}</span>
              {e.type ? ` • ${e.type}` : ""}
              {typeof e.count === "number" ? ` • ${e.count}` : ""}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}