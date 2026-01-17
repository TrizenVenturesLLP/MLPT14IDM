import { CheckCircle2, AlertCircle, AlertTriangle, Brain, Activity, Fingerprint, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";

interface AnalysisResultProps {
  riskLevel: "normal" | "suspicious" | "high";
  riskScore: number;
  summary: string;
  agents: {
    usagePattern: {
      usageFrequency: string;
      unrelatedCaseReuse: boolean;
      inactivityToActivity: boolean;
      riskScore: number;
      reasoning: string;
    };
    postMortem: {
      ridgeClarity: number;
      textureScore: number;
      distortionIndicators: string[];
      confidence: number;
      reasoning: string;
    };
    contextReasoning: {
      statusMismatch: boolean;
      combinedReasoning: string;
      finalVerdict: string;
    };
  };
}

const riskConfig = {
  normal: {
    icon: CheckCircle2,
    label: "NORMAL",
    color: "text-success",
    bg: "bg-success/20",
    border: "border-success/30",
    description: "No anomalies detected in fingerprint usage patterns.",
  },
  suspicious: {
    icon: AlertCircle,
    label: "SUSPICIOUS",
    color: "text-warning",
    bg: "bg-warning/20",
    border: "border-warning/30",
    description: "Unusual patterns detected. Manual review recommended.",
  },
  high: {
    icon: AlertTriangle,
    label: "HIGH RISK",
    color: "text-risk-high",
    bg: "bg-risk-high/20",
    border: "border-risk-high/30",
    description: "Critical anomalies detected. Immediate investigation required.",
  },
};

export function AnalysisResult({ riskLevel, riskScore, summary, agents }: AnalysisResultProps) {
  const config = riskConfig[riskLevel];
  const Icon = config.icon;

  return (
    <div className="space-y-6 fade-in">
      {/* Main Risk Badge */}
      <div className={cn("glass-panel p-8 text-center", config.border, "border-2")}>
        <div className={cn("inline-flex items-center justify-center w-20 h-20 rounded-full mb-4", config.bg)}>
          <Icon className={cn("w-10 h-10", config.color)} />
        </div>
        <h2 className={cn("text-3xl font-bold mb-2", config.color)}>{config.label}</h2>
        <p className="text-muted-foreground max-w-md mx-auto">{config.description}</p>
        
        <div className="mt-6 p-4 rounded-lg bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Risk Score</span>
            <span className={cn("text-2xl font-bold", config.color)}>{riskScore}%</span>
          </div>
          <Progress value={riskScore} className="h-2" />
        </div>
      </div>

      {/* Summary */}
      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Analysis Summary
        </h3>
        <p className="text-muted-foreground leading-relaxed">{summary}</p>
      </div>

      {/* AI Agent Breakdown */}
      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          AI Agent Breakdown
        </h3>

        <Accordion type="multiple" className="space-y-3">
          {/* Agent 1: Usage Pattern Analysis */}
          <AccordionItem value="agent-1" className="border border-border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Agent 1 – Fingerprint Usage Pattern Analysis</p>
                  <p className="text-xs text-muted-foreground">Frequency and cross-case analysis</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Usage Frequency</p>
                    <p className="text-sm font-medium text-foreground">{agents.usagePattern.usageFrequency}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Risk Score</p>
                    <p className={cn("text-sm font-medium", agents.usagePattern.riskScore > 50 ? "text-risk-high" : "text-success")}>
                      {agents.usagePattern.riskScore}%
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={cn(
                    "px-2 py-1 rounded text-xs",
                    agents.usagePattern.unrelatedCaseReuse ? "risk-badge-high" : "risk-badge-normal"
                  )}>
                    {agents.usagePattern.unrelatedCaseReuse ? "Cross-case reuse detected" : "No cross-case reuse"}
                  </span>
                  <span className={cn(
                    "px-2 py-1 rounded text-xs",
                    agents.usagePattern.inactivityToActivity ? "risk-badge-suspicious" : "risk-badge-normal"
                  )}>
                    {agents.usagePattern.inactivityToActivity ? "Inactivity → Activity pattern" : "Normal activity pattern"}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-muted/20 border-l-2 border-primary">
                  <p className="text-xs text-muted-foreground mb-1">Reasoning</p>
                  <p className="text-sm text-foreground">{agents.usagePattern.reasoning}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Agent 2: Post-Mortem Indicator */}
          <AccordionItem value="agent-2" className="border border-border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center">
                  <Fingerprint className="w-4 h-4 text-warning" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Agent 2 – Post-Mortem Indicator Agent</p>
                  <p className="text-xs text-muted-foreground">Biometric degradation analysis</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Ridge Clarity</p>
                    <p className="text-sm font-medium text-foreground">{agents.postMortem.ridgeClarity}%</p>
                    <Progress value={agents.postMortem.ridgeClarity} className="h-1 mt-2" />
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Texture Score</p>
                    <p className="text-sm font-medium text-foreground">{agents.postMortem.textureScore}%</p>
                    <Progress value={agents.postMortem.textureScore} className="h-1 mt-2" />
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                    <p className="text-sm font-medium text-primary">{agents.postMortem.confidence}%</p>
                    <Progress value={agents.postMortem.confidence} className="h-1 mt-2" />
                  </div>
                </div>
                {agents.postMortem.distortionIndicators.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {agents.postMortem.distortionIndicators.map((indicator, i) => (
                      <span key={i} className="px-2 py-1 rounded text-xs risk-badge-suspicious">
                        {indicator}
                      </span>
                    ))}
                  </div>
                )}
                <div className="p-3 rounded-lg bg-muted/20 border-l-2 border-warning">
                  <p className="text-xs text-muted-foreground mb-1">Reasoning</p>
                  <p className="text-sm text-foreground">{agents.postMortem.reasoning}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Agent 3: Context Reasoning */}
          <AccordionItem value="agent-3" className="border border-border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-risk-high/20 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-risk-high" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Agent 3 – Context Reasoning Agent</p>
                  <p className="text-xs text-muted-foreground">Cross-validation and final verdict</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 pt-2">
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Identity Status vs Usage</p>
                  <span className={cn(
                    "px-2 py-1 rounded text-xs",
                    agents.contextReasoning.statusMismatch ? "risk-badge-high" : "risk-badge-normal"
                  )}>
                    {agents.contextReasoning.statusMismatch ? "Mismatch Detected" : "Status Consistent"}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-muted/20 border-l-2 border-risk-high">
                  <p className="text-xs text-muted-foreground mb-1">Combined Reasoning</p>
                  <p className="text-sm text-foreground">{agents.contextReasoning.combinedReasoning}</p>
                </div>
                <div className={cn("p-4 rounded-lg text-center", config.bg, "border", config.border)}>
                  <p className="text-xs text-muted-foreground mb-1">Final Verdict</p>
                  <p className={cn("text-lg font-bold", config.color)}>{agents.contextReasoning.finalVerdict}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
