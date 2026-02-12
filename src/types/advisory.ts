export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Advisory {
  id: string;
  vendor: string;
  cve_id: string;
  severity: Severity;
  summary: string;
  product: string;
  published_date: string;
  url: string;
  affected_versions?: string;
  inserted_at: string;
}

export interface SeverityStats {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface VendorStats {
  vendor: string;
  count: number;
}

export interface TimelineStats {
  date: string;
  count: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface FilterState {
  vendors: string[];
  severities: Severity[];
  products: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  searchQuery: string;
}
