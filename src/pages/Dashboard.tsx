import { Fingerprint, AlertTriangle, Shield, Link2 } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RiskDistributionChart } from "@/components/dashboard/RiskDistributionChart";
import { RecentAlerts } from "@/components/dashboard/RecentAlerts";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";

export default function Dashboard() {
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
          value="1,046"
          subtitle="Last 30 days"
          icon={Fingerprint}
          trend={{ value: 12, isPositive: true }}
          variant="default"
        />
        <MetricCard
          title="Suspicious Cases"
          value="156"
          subtitle="Requires review"
          icon={AlertTriangle}
          trend={{ value: 8, isPositive: false }}
          variant="warning"
        />
        <MetricCard
          title="High Risk Alerts"
          value="43"
          subtitle="Critical attention"
          icon={Shield}
          trend={{ value: 15, isPositive: false }}
          variant="danger"
        />
        <MetricCard
          title="Blockchain Records"
          value="2,847"
          subtitle="Immutable logs"
          icon={Link2}
          trend={{ value: 23, isPositive: true }}
          variant="success"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskDistributionChart />
        <ActivityTimeline />
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAlerts />
        
        {/* System Status */}
        <div className="glass-panel p-6 fade-in">
          <h3 className="text-lg font-semibold text-foreground mb-4">System Status</h3>
          <div className="space-y-4">
            {[
              { name: "AI Analysis Engine", status: "operational", latency: "45ms" },
              { name: "Blockchain Network", status: "operational", latency: "120ms" },
              { name: "Database Cluster", status: "operational", latency: "12ms" },
              { name: "Authentication Service", status: "operational", latency: "28ms" },
            ].map((service) => (
              <div key={service.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-sm font-medium text-foreground">{service.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-muted-foreground">{service.latency}</span>
                  <span className="text-xs text-success capitalize">{service.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
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
