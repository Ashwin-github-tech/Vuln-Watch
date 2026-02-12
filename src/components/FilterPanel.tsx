import { useState } from 'react';
import { FilterState, Severity } from '@/types/advisory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, X, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  vendors: string[];
  products: string[];
}

const severities: Severity[] = ['Critical', 'High', 'Medium', 'Low'];

const severityColors: Record<Severity, string> = {
  Critical: 'bg-severity-critical',
  High: 'bg-severity-high',
  Medium: 'bg-severity-medium',
  Low: 'bg-severity-low',
};

export function FilterPanel({ filters, onFiltersChange, vendors, products }: FilterPanelProps) {
  const [isVendorOpen, setIsVendorOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);

  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleVendor = (vendor: string) => {
    const newVendors = filters.vendors.includes(vendor)
      ? filters.vendors.filter((v) => v !== vendor)
      : [...filters.vendors, vendor];
    updateFilters({ vendors: newVendors });
  };

  const toggleSeverity = (severity: Severity) => {
    const newSeverities = filters.severities.includes(severity)
      ? filters.severities.filter((s) => s !== severity)
      : [...filters.severities, severity];
    updateFilters({ severities: newSeverities });
  };

  const toggleProduct = (product: string) => {
    const newProducts = filters.products.includes(product)
      ? filters.products.filter((p) => p !== product)
      : [...filters.products, product];
    updateFilters({ products: newProducts });
  };

  const clearFilters = () => {
    onFiltersChange({
      vendors: [],
      severities: [],
      products: [],
      dateRange: { start: null, end: null },
      searchQuery: '',
    });
  };

  const activeFilterCount =
    filters.vendors.length +
    filters.severities.length +
    filters.products.length +
    (filters.dateRange.start ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  return (
    <div className="glass rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search CVEs, vendors, products..."
          value={filters.searchQuery}
          onChange={(e) => updateFilters({ searchQuery: e.target.value })}
          className="pl-9 bg-muted/30 border-border/50"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Severity Filter */}
        <div className="flex items-center gap-1">
          {severities.map((severity) => (
            <button
              key={severity}
              onClick={() => toggleSeverity(severity)}
              className={cn(
                'px-2.5 py-1 text-xs font-medium rounded-md transition-all',
                filters.severities.includes(severity)
                  ? `${severityColors[severity]} text-white shadow-lg`
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              )}
            >
              {severity}
            </button>
          ))}
        </div>

        {/* Vendor Filter */}
        <Popover open={isVendorOpen} onOpenChange={setIsVendorOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'h-7 text-xs border-border/50',
                filters.vendors.length > 0 && 'border-primary text-primary'
              )}
            >
              Vendor
              {filters.vendors.length > 0 && ` (${filters.vendors.length})`}
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="start">
            <div className="space-y-1 max-h-60 overflow-auto">
              {vendors.map((vendor) => (
                <label
                  key={vendor}
                  className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/50 cursor-pointer"
                >
                  <Checkbox
                    checked={filters.vendors.includes(vendor)}
                    onCheckedChange={() => toggleVendor(vendor)}
                  />
                  <span className="text-sm">{vendor}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Product Filter */}
        <Popover open={isProductOpen} onOpenChange={setIsProductOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'h-7 text-xs border-border/50',
                filters.products.length > 0 && 'border-primary text-primary'
              )}
            >
              Product
              {filters.products.length > 0 && ` (${filters.products.length})`}
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" align="start">
            <div className="space-y-1 max-h-60 overflow-auto">
              {products.map((product) => (
                <label
                  key={product}
                  className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/50 cursor-pointer"
                >
                  <Checkbox
                    checked={filters.products.includes(product)}
                    onCheckedChange={() => toggleProduct(product)}
                  />
                  <span className="text-sm">{product}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Date Range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'h-7 text-xs border-border/50',
                filters.dateRange.start && 'border-primary text-primary'
              )}
            >
              <CalendarIcon className="mr-1 h-3 w-3" />
              {filters.dateRange.start
                ? `${format(filters.dateRange.start, 'MMM d')} - ${
                    filters.dateRange.end ? format(filters.dateRange.end, 'MMM d') : '...'
                  }`
                : 'Date Range'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{
                from: filters.dateRange.start || undefined,
                to: filters.dateRange.end || undefined,
              }}
              onSelect={(range) =>
                updateFilters({
                  dateRange: {
                    start: range?.from || null,
                    end: range?.to || null,
                  },
                })
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
