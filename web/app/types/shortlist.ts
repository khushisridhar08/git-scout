// web/app/types/shortlist.ts

export type Shortlist = {
  id: string;
  name: string;
  createdAt?: string;
  items?: ShortlistItem[];
  [key: string]: unknown;
};

export type ShortlistCreateInput = {
  name: string;
};

export type ShortlistItem = {
  id: string;
  username: string;
  addedAt?: string;
  [key: string]: unknown;
};
