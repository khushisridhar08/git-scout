"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateShortlist, useDeleteShortlist, useShortlists } from "@/hooks/useShortlists";
import { ShortlistCard } from "@/components/shortlists/ShortlistCard";
import { CreateShortlistDialog } from "@/components/shortlists/CreateShortlistDialog";

export default function ShortlistsPage() {
  const router = useRouter();

  const { data, isLoading, error } = useShortlists();
  const createMut = useCreateShortlist();
  const deleteMut = useDeleteShortlist();

  const [q, setQ] = useState("");

  const shortlists = data ?? [];
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return shortlists;
    return shortlists.filter((s: any) => (s.name ?? "").toLowerCase().includes(query));
  }, [q, shortlists]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Shortlists</h1>
          <p className="text-sm opacity-80">Create and manage candidate shortlists.</p>
        </div>

        <CreateShortlistDialog
          onCreate={(name) => createMut.mutateAsync(name)}
          isCreating={createMut.isPending}
        />
      </div>

      <input
        className="w-full max-w-md rounded-md border px-3 py-2 text-sm"
        placeholder="Search shortlists…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {isLoading && <div className="text-sm opacity-80">Loading shortlists…</div>}
      {error && (
        <div className="text-sm text-red-600">
          Failed to load shortlists. (Check console for details)
        </div>
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <div className="text-sm opacity-80">No shortlists yet. Create one.</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((s: any) => (
          <ShortlistCard
            key={s.id}
            shortlist={s}
            onOpen={() => router.push(`/shortlists/${s.id}`)}
            onDelete={() => deleteMut.mutateAsync(s.id)}
            deleting={deleteMut.isPending}
          />
        ))}
      </div>
    </div>
  );
}