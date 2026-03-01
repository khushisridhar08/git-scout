"use client";

import React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { useCandidate } from "@/hooks/useCandidate";

import { ProfileHeader } from "../../components/candidate/ProfileHeader";
import { MetricsSummary } from "../../components/candidate/MetricSummary";
import { ScoreBreakdown } from "../../components/candidate/ScoreBreakdown";
import { LanguageChart } from "../../components/candidate/LanguageChart";
import { TopRepositories } from "../../components/candidate/TopRepositories";
import { ActivityTimeline } from "../../components/candidate/ActivityTimeline";

export default function CandidateProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ username: string }>();

  const username = params?.username;
  const backTo = searchParams.get("backTo") || "/search";

  const { data: candidate, isLoading, error } = useCandidate(username);

  if (!username) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">Missing username param.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-3">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-2">
        <p className="text-sm text-red-600">Failed to load candidate.</p>
        <pre className="text-xs bg-gray-50 border rounded p-3 overflow-auto">
          {String(error)}
        </pre>
        <button
          onClick={() => router.push(backTo)}
          className="px-3 py-2 text-sm rounded bg-black text-white"
        >
          Back to Search
        </button>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="p-6 space-y-2">
        <p className="text-sm text-gray-700">No candidate data found.</p>
        <button
          onClick={() => router.push(backTo)}
          className="px-3 py-2 text-sm rounded bg-black text-white"
        >
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top actions */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => router.push(backTo)}
          className="px-3 py-2 text-sm rounded border bg-white hover:bg-gray-50"
        >
          ← Back to Search
        </button>

        {/* Add to Shortlist */}
        <AddToShortlistButton username={candidate.username ?? username} />
      </div>

      {/* Header */}
      <ProfileHeader candidate={candidate} />

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Center */}
        <div className="lg:col-span-2 space-y-6">
          <MetricsSummary candidate={candidate} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScoreBreakdown candidate={candidate} />
            <LanguageChart languages={candidate.languages} />
          </div>

          <TopRepositories repos={candidate.topRepos} />
        </div>

        {/* Right */}
        <div className="space-y-6">
          <ActivityTimeline events={(candidate as any)?.activity?.events} days={90} />
        </div>
      </div>
    </div>
  );
}

/**
 * Minimal "Add to Shortlist" that doesn't assume your backend shape too hard.
 * If your repo already has a shortlist hook/store, replace this with it.
 */
function AddToShortlistButton({ username }: { username: string }) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const onAdd = async () => {
    setErr(null);
    setIsSaving(true);
    try {
      // Adjust endpoint if your project uses something else.
      const res = await fetch("/api/shortlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      setSaved(true);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to add to shortlist");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onAdd}
        disabled={isSaving || saved}
        className={`px-3 py-2 text-sm rounded ${
          saved ? "bg-green-600 text-white" : "bg-black text-white"
        } disabled:opacity-60`}
      >
        {saved ? "Added ✓" : isSaving ? "Adding..." : "Add to Shortlist"}
      </button>
      {err && <span className="text-xs text-red-600">{err}</span>}
    </div>
  );
}