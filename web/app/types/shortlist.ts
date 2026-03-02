export type ShortlistSummary = {
  id: string;
  name: string;
  createdAt?: string;
  candidateCount?: number;
};

export type Candidate = {
  username: string;
  name?: string;
  score?: number;
  repos?: number;
  followers?: number;
  topLanguage?: string;
  language?: string;
};

export type ShortlistDetail = {
  id: string;
  name: string;
  createdAt?: string;
  candidates: Candidate[];
};