import { Link2, Lock, ExternalLink, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const blockchainLogs = [
  {
    caseId: "FP-2024-0892",
    fingerprintHash: "0x7f3a8c9d2e1b4f6a8c9d2e1b4f6a8c9d2e1b4f6a",
    riskScore: 87,
    riskLevel: "high",
    timestamp: "2024-01-18 14:32:15",
    txHash: "0xabc123def456789abc123def456789abc123def456789abc123def456789abc1",
  },
  {
    caseId: "FP-2024-0891",
    fingerprintHash: "0x2b4f6a8c9d2e1b4f6a8c9d2e1b4f6a8c9d2e1b4f",
    riskScore: 56,
    riskLevel: "suspicious",
    timestamp: "2024-01-18 13:45:22",
    txHash: "0xdef456789abc123def456789abc123def456789abc123def456789abc123def4",
  },
  {
    caseId: "FP-2024-0890",
    fingerprintHash: "0x9d2e1b4f6a8c9d2e1b4f6a8c9d2e1b4f6a8c9d2e",
    riskScore: 12,
    riskLevel: "normal",
    timestamp: "2024-01-18 12:18:09",
    txHash: "0x789abc123def456789abc123def456789abc123def456789abc123def456789a",
  },
  {
    caseId: "FP-2024-0889",
    fingerprintHash: "0x1b4f6a8c9d2e1b4f6a8c9d2e1b4f6a8c9d2e1b4f",
    riskScore: 91,
    riskLevel: "high",
    timestamp: "2024-01-18 11:02:44",
    txHash: "0x123def456789abc123def456789abc123def456789abc123def456789abc123d",
  },
  {
    caseId: "FP-2024-0888",
    fingerprintHash: "0x6a8c9d2e1b4f6a8c9d2e1b4f6a8c9d2e1b4f6a8c",
    riskScore: 8,
    riskLevel: "normal",
    timestamp: "2024-01-18 10:15:33",
    txHash: "0x456789abc123def456789abc123def456789abc123def456789abc123def4567",
  },
  {
    caseId: "FP-2024-0887",
    fingerprintHash: "0x4f6a8c9d2e1b4f6a8c9d2e1b4f6a8c9d2e1b4f6a",
    riskScore: 43,
    riskLevel: "suspicious",
    timestamp: "2024-01-18 09:28:51",
    txHash: "0x89abc123def456789abc123def456789abc123def456789abc123def456789ab",
  },
];

const riskBadge = {
  high: "risk-badge-high",
  suspicious: "risk-badge-suspicious",
  normal: "risk-badge-normal",
};

export default function Blockchain() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blockchain Audit Logs</h1>
          <p className="text-muted-foreground">
            Immutable records of all fingerprint analysis transactions
          </p>
        </div>
        <Badge className="blockchain-verified gap-2">
          <Lock className="w-3 h-3" />
          Verified & Immutable
        </Badge>
      </div>

      {/* Search and Filter */}
      <div className="glass-panel p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by Case ID, Hash, or Transaction..."
              className="pl-10 bg-muted/30 border-border"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 text-center">
          <p className="text-2xl font-bold text-foreground">2,847</p>
          <p className="text-xs text-muted-foreground">Total Records</p>
        </div>
        <div className="glass-panel p-4 text-center">
          <p className="text-2xl font-bold text-success">100%</p>
          <p className="text-xs text-muted-foreground">Verification Rate</p>
        </div>
        <div className="glass-panel p-4 text-center">
          <p className="text-2xl font-bold text-primary">~2.3s</p>
          <p className="text-xs text-muted-foreground">Avg. Confirmation</p>
        </div>
        <div className="glass-panel p-4 text-center">
          <p className="text-2xl font-bold text-foreground">Block #847,293</p>
          <p className="text-xs text-muted-foreground">Latest Block</p>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel overflow-hidden">
        <table className="data-table">
          <thead>
            <tr className="bg-muted/30">
              <th>Case ID</th>
              <th>Fingerprint Hash</th>
              <th>Risk Score</th>
              <th>Timestamp</th>
              <th>Transaction Hash</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {blockchainLogs.map((log) => (
              <tr key={log.caseId} className="hover:bg-muted/20 transition-colors">
                <td className="font-mono text-primary">{log.caseId}</td>
                <td className="font-mono text-xs text-muted-foreground">
                  {log.fingerprintHash.slice(0, 10)}...{log.fingerprintHash.slice(-8)}
                </td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${riskBadge[log.riskLevel as keyof typeof riskBadge]}`}>
                    {log.riskScore}%
                  </span>
                </td>
                <td className="text-sm text-muted-foreground">{log.timestamp}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      {log.txHash.slice(0, 10)}...{log.txHash.slice(-6)}
                    </span>
                    <button className="text-primary hover:text-primary/80 transition-colors">
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1 text-success">
                    <Lock className="w-3 h-3" />
                    <span className="text-xs">Verified</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Showing 6 of 2,847 records</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
}
