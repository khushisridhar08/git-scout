export type Shortlist = {
  id: string;
  name: string;
  createdAt?: string; // optional if backend doesn't provide
  candidateCount?: number; // optional if backend doesn't provide
};

export type CandidateLite = {
  username: string;
  name?: string;
  score?: number;
  repos?: number;
  followers?: number;
  topLanguage?: string;
};

export type ShortlistDetail = Shortlist & {
  candidates: CandidateLite[];
};