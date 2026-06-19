export type RiskLevel = "high" | "medium" | "low";

export type TrendType = "rising" | "stable" | "falling";

export type EventType = "media" | "social" | "official";

export type RecordStatus = "pending" | "processing" | "completed";

export interface ArticleSummary {
  id: string;
  title: string;
  source: string;
  summary: string;
  url: string;
  publishTime: string;
  sentiment: number;
}

export interface SpreadAccount {
  id: string;
  name: string;
  platform: string;
  followers: number;
  postCount: number;
  influence: number;
}

export interface NarrativeAngle {
  id: string;
  angle: string;
  ratio: number;
  description: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  event: string;
  type: EventType;
}

export interface Topic {
  id: string;
  title: string;
  heat: number;
  growthRate: number;
  negativeRatio: number;
  riskLevel: RiskLevel;
  trend: TrendType;
  sources: string[];
  region: string;
  language: string;
  updatedAt: string;
  articleSummaries: ArticleSummary[];
  spreadAccounts: SpreadAccount[];
  narrativeAngles: NarrativeAngle[];
  eventTimeline: TimelineEvent[];
}

export interface DutyRecord {
  id: string;
  topicId: string;
  topicTitle: string;
  opinion: string;
  department: string;
  needReport: boolean;
  reporter: string;
  createdAt: string;
  status: RecordStatus;
}

export interface FilterParams {
  region: string;
  language: string;
  timeRange: string;
}

export interface DashboardStats {
  totalTopics: number;
  risingTopics: number;
  highRiskTopics: number;
  sourceCount: number;
}
