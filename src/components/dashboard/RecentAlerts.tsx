import { useState, useEffect } from "react";
import { AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: number;
  type: "high" | "suspicious" | "normal";
  title: string;
  caseId: string;
  time: string;
  sector: string;
}

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
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch("http://localhost:8000/history?limit=5");
        if (response.ok) {
          const data = await response.json();
          setAlerts(data);
        }
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel p-6 fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Alerts</h3>
        <button className="text-sm text-primary hover:underline">View All</button>
      </div>
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No recent activity detected.</p>
        ) : (
          alerts.map((alert) => {
            const config = typeConfig[alert.type];
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
          })
        )}
      </div>
    </div>
  );
}
