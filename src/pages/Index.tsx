import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { StatCard } from '@/components/StatCard';
import { SeverityPieChart } from '@/components/charts/SeverityPieChart';
import { VendorBarChart } from '@/components/charts/VendorBarChart';
import { TimelineChart } from '@/components/charts/TimelineChart';
import { AdvisoryTable } from '@/components/AdvisoryTable';
import { FilterPanel } from '@/components/FilterPanel';
import { AdvisoryDetailModal } from '@/components/AdvisoryDetailModal';
import { 
  mockAdvisories, 
  mockSeverityStats, 
  mockVendorStats, 
  mockTimelineStats,
  allVendors,
  allProducts 
} from '@/data/mockAdvisories';
import { Advisory, FilterState } from '@/types/advisory';
import { AlertTriangle, ShieldAlert, ShieldCheck, Activity, Building2 } from 'lucide-react';
import { isWithinInterval, parseISO } from 'date-fns';
import { toast } from 'sonner';

const initialFilters: FilterState = {
  vendors: [],
  severities: [],
  products: [],
  dateRange: { start: null, end: null },
  searchQuery: '',
};

const Index = () => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedAdvisory, setSelectedAdvisory] = useState<Advisory | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredAdvisories = useMemo(() => {
    return mockAdvisories.filter((advisory) => {
      // Vendor filter
      if (filters.vendors.length > 0 && !filters.vendors.includes(advisory.vendor)) {
        return false;
      }

      // Severity filter
      if (filters.severities.length > 0 && !filters.severities.includes(advisory.severity)) {
        return false;
      }

      // Product filter
      if (filters.products.length > 0 && !filters.products.includes(advisory.product)) {
        return false;
      }

      // Date range filter
      if (filters.dateRange.start && filters.dateRange.end) {
        const advisoryDate = parseISO(advisory.published_date);
        if (!isWithinInterval(advisoryDate, { start: filters.dateRange.start, end: filters.dateRange.end })) {
          return false;
        }
      }

      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchable = `${advisory.cve_id} ${advisory.vendor} ${advisory.product} ${advisory.summary}`.toLowerCase();
        if (!searchable.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    toast.success('Advisories synchronized', {
      description: 'Data refreshed from all configured sources',
    });
  };

  const handleExportPDF = () => {
    toast.info('PDF Export', {
      description: 'Connect Lovable Cloud to enable PDF report generation',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-severity-critical/3 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        <Header onRefresh={handleRefresh} onExportPDF={handleExportPDF} isRefreshing={isRefreshing} />

        <main className="container mx-auto px-4 py-6 space-y-6">
          {/* Stats Overview */}
          <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard
              title="Total Advisories"
              value={mockAdvisories.length}
              subtitle="All time"
              icon={Activity}
              variant="primary"
            />
            <StatCard
              title="Critical"
              value={mockSeverityStats.critical}
              subtitle="Immediate action required"
              icon={AlertTriangle}
              variant="critical"
              trend={{ value: 20, isPositive: false }}
            />
            <StatCard
              title="High"
              value={mockSeverityStats.high}
              subtitle="High priority"
              icon={ShieldAlert}
              variant="high"
            />
            <StatCard
              title="Medium / Low"
              value={mockSeverityStats.medium + mockSeverityStats.low}
              subtitle="Monitor & patch"
              icon={ShieldCheck}
              variant="low"
            />
            <StatCard
              title="Vendors"
              value={allVendors.length}
              subtitle="Configured sources"
              icon={Building2}
              variant="default"
            />
          </section>

          {/* Charts Row */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <SeverityPieChart data={mockSeverityStats} />
            <VendorBarChart data={mockVendorStats} />
            <TimelineChart data={mockTimelineStats} />
          </section>

          {/* Filters */}
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            vendors={allVendors}
            products={allProducts}
          />

          {/* Advisory Table */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Security Advisories
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({filteredAdvisories.length} of {mockAdvisories.length})
                </span>
              </h2>
            </div>
            <AdvisoryTable
              advisories={filteredAdvisories}
              onRowClick={(advisory) => setSelectedAdvisory(advisory)}
            />
          </section>
        </main>

        {/* Detail Modal */}
        <AdvisoryDetailModal
          advisory={selectedAdvisory}
          open={!!selectedAdvisory}
          onClose={() => setSelectedAdvisory(null)}
        />
      </div>
    </div>
  );
};

export default Index;