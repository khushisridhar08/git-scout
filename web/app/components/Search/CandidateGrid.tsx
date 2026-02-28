"use client";

import type { Candidate } from "@/types/candidate";

type Props = {
  candidates: Candidate[];
  isLoading?: boolean;
};

export default function CandidateGrid({ candidates, isLoading }: Props) {
  if (isLoading) return <p>Loading...</p>;
  if (!candidates?.length) return <p>No results</p>;

  return (
    <div className="grid gap-4">
      {candidates.map((c) => (
        <div key={String(c.username)} className="border p-3">
          <p>{c.username}</p>
        </div>
      ))}
    </div>
  );
}