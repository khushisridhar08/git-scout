"use client";

import React from "react";
import type { Candidate } from "../../types/candidate";

export function ScoreBreakdown({ candidate }: { candidate: Candidate }) {
  return (
    <div className="border rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-semibold">Score Breakdown</h2>
        <span className="text-sm text-gray-600">
          Overall:{" "}
          <span className="font-semibold text-gray-900">
            {typeof candidate.score === "number" ? Math.round(candidate.score) : "—"}
          </span>
        </span>
      </div>

      <p className="text-sm text-gray-600 mt-4">
        Breakdown is not available yet (backend schema not finalized).
      </p>
    </div>
  );
}