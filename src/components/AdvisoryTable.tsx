import { useState } from 'react';
import { Advisory } from '@/types/advisory';
import { SeverityBadge } from './SeverityBadge';
import { format, parseISO } from 'date-fns';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdvisoryTableProps {
  advisories: Advisory[];
  onRowClick?: (advisory: Advisory) => void;
}

type SortField = 'published_date' | 'severity' | 'vendor' | 'cve_id';
type SortDirection = 'asc' | 'desc';

const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };

export function AdvisoryTable({ advisories, onRowClick }: AdvisoryTableProps) {
  const [sortField, setSortField] = useState<SortField>('published_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedAdvisories = [...advisories].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case 'published_date':
        comparison = new Date(a.published_date).getTime() - new Date(b.published_date).getTime();
        break;
      case 'severity':
        comparison = severityOrder[a.severity] - severityOrder[b.severity];
        break;
      case 'vendor':
        comparison = a.vendor.localeCompare(b.vendor);
        break;
      case 'cve_id':
        comparison = a.cve_id.localeCompare(b.cve_id);
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-3 w-3" />
    ) : (
      <ChevronDown className="h-3 w-3" />
    );
  };

  const HeaderCell = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <SortIcon field={field} />
      </div>
    </th>
  );

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30 border-b border-border/50">
            <tr>
              <HeaderCell field="cve_id">CVE ID</HeaderCell>
              <HeaderCell field="vendor">Vendor</HeaderCell>
              <HeaderCell field="severity">Severity</HeaderCell>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Summary
              </th>
              <HeaderCell field="published_date">Published</HeaderCell>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Link
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {sortedAdvisories.map((advisory, index) => (
              <tr
                key={advisory.id}
                className={cn(
                  'hover:bg-muted/20 transition-colors cursor-pointer animate-fade-in',
                  advisory.severity === 'Critical' && 'bg-severity-critical/5'
                )}
                style={{ animationDelay: `${index * 30}ms` }}
                onClick={() => onRowClick?.(advisory)}
              >
                <td className="px-4 py-3">
                  <span className="font-mono text-sm text-primary font-medium">
                    {advisory.cve_id}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-foreground">{advisory.vendor}</span>
                </td>
                <td className="px-4 py-3">
                  <SeverityBadge severity={advisory.severity} size="sm" />
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-muted-foreground">{advisory.product}</span>
                </td>
                <td className="px-4 py-3 max-w-md">
                  <span className="text-sm text-muted-foreground line-clamp-2">
                    {advisory.summary}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {format(parseISO(advisory.published_date), 'MMM d, yyyy')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={advisory.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sortedAdvisories.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-muted-foreground">No advisories match your filters</p>
        </div>
      )}
    </div>
  );
}
