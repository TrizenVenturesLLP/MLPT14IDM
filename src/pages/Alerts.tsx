import { useState } from "react";
import { AlertTriangle, AlertCircle, Filter, Eye, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const alerts = [
  {
    id: 1,
    caseId: "FP-2024-0892",
    title: "Post-mortem fingerprint usage detected",
    description: "Fingerprint used 3 days after identity marked as deceased",
    severity: "critical",
    sector: "Forensic",
    location: "NYC Crime Lab",
    timestamp: "2024-01-18 14:32:15",
    status: "unreviewed",
    riskScore: 87,
  },
  {
    id: 2,
    caseId: "FP-2024-0889",
    title: "Identity impersonation pattern detected",
    description: "Same fingerprint used across 4 unrelated cases within 24 hours",
    severity: "critical",
    sector: "Hospital",
    location: "Metro General Hospital",
    timestamp: "2024-01-18 11:02:44",
    status: "under_review",
    riskScore: 91,
  },
  {
    id: 3,
    caseId: "FP-2024-0885",
    title: "Sudden activity after prolonged inactivity",
    description: "Fingerprint reactivated after 14 months of no recorded usage",
    severity: "high",
    sector: "Border Control",
    location: "JFK International",
    timestamp: "2024-01-17 22:15:33",
    status: "unreviewed",
    riskScore: 78,
  },
  {
    id: 4,
    caseId: "FP-2024-0881",
    title: "Cross-sector unauthorized access",
    description: "Forensic-only fingerprint used in banking verification system",
    severity: "high",
    sector: "Banking",
    location: "First National Bank",
    timestamp: "2024-01-17 16:45:22",
    status: "resolved",
    riskScore: 72,
  },
  {
    id: 5,
    caseId: "FP-2024-0878",
    title: "Biometric degradation anomaly",
    description: "Ridge pattern quality degraded 40% below baseline",
    severity: "critical",
    sector: "Forensic",
    location: "State Forensic Lab",
    timestamp: "2024-01-17 09:18:09",
    status: "escalated",
    riskScore: 85,
  },
];

const severityConfig = {
  critical: { label: "Critical", class: "risk-badge-high", icon: AlertTriangle },
  high: { label: "High", class: "risk-badge-suspicious", icon: AlertCircle },
};

const statusConfig = {
  unreviewed: { label: "Unreviewed", class: "bg-muted text-muted-foreground" },
  under_review: { label: "Under Review", class: "bg-primary/20 text-primary" },
  escalated: { label: "Escalated", class: "bg-risk-high/20 text-risk-high" },
  resolved: { label: "Resolved", class: "bg-success/20 text-success" },
};

export default function Alerts() {
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");

  const filteredAlerts = selectedSeverity === "all" 
    ? alerts 
    : alerts.filter(a => a.severity === selectedSeverity);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Risk Alerts</h1>
          <p className="text-muted-foreground">
            Monitor and investigate high-risk fingerprint usage cases
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="w-3 h-3" />
            3 Critical
          </Badge>
          <Badge className="bg-warning/20 text-warning border-warning/30 gap-1">
            <AlertCircle className="w-3 h-3" />
            2 High
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-panel p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input placeholder="Search alerts..." className="bg-muted/30 border-border" />
          </div>
          <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
            <SelectTrigger className="w-40 bg-muted/30 border-border">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-40 bg-muted/30 border-border">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="unreviewed">Unreviewed</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="escalated">Escalated</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const severity = severityConfig[alert.severity as keyof typeof severityConfig];
          const status = statusConfig[alert.status as keyof typeof statusConfig];
          const SeverityIcon = severity.icon;

          return (
            <div
              key={alert.id}
              className={cn(
                "glass-panel p-5 border-l-4 hover:bg-card/90 transition-colors cursor-pointer fade-in",
                alert.severity === "critical" ? "border-l-risk-high" : "border-l-warning"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={cn(
                    "p-3 rounded-lg",
                    alert.severity === "critical" ? "bg-risk-high/20" : "bg-warning/20"
                  )}>
                    <SeverityIcon className={cn(
                      "w-5 h-5",
                      alert.severity === "critical" ? "text-risk-high" : "text-warning"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-sm text-primary">{alert.caseId}</span>
                      <span className={cn("px-2 py-0.5 rounded text-xs", severity.class)}>
                        {severity.label}
                      </span>
                      <span className={cn("px-2 py-0.5 rounded text-xs", status.class)}>
                        {status.label}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{alert.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {alert.location} ({alert.sector})
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {alert.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Risk Score</p>
                    <p className={cn(
                      "text-2xl font-bold",
                      alert.riskScore >= 80 ? "text-risk-high" : "text-warning"
                    )}>
                      {alert.riskScore}%
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Eye className="w-4 h-4" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Showing {filteredAlerts.length} of 43 high-risk alerts</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
}
