import { Advisory } from '@/types/advisory';
import { SeverityBadge } from './SeverityBadge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, Building2, Package, Clock, Shield } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface AdvisoryDetailModalProps {
  advisory: Advisory | null;
  open: boolean;
  onClose: () => void;
}

export function AdvisoryDetailModal({ advisory, open, onClose }: AdvisoryDetailModalProps) {
  if (!advisory) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl glass border-border/50">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <span className="font-mono text-lg text-primary font-semibold">
                {advisory.cve_id}
              </span>
              <DialogTitle className="text-xl font-semibold text-foreground leading-tight">
                {advisory.summary.length > 100
                  ? advisory.summary.slice(0, 100) + '...'
                  : advisory.summary}
              </DialogTitle>
            </div>
            <SeverityBadge severity={advisory.severity} size="lg" />
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Vendor</p>
                <p className="text-sm font-medium text-foreground">{advisory.vendor}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Package className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Product</p>
                <p className="text-sm font-medium text-foreground">{advisory.product}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Published</p>
                <p className="text-sm font-medium text-foreground">
                  {format(parseISO(advisory.published_date), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Added</p>
                <p className="text-sm font-medium text-foreground">
                  {format(parseISO(advisory.inserted_at), 'MMM d, yyyy HH:mm')}
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Summary
            </h4>
            <p className="text-sm text-foreground leading-relaxed">{advisory.summary}</p>
          </div>

          {/* Affected Versions */}
          {advisory.affected_versions && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Affected Versions
              </h4>
              <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                <p className="text-sm text-foreground font-mono">{advisory.affected_versions}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button asChild>
              <a href={advisory.url} target="_blank" rel="noopener noreferrer">
                View Advisory
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
