import { useState } from "react";
import { AnalysisForm, AnalysisData } from "@/components/analysis/AnalysisForm";
import { AnalysisResult } from "@/components/analysis/AnalysisResult";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockResult = {
  riskLevel: "high" as const,
  riskScore: 87,
  summary: "This fingerprint usage has been flagged as HIGH RISK due to multiple concerning indicators. The fingerprint was used 3 days after the registered identity was marked as deceased. Additionally, the usage pattern shows sudden activity after 8 months of inactivity, and the fingerprint quality analysis indicates potential post-mortem degradation markers.",
  agents: {
    usagePattern: {
      usageFrequency: "3 uses in 48 hours",
      unrelatedCaseReuse: true,
      inactivityToActivity: true,
      riskScore: 78,
      reasoning: "The fingerprint shows a pattern of sudden reactivation after 8 months of complete inactivity. This is a strong indicator of potential misuse, especially when combined with cross-sector usage between forensic and hospital systems.",
    },
    postMortem: {
      ridgeClarity: 62,
      textureScore: 45,
      distortionIndicators: ["Elasticity degradation", "Ridge flattening", "Moisture anomaly"],
      confidence: 84,
      reasoning: "Biometric quality analysis indicates signs consistent with post-mortem tissue degradation. Ridge clarity and texture scores are below expected thresholds for a living individual. Multiple distortion indicators suggest the fingerprint may have been captured from deceased tissue.",
    },
    contextReasoning: {
      statusMismatch: true,
      combinedReasoning: "The identity associated with this fingerprint was marked as deceased on 2024-01-15, yet the fingerprint was used for hospital patient verification on 2024-01-18. This temporal inconsistency, combined with the biometric degradation indicators and unusual usage patterns, strongly suggests fraudulent post-mortem use of the fingerprint.",
      finalVerdict: "HIGH RISK - IMMEDIATE INVESTIGATION REQUIRED",
    },
  },
};

export default function Analysis() {
  const [result, setResult] = useState<typeof mockResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = async (data: AnalysisData) => {
    setIsAnalyzing(true);
    // Simulate analysis delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setResult(mockResult);
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fingerprint Analysis</h1>
          <p className="text-muted-foreground">
            Submit fingerprint data for usage risk assessment
          </p>
        </div>
        {result && (
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            New Analysis
          </Button>
        )}
      </div>

      {/* Loading State */}
      {isAnalyzing && (
        <div className="glass-panel p-12 text-center fade-in">
          <div className="inline-block w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Analyzing Fingerprint Usage</h3>
          <p className="text-muted-foreground">
            Running multi-agent analysis across usage patterns, biometric indicators, and context reasoning...
          </p>
        </div>
      )}

      {/* Form or Result */}
      {!isAnalyzing && !result && <AnalysisForm onSubmit={handleSubmit} />}
      {!isAnalyzing && result && <AnalysisResult {...result} />}
    </div>
  );
}
