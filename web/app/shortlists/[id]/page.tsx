"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useRemoveCandidateFromShortlist,
  useShortlist,
} from "@/hooks/useShortlists";
import { ShortlistCandidatesTable } from "@/components/shortlists/ShortlistCandidatesTable";
import { CompareView } from "@/components/shortlists/CompareView";
import Navigation from "@/components/Navigation";

export default function ShortlistDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { data, isLoading, error } = useShortlist(id);
  const removeMut = useRemoveCandidateFromShortlist();

  const candidates = data?.candidates ?? [];
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const toggle = (username: string) => {
    setSelected((prev) => {
      const next = { ...prev, [username]: !prev[username] };
      const count = Object.values(next).filter(Boolean).length;
      if (count > 4) return prev; // max 4 compare
      return next;
    });
  };

  const selectedCandidates = useMemo(() => {
    return candidates.filter((c: any) => selected[c.username]).slice(0, 4);
  }, [candidates, selected]);

  const onRemove = async (username: string) => {
    await removeMut.mutateAsync({ id, username });
    setSelected((prev) => {
      const { [username]: _, ...rest } = prev;
      return rest;
    });
  };

  if (isLoading) return <div className="min-h-screen bg-background"><Navigation /><div className="p-6 pt-24 text-sm opacity-80">Loading shortlist…</div></div>;
  if (error) return <div className="min-h-screen bg-background"><Navigation /><div className="p-6 pt-24 text-sm text-red-600">Failed to load shortlist.</div></div>;
  if (!data) return <div className="min-h-screen bg-background"><Navigation /><div className="p-6 pt-24 text-sm text-red-600">Shortlist not found.</div></div>;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-12 space-y-6">
      <div className="space-y-1">
        <button className="text-sm underline opacity-80" onClick={() => router.push("/shortlists")}>
          ← Back to shortlists
        </button>

        <h1 className="text-2xl font-semibold">{data.name}</h1>
        <p className="text-sm opacity-80">
          {candidates.length} candidate{candidates.length === 1 ? "" : "s"}
        </p>
      </div>

      <ShortlistCandidatesTable
        candidates={candidates}
        selected={selected}
        onToggleSelect={toggle}
        onRemove={onRemove}
        removing={removeMut.isPending}
      />

      <CompareView candidates={selectedCandidates} />
      </div>
    </div>
  );
}