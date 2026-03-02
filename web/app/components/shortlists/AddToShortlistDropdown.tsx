"use client";

import React, { useMemo, useState } from "react";
import { useAddCandidateToShortlist, useShortlists } from "@/hooks/useShortlists";

export function AddToShortlistDropdown(props: {
  username: string;
  buttonLabel?: string;
}) {
  const { username, buttonLabel = "Add to shortlist" } = props;

  const { data } = useShortlists();
  const addMut = useAddCandidateToShortlist();

  const [open, setOpen] = useState(false);

  const shortlists = useMemo(() => {
    return (data ?? []).slice().sort((a: any, b: any) => (a.name ?? "").localeCompare(b.name ?? ""));
  }, [data]);

  const add = async (id: string) => {
    await addMut.mutateAsync({ id, username });
    setOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button className="rounded-md border px-3 py-2 text-sm" onClick={() => setOpen((v) => !v)}>
        {buttonLabel}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-md border bg-white shadow-lg z-20">
          <div className="p-2 text-xs opacity-70 border-b">Choose a shortlist</div>

          <div className="max-h-72 overflow-auto">
            {shortlists.map((s: any) => (
              <button
                key={s.id}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
                onClick={() => add(s.id)}
                disabled={addMut.isPending}
              >
                <span className="truncate">{s.name}</span>
                {addMut.isPending && <span className="text-xs opacity-70">Adding…</span>}
              </button>
            ))}

            {shortlists.length === 0 && (
              <div className="px-3 py-3 text-sm opacity-70">No shortlists yet.</div>
            )}
          </div>

          <div className="p-2 border-t">
            <button className="w-full rounded-md border px-3 py-2 text-sm" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}