"use client";

import React from "react";

export function ShortlistCandidatesTable(props: {
  candidates: any[];
  selected: Record<string, boolean>;
  onToggleSelect: (username: string) => void;
  onRemove: (username: string) => void;
  removing?: boolean;
}) {
  const { candidates, selected, onToggleSelect, onRemove, removing } = props;

  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="px-4 py-3 border-b">
        <div className="font-medium">Candidates</div>
        <div className="text-xs opacity-70">Select up to 4 to compare.</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="p-3 w-10"></th>
              <th className="p-3">Name</th>
              <th className="p-3">Score</th>
              <th className="p-3">Repos</th>
              <th className="p-3">Followers</th>
              <th className="p-3">Top Language</th>
              <th className="p-3 w-24">Actions</th>
            </tr>
          </thead>

          <tbody>
            {candidates.map((c: any) => (
              <tr key={c.username} className="border-t">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={!!selected[c.username]}
                    onChange={() => onToggleSelect(c.username)}
                  />
                </td>

                <td className="p-3">
                  <div className="font-medium">{c.name ?? c.username}</div>
                  <div className="text-xs opacity-70">@{c.username}</div>
                </td>

                <td className="p-3">{c.score ?? "-"}</td>
                <td className="p-3">{c.repos ?? "-"}</td>
                <td className="p-3">{c.followers ?? "-"}</td>
                <td className="p-3">{c.topLanguage ?? c.language ?? "-"}</td>

                <td className="p-3">
                  <button
                    className="rounded-md border px-3 py-1 text-sm text-red-600"
                    onClick={() => onRemove(c.username)}
                    disabled={removing}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}

            {candidates.length === 0 && (
              <tr>
                <td className="p-4 text-sm opacity-70" colSpan={7}>
                  No candidates in this shortlist.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}