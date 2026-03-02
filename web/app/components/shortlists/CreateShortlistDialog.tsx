"use client";

import React, { useState } from "react";

export function CreateShortlistDialog(props: {
  onCreate: (name: string) => Promise<any>;
  isCreating?: boolean;
}) {
  const { onCreate, isCreating } = props;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const submit = async () => {
    const n = name.trim();
    if (!n) return;
    await onCreate(n);
    setName("");
    setOpen(false);
  };

  return (
    <>
      <button
        className="rounded-md bg-black text-white px-4 py-2 text-sm"
        onClick={() => setOpen(true)}
      >
        + New shortlist
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => !isCreating && setOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-5 shadow-lg space-y-4">
            <div className="space-y-1">
              <div className="text-lg font-semibold">Create shortlist</div>
              <div className="text-sm opacity-70">Give your shortlist a name.</div>
            </div>

            <input
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="e.g., Finalists"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isCreating}
            />

            <div className="flex justify-end gap-2">
              <button
                className="rounded-md border px-4 py-2 text-sm"
                onClick={() => setOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-black text-white px-4 py-2 text-sm"
                onClick={submit}
                disabled={isCreating || !name.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}