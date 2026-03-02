"use client";

import React from "react";
import type { Candidate } from "../../types/candidate";

export function ProfileHeader({ candidate }: { candidate: Candidate }) {
  return (
    <div className="border rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <img
          src={(candidate.avatarUrl as string) || "/avatar-placeholder.png"}
          alt="avatar"
          className="h-16 w-16 rounded-full border object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <h1 className="text-xl font-semibold truncate">
              {candidate.name ?? candidate.username}
            </h1>
            <span className="text-sm text-gray-600">@{candidate.username}</span>
            {typeof candidate.score === "number" && (
              <span className="ml-auto text-sm text-gray-600">
                Score: <span className="font-semibold text-gray-900">{Math.round(candidate.score)}</span>
              </span>
            )}
          </div>

          {candidate.location && (
            <p className="text-sm text-gray-700 mt-1">
              <span className="text-gray-500">Location:</span> {candidate.location}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}