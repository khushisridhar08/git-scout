"use client";
import React from "react";

type RepoLike = {
  name?: string;
  description?: string;
  language?: string;
  stars?: number;
  forks?: number;
  updatedAt?: string;
  url?: string;
};

function isRepoArray(x: unknown): x is RepoLike[] {
  return Array.isArray(x);
}

export function TopRepositories({ repos }: { repos?: unknown }) {
  const list = isRepoArray(repos) ? repos.slice(0, 8) : [];

  return (
    <div className="border rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-semibold">Top Repositories</h2>
        <span className="text-xs text-gray-500">Showing up to 8</span>
      </div>

      {list.length === 0 ? (
        <p className="text-sm text-gray-600 mt-4">No repositories available.</p>
      ) : (
        <div className="mt-4 divide-y">
          {list.map((r, idx) => (
            <div key={`${r.name ?? "repo"}-${idx}`} className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {r.url ? (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-gray-900 underline truncate"
                      >
                        {r.name ?? "Unnamed repo"}
                      </a>
                    ) : (
                      <span className="font-medium text-gray-900 truncate">
                        {r.name ?? "Unnamed repo"}
                      </span>
                    )}

                    {r.language && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {r.language}
                      </span>
                    )}
                  </div>

                  {r.description && (
                    <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                      {r.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end text-xs text-gray-600 shrink-0">
                  <div className="flex gap-3 tabular-nums">
                    <span>★ {r.stars ?? 0}</span>
                    <span>⑂ {r.forks ?? 0}</span>
                  </div>
                  {r.updatedAt && (
                    <span className="mt-1">Updated {r.updatedAt}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}