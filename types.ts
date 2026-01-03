
export enum IdeaStatus {
  DRAFT = 'DRAFT',
  GATED = 'GATED',
  APPROVED = 'APPROVED',
  PRODUCTION = 'PRODUCTION',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
  ANALYZED = 'ANALYZED',
  ARCHIVED = 'ARCHIVED'
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetMetric: string;
  deadline: string;
  createdAt: string;
}

export interface Idea {
  id: string;
  title: string;
  content: string;
  status: IdeaStatus;
  goalId?: string;
  cdfScore?: CDFScore;
  variants?: AOCEVariant[];
  brief?: ProductionBrief;
  createdAt: string;
}

export interface CDFScore {
  alignment: number;
  feasibility: number;
  impact: number;
  novelty: number;
  totalScore: number;
  decision: 'START' | 'STOP';
  rationale: string;
}

export interface AOCEVariant {
  title: string;
  hook: string;
  format: string;
  length: string;
  suggested_cta: string;
  tags: string[];
  confidence_score: number;
}

export interface ProductionBrief {
  storyboard: string[];
  assetsList: string[];
  shotList: string[];
  editNotes: string;
}

export interface AnalyticsEvent {
  id: string;
  eventId: string;
  timestamp: string;
  type: string;
  payload: any;
}

export interface MarketplaceOffer {
  id: string;
  name: string;
  provider: string;
  price: string;
  description: string;
}
