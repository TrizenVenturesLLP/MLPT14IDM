import { Brain, Activity, Fingerprint, Shield, CheckCircle2, AlertCircle, Zap, Database } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const agents = [
  {
    id: 1,
    name: "Usage Pattern Agent",
    description: "Analyzes fingerprint usage frequency, cross-case reuse patterns, and activity anomalies",
    icon: Activity,
    status: "active",
    accuracy: 94.2,
    processedToday: 342,
    avgProcessingTime: "0.8s",
    metrics: [
      { label: "Pattern Detection", value: 96 },
      { label: "Anomaly Identification", value: 92 },
      { label: "False Positive Rate", value: 3.2 },
    ],
    recentFindings: [
      "Detected 12 cross-case reuse patterns in last 24h",
      "Flagged 3 sudden activity spikes after prolonged inactivity",
    ],
  },
  {
    id: 2,
    name: "Post-Mortem Indicator Agent",
    description: "Evaluates biometric quality indicators for signs of post-mortem tissue degradation",
    icon: Fingerprint,
    status: "active",
    accuracy: 91.8,
    processedToday: 298,
    avgProcessingTime: "1.2s",
    metrics: [
      { label: "Ridge Analysis", value: 94 },
      { label: "Texture Evaluation", value: 89 },
      { label: "Degradation Detection", value: 92 },
    ],
    recentFindings: [
      "Identified 4 samples with significant degradation markers",
      "Ridge clarity anomalies detected in 8 samples",
    ],
  },
  {
    id: 3,
    name: "Context Reasoning Agent",
    description: "Cross-validates identity status against usage patterns and synthesizes final risk assessments",
    icon: Brain,
    status: "active",
    accuracy: 96.5,
    processedToday: 342,
    avgProcessingTime: "0.5s",
    metrics: [
      { label: "Status Verification", value: 98 },
      { label: "Context Analysis", value: 95 },
      { label: "Verdict Accuracy", value: 97 },
    ],
    recentFindings: [
      "3 critical status mismatches identified and escalated",
      "Combined reasoning flagged 7 high-risk cases",
    ],
  },
];

export default function Agents() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Agent Explanations</h1>
          <p className="text-muted-foreground">
            Understand how our AI agents analyze and assess fingerprint usage risks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm text-muted-foreground">All agents operational</span>
        </div>
      </div>

      {/* Agent Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/20">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">3</p>
            <p className="text-xs text-muted-foreground">Active Agents</p>
          </div>
        </div>
        <div className="glass-panel p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-success/20">
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">94.2%</p>
            <p className="text-xs text-muted-foreground">Avg. Accuracy</p>
          </div>
        </div>
        <div className="glass-panel p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-warning/20">
            <Database className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">982</p>
            <p className="text-xs text-muted-foreground">Processed Today</p>
          </div>
        </div>
        <div className="glass-panel p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/20">
            <AlertCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">0.83s</p>
            <p className="text-xs text-muted-foreground">Avg. Response Time</p>
          </div>
        </div>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const Icon = agent.icon;
          return (
            <div key={agent.id} className="glass-panel p-6 space-y-5 fade-in">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/20">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{agent.name}</h3>
                    <Badge className="mt-1 bg-success/20 text-success border-success/30">
                      <div className="w-1.5 h-1.5 rounded-full bg-success mr-1" />
                      Active
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground">{agent.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-lg font-bold text-success">{agent.accuracy}%</p>
                  <p className="text-xs text-muted-foreground">Accuracy</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-lg font-bold text-foreground">{agent.processedToday}</p>
                  <p className="text-xs text-muted-foreground">Today</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <p className="text-lg font-bold text-primary">{agent.avgProcessingTime}</p>
                  <p className="text-xs text-muted-foreground">Avg. Time</p>
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Performance Metrics</p>
                {agent.metrics.map((metric) => (
                  <div key={metric.label} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{metric.label}</span>
                      <span className="text-foreground font-medium">{metric.value}%</span>
                    </div>
                    <Progress value={metric.value} className="h-1.5" />
                  </div>
                ))}
              </div>

              {/* Recent Findings */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recent Findings</p>
                {agent.recentFindings.map((finding, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 rounded bg-muted/20">
                    <Shield className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">{finding}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Explainability Note */}
      <div className="glass-panel p-4 border-l-4 border-primary">
        <div className="flex items-start gap-3">
          <Brain className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">AI Transparency & Explainability</p>
            <p className="text-xs text-muted-foreground mt-1">
              All AI agent decisions are fully explainable and auditable. Each risk assessment includes detailed reasoning 
              from all three agents, allowing investigators to understand and verify the basis for any flag or alert.
              This system is designed to support human decision-making, not replace it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
