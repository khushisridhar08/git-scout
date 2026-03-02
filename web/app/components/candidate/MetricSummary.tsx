"use client";

import React from "react";
import type { Candidate } from "../../types/candidate";

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: number | string | undefined;
}) {
  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm">
      <div className="text-xs text-gray-600">{label}</div>
      <div className="text-xl font-semibold tabular-nums mt-1">
        {value ?? "—"}
      </div>
    </div>
  );
}

export function MetricsSummary({ candidate }: { candidate: Candidate }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard label="Repositories" value={candidate.publicRepos} />
      <MetricCard label="Followers" value={candidate.followers} />
      <MetricCard label="Total Stars" value={candidate.totalStars} />
      <MetricCard label="Recent Commits" value={candidate.recentCommitCount} />
    </div>
  );
}
