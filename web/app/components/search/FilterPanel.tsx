import type { SearchFilters } from "@/types/search";

type Props = {
  filters: SearchFilters;
  onChange: (patch: Partial<SearchFilters>) => void;
  onReset?: () => void;
  className?: string;
};

export default function FilterPanel({
  filters,
  onChange,
  onReset,
  className,
}: Props) {
  return (
    <div className={`mb-4 border p-3 ${className ?? ""}`}>
      <div className="mb-2 flex items-center justify-between">
        <p className="font-semibold">Filters</p>
        {onReset && (
          <button
            type="button"
            className="text-sm underline opacity-80 hover:opacity-100"
            onClick={onReset}
          >
            Reset
          </button>
        )}
      </div>

      <input
        className="border p-1 mr-2"
        placeholder="Language"
        value={(filters as any).language ?? ""}          // safe even if SearchFilters doesn't define it yet
        onChange={(e) => onChange({ language: e.target.value } as any)}
      />

      <input
        className="border p-1 mr-2"
        placeholder="Location"
        value={(filters as any).location ?? ""}
        onChange={(e) => onChange({ location: e.target.value } as any)}
      />

      <input
        className="border p-1"
        placeholder="Min followers"
        value={(filters as any).min_followers ?? ""}
        onChange={(e) =>
          onChange({
            min_followers: e.target.value ? Number(e.target.value) : undefined,
          } as any)
        }
      />
    </div>
  );
}