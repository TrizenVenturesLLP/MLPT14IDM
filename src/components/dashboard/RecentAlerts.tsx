import { AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const alerts = [
  {
    id: 1,
    type: "high",
    title: "Post-mortem fingerprint usage detected",
    caseId: "FP-2024-0892",
    time: "2 minutes ago",
    sector: "Forensic",
  },
  {
    id: 2,
    type: "suspicious",
    title: "Unusual cross-sector activity pattern",
    caseId: "FP-2024-0891",
    time: "15 minutes ago",
    sector: "Hospital",
  },
  {
    id: 3,
    type: "suspicious",
    title: "Identity status mismatch detected",
    caseId: "FP-2024-0890",
    time: "1 hour ago",
    sector: "Forensic",
  },
  {
    id: 4,
    type: "normal",
    title: "Routine verification completed",
    caseId: "FP-2024-0889",
    time: "2 hours ago",
    sector: "Hospital",
  },
  {
    id: 5,
    type: "high",
    title: "Ridge pattern degradation anomaly",
    caseId: "FP-2024-0888",
    time: "3 hours ago",
    sector: "Forensic",
  },
];

const typeConfig = {
  high: {
    icon: AlertTriangle,
    badgeClass: "risk-badge-high",
    iconClass: "text-risk-high",
  },
  suspicious: {
    icon: AlertCircle,
    badgeClass: "risk-badge-suspicious",
    iconClass: "text-warning",
  },
  normal: {
    icon: CheckCircle2,
    badgeClass: "risk-badge-normal",
    iconClass: "text-success",
  },
};

export function RecentAlerts() {
  return (
    <div className="glass-panel p-6 fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Alerts</h3>
        <button className="text-sm text-primary hover:underline">View All</button>
      </div>
      <div className="space-y-3">
        {alerts.map((alert) => {
          const config = typeConfig[alert.type as keyof typeof typeConfig];
          const Icon = config.icon;
          return (
            <div
              key={alert.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className={cn("p-2 rounded-lg", `bg-${alert.type === 'high' ? 'risk-high' : alert.type === 'suspicious' ? 'warning' : 'success'}/10`)}>
                <Icon className={cn("w-4 h-4", config.iconClass)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {alert.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono text-muted-foreground">
                    {alert.caseId}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{alert.sector}</span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {alert.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
