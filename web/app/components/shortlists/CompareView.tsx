"use client";

import React from "react";

export function CompareView(props: { candidates: any[] }) {
  const { candidates } = props;

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-baseline justify-between">
        <div className="font-medium">Compare</div>
        <div className="text-xs opacity-70">{candidates.length}/4 selected</div>
      </div>

      {candidates.length < 2 ? (
        <div className="text-sm opacity-70">
          Select at least 2 candidates from the table to compare.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2 w-40">Metric</th>
                {candidates.map((c: any) => (
                  <th key={c.username} className="p-2">
                    {c.name ?? c.username}
                    <div className="text-xs opacity-70">@{c.username}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {row("Score", candidates.map((c: any) => c.score ?? "-"))}
              {row("Repos", candidates.map((c: any) => c.repos ?? "-"))}
              {row("Followers", candidates.map((c: any) => c.followers ?? "-"))}
              {row("Top language", candidates.map((c: any) => c.topLanguage ?? c.language ?? "-"))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function row(label: string, values: Array<string | number>) {
  return (
    <tr className="border-b">
      <td className="p-2 font-medium">{label}</td>
      {values.map((v, idx) => (
        <td key={idx} className="p-2">
          {v}
        </td>
      ))}
    </tr>
  );
}