"use client";

import React from "react";

export function ShortlistCard(props: {
  shortlist: any;
  onOpen: () => void;
  onDelete: () => Promise<any>;
  deleting?: boolean;
}) {
  const { shortlist, onOpen, onDelete, deleting } = props;

  const createdAt = shortlist.createdAt
    ? new Date(shortlist.createdAt).toLocaleDateString()
    : null;

  const count =
    shortlist.candidateCount ??
    shortlist.candidates?.length ??
    undefined;

  return (
    <div className="rounded-lg border p-4 shadow-sm space-y-3">
      <button className="text-left w-full" onClick={onOpen}>
        <div className="font-medium truncate">{shortlist.name}</div>
        <div className="text-xs opacity-70 mt-1">
          {count !== undefined ? `${count} candidates` : "Candidates"}
          {createdAt ? ` • Created ${createdAt}` : ""}
        </div>
      </button>

      <div className="flex gap-2">
        <button
          className="flex-1 rounded-md bg-black text-white py-2 text-sm"
          onClick={onOpen}
        >
          Open
        </button>

        <button
          className="rounded-md border px-3 py-2 text-sm text-red-600"
          onClick={() => {
            if (confirm(`Delete shortlist "${shortlist.name}"?`)) onDelete();
          }}
          disabled={deleting}
        >
          Delete
        </button>
      </div>
    </div>
  );
}