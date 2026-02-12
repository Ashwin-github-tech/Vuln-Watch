import { Button } from '@/components/ui/button';
import { Shield, Download, RefreshCw, Bell, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onExportPDF?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function Header({ onExportPDF, onRefresh, isRefreshing }: HeaderProps) {
  return (
    <header className="glass border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <div className="relative p-2 rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-lg">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">VulnWatch</h1>
              <p className="text-xs text-muted-foreground">OEM Advisory Intelligence</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className={cn('h-4 w-4 mr-2', isRefreshing && 'animate-spin')} />
              Sync
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onExportPDF}
              className="text-muted-foreground hover:text-foreground"
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>

            <div className="w-px h-6 bg-border/50 mx-1" />

            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Bell className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
