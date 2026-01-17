import { Link } from "react-router-dom";
import { Fingerprint, Shield, Brain, Database, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const features = [
    {
      icon: Brain,
      title: "Multi-Agent AI Analysis",
      description: "Three specialized AI agents work together to detect usage patterns, liveness indicators, and contextual risks.",
    },
    {
      icon: Shield,
      title: "Fraud Detection",
      description: "Identify suspicious or post-mortem fingerprint misuse across forensic and healthcare systems.",
    },
    {
      icon: Database,
      title: "Blockchain Audit Trail",
      description: "Immutable, tamper-proof records of every analysis for complete transparency and compliance.",
    },
  ];

  const capabilities = [
    "Usage pattern anomaly detection",
    "Post-mortem biometric indicator analysis",
    "Cross-sector usage tracking",
    "Real-time risk scoring",
    "Context-aware reasoning",
    "Immutable audit logging",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-32">
          {/* Header */}
          <nav className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Fingerprint className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">FPUIS</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  Dashboard
                </Button>
              </Link>
              <Link to="/analysis">
                <Button className="bg-primary hover:bg-primary/90">
                  Start Analysis
                </Button>
              </Link>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Government-Grade Security</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-foreground">Fingerprint Usage</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Integrity System
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              AI-powered detection of suspicious fingerprint usage patterns. 
              Protect against identity fraud and post-mortem biometric misuse 
              with multi-agent analysis and blockchain-backed audit trails.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/analysis">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8 py-6 gap-2">
                  Analyze Fingerprint
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-border hover:bg-muted/50">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Multi-Agent Detection System</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Three specialized AI agents collaborate to provide comprehensive risk assessment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-panel p-8 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Capabilities Section */}
      <div className="py-24 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Advanced Detection Capabilities
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Our system analyzes how fingerprints are used across different sectors, 
                detecting anomalies that may indicate fraud, identity theft, or post-mortem misuse.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {capabilities.map((capability, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{capability}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-8 space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Usage Pattern Agent</h4>
                  <p className="text-sm text-muted-foreground">Analyzes frequency and cross-sector usage</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-accent">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Liveness Detection Agent</h4>
                  <p className="text-sm text-muted-foreground">Detects post-mortem biometric indicators</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-success">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Risk Engine Agent</h4>
                  <p className="text-sm text-muted-foreground">Combines signals for final verdict</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to Analyze?
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            Start detecting suspicious fingerprint usage patterns with our AI-powered system.
          </p>
          <Link to="/analysis">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-10 py-6 gap-2">
              Start Fingerprint Analysis
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Fingerprint className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground">FPUIS</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Fingerprint Usage Integrity System • Forensic Grade Analysis
          </p>
        </div>
      </footer>
    </div>
  );
}
