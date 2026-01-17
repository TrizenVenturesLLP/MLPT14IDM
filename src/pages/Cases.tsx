import { FolderOpen, Search, Plus, Eye, Clock, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const cases = [
  {
    id: "CASE-2024-0156",
    title: "Identity Fraud Investigation - Metro Hospital",
    status: "active",
    priority: "high",
    assignee: "Dr. Sarah Mitchell",
    fingerprintsAnalyzed: 12,
    alertCount: 3,
    createdAt: "2024-01-15",
    updatedAt: "2 hours ago",
  },
  {
    id: "CASE-2024-0155",
    title: "Post-Mortem Misuse - State Forensic Lab",
    status: "active",
    priority: "critical",
    assignee: "Agent James Wilson",
    fingerprintsAnalyzed: 8,
    alertCount: 5,
    createdAt: "2024-01-14",
    updatedAt: "30 minutes ago",
  },
  {
    id: "CASE-2024-0152",
    title: "Cross-Border Identity Check",
    status: "pending_review",
    priority: "medium",
    assignee: "Officer Maria Garcia",
    fingerprintsAnalyzed: 23,
    alertCount: 1,
    createdAt: "2024-01-12",
    updatedAt: "1 day ago",
  },
  {
    id: "CASE-2024-0148",
    title: "Banking Fraud Prevention Audit",
    status: "closed",
    priority: "low",
    assignee: "Analyst Tom Brown",
    fingerprintsAnalyzed: 156,
    alertCount: 0,
    createdAt: "2024-01-08",
    updatedAt: "5 days ago",
  },
  {
    id: "CASE-2024-0145",
    title: "Multi-Sector Usage Pattern Analysis",
    status: "active",
    priority: "high",
    assignee: "Dr. Sarah Mitchell",
    fingerprintsAnalyzed: 45,
    alertCount: 7,
    createdAt: "2024-01-05",
    updatedAt: "4 hours ago",
  },
];

const statusConfig = {
  active: { label: "Active", class: "bg-primary/20 text-primary border-primary/30" },
  pending_review: { label: "Pending Review", class: "bg-warning/20 text-warning border-warning/30" },
  closed: { label: "Closed", class: "bg-muted text-muted-foreground border-border" },
};

const priorityConfig = {
  critical: { label: "Critical", class: "text-risk-high" },
  high: { label: "High", class: "text-warning" },
  medium: { label: "Medium", class: "text-primary" },
  low: { label: "Low", class: "text-muted-foreground" },
};

export default function Cases() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Case Records</h1>
          <p className="text-muted-foreground">
            Manage and track fingerprint investigation cases
          </p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          New Case
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 glass-panel p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search cases by ID, title, or assignee..." className="pl-10 bg-muted/30 border-border" />
          </div>
        </div>
        <div className="glass-panel p-4 text-center">
          <p className="text-2xl font-bold text-primary">24</p>
          <p className="text-xs text-muted-foreground">Active Cases</p>
        </div>
        <div className="glass-panel p-4 text-center">
          <p className="text-2xl font-bold text-success">156</p>
          <p className="text-xs text-muted-foreground">Closed This Month</p>
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {cases.map((caseItem) => {
          const status = statusConfig[caseItem.status as keyof typeof statusConfig];
          const priority = priorityConfig[caseItem.priority as keyof typeof priorityConfig];

          return (
            <div
              key={caseItem.id}
              className="glass-panel p-5 hover:bg-card/90 transition-colors cursor-pointer fade-in"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <FolderOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-sm text-primary">{caseItem.id}</span>
                      <Badge className={cn("text-xs", status.class)}>
                        {status.label}
                      </Badge>
                      <span className={cn("text-xs font-medium", priority.class)}>
                        ● {priority.label} Priority
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{caseItem.title}</h3>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {caseItem.assignee}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Updated {caseItem.updatedAt}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{caseItem.fingerprintsAnalyzed}</p>
                    <p className="text-xs text-muted-foreground">Fingerprints</p>
                  </div>
                  <div className="text-center">
                    <p className={cn(
                      "text-2xl font-bold",
                      caseItem.alertCount > 3 ? "text-risk-high" : caseItem.alertCount > 0 ? "text-warning" : "text-success"
                    )}>
                      {caseItem.alertCount}
                    </p>
                    <p className="text-xs text-muted-foreground">Alerts</p>
                  </div>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Showing 5 of 180 cases</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
}
