"use client";

import React from "react";

export function LanguageChart({ languages }: { languages?: string[] }) {
  const list = languages ?? [];

  return (
    <div className="border rounded-xl bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">Languages</h2>

      {list.length === 0 ? (
        <p className="text-sm text-gray-600 mt-4">No language data available.</p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {list.slice(0, 12).map((lang) => (
            <span
              key={lang}
              className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800"
            >
              {lang}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}