// web/app/types/shortlist.ts
import type { Candidate } from "./candidate";

export type Shortlist = {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ShortlistCreateInput = {
  name: string;
};

export type ShortlistItem = {
  shortlist: Shortlist;
  candidates: Candidate[];
};
