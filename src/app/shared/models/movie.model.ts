import { Rule } from "./rule.model";

export interface Movie {
  title: string;
  poster: string;
  year?: string;
  id: string;
  category?: string;
  rules?: Rule[];
  viewCount?: number;
}
