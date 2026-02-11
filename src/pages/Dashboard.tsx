import { useState, useEffect } from "react";
import { Fingerprint, AlertTriangle, Shield, Link2 } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RiskDistributionChart } from "@/components/dashboard/RiskDistributionChart";
import { RecentAlerts } from "@/components/dashboard/RecentAlerts";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";

interface DashboardStats {
  total: number;
  suspicious: number;
  highRisk: number;
  totalRecords: number;
  activity: any[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    suspicious: 0,
    highRisk: 0,
    totalRecords: 0,
    activity: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:8000/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            System overview and real-time monitoring
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span>All systems operational</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Fingerprints Analyzed"
          value={stats.total.toLocaleString()}
          subtitle="All time"
          icon={Fingerprint}
          trend={{ value: 0, isPositive: true }}
          variant="default"
        />
        <MetricCard
          title="Suspicious Cases"
          value={stats.suspicious.toLocaleString()}
          subtitle="Requires review"
          icon={AlertTriangle}
          trend={{ value: 0, isPositive: false }}
          variant="warning"
        />
        <MetricCard
          title="High Risk Alerts"
          value={stats.highRisk.toLocaleString()}
          subtitle="Critical attention"
          icon={Shield}
          trend={{ value: 0, isPositive: false }}
          variant="danger"
        />
        <MetricCard
          title="Total Records"
          value={stats.totalRecords.toLocaleString()}
          subtitle="Database entries"
          icon={Shield}
          trend={{ value: 0, isPositive: true }}
          variant="success"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskDistributionChart suspicious={stats.suspicious} real={stats.total - stats.suspicious} />
        <ActivityTimeline data={stats.activity} />
      </div>

      {/* Alerts Section */}
      <div className="max-w-4xl mx-auto">
        <RecentAlerts />
      </div>

      {/* Disclaimer */}
      <div className="glass-panel p-4 border-l-4 border-warning">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Decision Support System</p>
            <p className="text-xs text-muted-foreground mt-1">
              This system provides analytical insights for investigative purposes only.
              All risk assessments require human verification before any legal conclusions are drawn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
