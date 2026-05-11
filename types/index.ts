export type TeamId =
  | "csk"
  | "rcb"
  | "mi"
  | "gt"
  | "kkr"
  | "srh"
  | "rr"
  | "pbks"
  | "lsg"
  | "dc";

export type PlayerRole =
  | "Batsman"
  | "Bowler"
  | "All-Rounder"
  | "Wicketkeeper-Batsman";

export type Trait =
  | "aggressive"
  | "anchor"
  | "finisher"
  | "captain"
  | "india-captain"
  | "wicketkeeper"
  | "mystery-spinner"
  | "death-bowler"
  | "powerplay-specialist"
  | "legend"
  | "foreign"
  | "left-hander"
  | "pace"
  | "spin"
  | "all-rounder"
  | "youngster"
  | "opener"
  | "middle-order"
  | "match-winner";

export interface PlayerStats {
  matches: number;
  runs: number;
  wickets: number;
  strikeRate: number;
  battingAverage: number;
  bestPerformance: string;
}

export interface Player {
  id: string;
  teamId: TeamId;
  name: string;
  role: PlayerRole;
  jerseyNumber: number;
  country: string;
  age: number;
  battingStyle: string;
  bowlingStyle: string;
  traits: Trait[];
  bio: string;
  achievements: string[];
  voiceIntro: string;
  imageUrl?: string;
  stats: PlayerStats;
}

export type AnswerValue =
  | "yes"
  | "no"
  | "probably"
  | "dont_know"
  | "probably_not";

export type QuestionField =
  | "teamId"
  | "role"
  | "country"
  | "battingStyle"
  | "bowlingStyle"
  | "traits"
  | "age"
  | "jerseyNumber"
  | "name";

export type QuestionOperator =
  | "equals"
  | "includes"
  | "contains"
  | "gt"
  | "lt";

export interface QuestionRule {
  field: QuestionField;
  operator: QuestionOperator;
  value: string | number;
}

export interface QuestionDefinition {
  id: string;
  prompt: string;
  description: string;
  category: "team" | "role" | "style" | "career" | "identity";
  priority: number;
  rule: QuestionRule;
}

export interface GameAnswer {
  questionId: string;
  answer: AnswerValue;
}

export interface CandidateScore {
  player: Player;
  score: number;
  confidence: number;
}

export interface Team {
  id: TeamId;
  name: string;
  shortName: string;
  city: string;
  stadium: string;
  primary: string;
  accent: string;
  glow: string;
  strapline: string;
}
