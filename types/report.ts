// Type definitions for the premium report feature

export interface CheckResult {
  id: string;
  label: string;
  status: 'pass' | 'fail' | 'warning';
  score: number;
  details: string;
  recommendation: string;
}

export interface AIInsight {
  id: string;
  label: string;
  score: number;
  status: 'pass' | 'warning' | 'fail';
  details: string;
  recommendation: string;
  actionItems?: string[];
}

export interface PageAnalysis {
  url: string;
  title: string;
  overallScore: number;
  checks: CheckResult[];
  aiInsights?: AIInsight[];
  analyzedAt: string;
}

export interface AggregatedCheck {
  id: string;
  label: string;
  averageScore: number;
  status: 'pass' | 'warning' | 'fail';
  pagesAffected: number;
  totalPages: number;
  issues: string[];
  recommendation: string;
}

export interface RoadmapItem {
  priority: number;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  category: string;
  affectedPages: string[];
}

export interface QuickWin {
  title: string;
  description: string;
  estimatedImpact: number; // Score increase estimate
  timeToImplement: string; // e.g., "5 minutes", "1 hour"
}

export interface CodeSnippet {
  title: string;
  description: string;
  language: string;
  code: string;
  fileToModify?: string;
  relatedCheck: string; // CheckResult ID
}

export interface GuideSection {
  title: string;
  description: string;
  steps: string[];
  relatedChecks: string[]; // CheckResult IDs
}

export interface ReportData {
  id: string;
  url: string;
  email: string;
  createdAt: string;

  // Summary scores
  overallScore: number;
  siteWideScore: number;
  pagesAnalyzed: number;

  // Detailed analysis
  pages: PageAnalysis[];
  aggregatedChecks: AggregatedCheck[];

  // Premium deliverables
  roadmap: RoadmapItem[];
  quickWins: QuickWin[];
  codeSnippets: CodeSnippet[];
  plainEnglishGuide: GuideSection[];

  // Metadata
  generatedAt: string;
  pdfUrl?: string;
}

export interface Order {
  sessionId: string;
  email: string;
  url: string;
  reportId: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  errorMessage?: string;
}
