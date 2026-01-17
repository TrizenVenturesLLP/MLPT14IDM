import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Upload, Fingerprint, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AnalysisResult {
  status: "normal" | "suspicious" | "high_risk";
  livenessScore: number;
  usageScore: number;
  combinedScore: number;
  summary: string;
}

export default function Analysis() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [caseId, setCaseId] = useState("");
  const [sector, setSector] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;
    
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      if (caseId) formData.append('case_id', caseId);
      formData.append('sector', sector || 'unknown');
      
      const response = await fetch('http://localhost:8000/analyze-fingerprint', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Map backend response to frontend format
      const riskLevel = data.risk_level.toLowerCase();
      setResult({
        status: riskLevel === "normal" ? "normal" : riskLevel === "suspicious" ? "suspicious" : riskLevel === "high" ? "high_risk" : "normal",
        livenessScore: data.liveness_score,
        usageScore: data.usage_score || 1.0,
        combinedScore: data.combined_score || data.liveness_score,
        summary: data.explanation,
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      // For now, show a mock result on error
      setResult({
        status: "error",
        livenessScore: 0.0,
        usageScore: 0.0,
        combinedScore: 0.0,
        summary: "Analysis failed. Please check if the backend is running.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setUploadedFile(null);
    setCaseId("");
    setSector("");
    setResult(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-emerald-500";
      case "suspicious":
        return "bg-amber-500";
      case "high_risk":
        return "bg-red-500";
      case "error":
        return "bg-gray-500";
      default:
        return "bg-muted";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "normal":
        return "NORMAL";
      case "suspicious":
        return "SUSPICIOUS";
      case "high_risk":
        return "HIGH RISK";
      case "error":
        return "ERROR";
      default:
        return status.toUpperCase();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />
      
      <div className="relative max-w-3xl mx-auto px-6 py-12">
        {/* Back to Landing */}
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Fingerprint Risk Analysis
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Multi-agent liveness and usage pattern detection
          </p>
        </div>

        {/* Agent Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <div className="px-4 py-2 rounded-full bg-muted/50 border border-border text-sm text-foreground">
            Agent 1: Usage Pattern
          </div>
          <div className="px-4 py-2 rounded-full bg-muted/50 border border-border text-sm text-foreground">
            Agent 2: Liveness Detection
          </div>
          <div className="px-4 py-2 rounded-full bg-muted/50 border border-border text-sm text-foreground">
            Agent 3: Risk Engine
          </div>
        </div>

        {/* Upload Area */}
        <div className="glass-panel p-8 mb-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-border/70 rounded-xl p-10 text-center cursor-pointer hover:border-primary/50 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.bmp"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            {!uploadedImage ? (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <p className="text-foreground mb-1">
                  Drop fingerprint image here or <span className="font-semibold text-primary">click to upload</span>
                </p>
                <p className="text-sm text-muted-foreground">Supports PNG, JPG, BMP</p>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded fingerprint" 
                  className="w-24 h-24 object-cover rounded-lg mb-4 border border-border"
                />
                <p className="text-sm text-muted-foreground">Click to upload a different image</p>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Case ID (optional)</label>
              <Input
                placeholder="e.g., CASE-001"
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                className="bg-muted/30 border-border"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Sector</label>
              <Select value={sector} onValueChange={setSector}>
                <SelectTrigger className="bg-muted/30 border-border">
                  <SelectValue placeholder="Unknown" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unknown">Unknown</SelectItem>
                  <SelectItem value="forensic">Forensic</SelectItem>
                  <SelectItem value="hospital">Hospital</SelectItem>
                  <SelectItem value="border">Border Control</SelectItem>
                  <SelectItem value="banking">Banking</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={!uploadedFile || isAnalyzing}
            className="w-full mt-6 bg-gradient-to-r from-primary via-accent to-purple-500 hover:opacity-90 text-white font-semibold py-6 text-lg"
          >
            {isAnalyzing ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </div>
            ) : (
              <>
                <Fingerprint className="w-5 h-5 mr-2" />
                Analyze Fingerprint
              </>
            )}
          </Button>
        </div>

        {/* Analysis Result */}
        {result && (
          <div className="glass-panel p-8 fade-in">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-foreground">Analysis Result</h2>
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold text-white ${getStatusColor(result.status)}`}>
                {getStatusText(result.status)}
              </span>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-muted/30 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-1">
                  {result.livenessScore.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Liveness Score</div>
              </div>
              <div className="bg-muted/30 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-1">
                  {result.usageScore.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Usage Score</div>
              </div>
              <div className="bg-muted/30 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-1">
                  {result.combinedScore.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Combined Score</div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-muted/20 rounded-xl p-4 border-l-4 border-emerald-500">
              <p className="text-foreground">{result.summary}</p>
            </div>

            {/* Reset Button */}
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full mt-6"
            >
              Analyze Another Fingerprint
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
