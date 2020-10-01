export interface Rule {
  rule: string;
  rating: number;
  isFlagged: boolean;
  hasVoted: boolean;
  vote?: number;
}
