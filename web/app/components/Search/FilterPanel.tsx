type Filters = {
  language?: string;
  location?: string;
  min_followers?: number | undefined;
  min_repos?: number | undefined;
  sort?: string;
};

type Props = {
  value: Filters;
  onChange: (next: Filters) => void;
};

export default function FilterPanel({ value, onChange }: Props) {
  return (
    <div className="mb-4 border p-3">
      <p className="font-semibold mb-2">Filters</p>

      <input
        className="border p-1 mr-2"
        placeholder="Language"
        value={value.language ?? ""}
        onChange={(e) => onChange({ ...value, language: e.target.value })}
      />

      <input
        className="border p-1 mr-2"
        placeholder="Location"
        value={value.location ?? ""}
        onChange={(e) => onChange({ ...value, location: e.target.value })}
      />

      <input
        className="border p-1"
        placeholder="Min followers"
        value={value.min_followers ?? "" as any}
        onChange={(e) => onChange({ ...value, min_followers: e.target.value ? Number(e.target.value) : undefined })}
      />
    </div>
  );
}