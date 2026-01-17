import { useState } from "react";
import { Upload, Hash, Info, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalysisFormProps {
  onSubmit: (data: AnalysisData) => void;
}

export interface AnalysisData {
  inputType: "upload" | "hash";
  fingerprint?: File;
  fingerprintHash?: string;
  personId: string;
  identityStatus: string;
  lastActivityDate: string;
  sector: string;
  caseId: string;
  timestamp: string;
}

export function AnalysisForm({ onSubmit }: AnalysisFormProps) {
  const [inputType, setInputType] = useState<"upload" | "hash">("hash");
  const [formData, setFormData] = useState({
    fingerprintHash: "",
    personId: "",
    identityStatus: "",
    lastActivityDate: "",
    sector: "",
    caseId: "",
    timestamp: new Date().toISOString().slice(0, 16),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      inputType,
      ...formData,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Section 1: Fingerprint Input */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">1</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">Fingerprint Input</h3>
        </div>

        <Tabs value={inputType} onValueChange={(v) => setInputType(v as "upload" | "hash")}>
          <TabsList className="bg-muted/50">
            <TabsTrigger value="hash" className="data-[state=active]:bg-primary/20">
              <Hash className="w-4 h-4 mr-2" />
              Enter Hash/ID
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-primary/20">
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hash" className="mt-4">
            <div className="space-y-2">
              <Label htmlFor="hash" className="text-muted-foreground">Fingerprint Hash / ID</Label>
              <Input
                id="hash"
                placeholder="Enter SHA-256 hash or fingerprint ID..."
                className="font-mono bg-muted/30 border-border"
                value={formData.fingerprintHash}
                onChange={(e) => setFormData({ ...formData, fingerprintHash: e.target.value })}
              />
            </div>
          </TabsContent>

          <TabsContent value="upload" className="mt-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-foreground">Click to upload fingerprint image</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Privacy Notice:</strong> No raw fingerprint data is stored. 
            All biometric data is processed locally and only hashes are retained for audit purposes.
          </p>
        </div>
      </div>

      {/* Section 2: Identity Metadata */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">2</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">Identity Metadata</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="personId" className="text-muted-foreground">Person ID</Label>
            <Input
              id="personId"
              placeholder="Enter person ID..."
              className="bg-muted/30 border-border"
              value={formData.personId}
              onChange={(e) => setFormData({ ...formData, personId: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Identity Status</Label>
            <Select
              value={formData.identityStatus}
              onValueChange={(v) => setFormData({ ...formData, identityStatus: v })}
            >
              <SelectTrigger className="bg-muted/30 border-border">
                <SelectValue placeholder="Select status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alive">Alive</SelectItem>
                <SelectItem value="missing">Missing</SelectItem>
                <SelectItem value="deceased">Deceased</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastActivity" className="text-muted-foreground">Last Known Activity Date</Label>
            <Input
              id="lastActivity"
              type="date"
              className="bg-muted/30 border-border"
              value={formData.lastActivityDate}
              onChange={(e) => setFormData({ ...formData, lastActivityDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Section 3: Usage Context */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">3</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">Usage Context</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Sector</Label>
            <Select
              value={formData.sector}
              onValueChange={(v) => setFormData({ ...formData, sector: v })}
            >
              <SelectTrigger className="bg-muted/30 border-border">
                <SelectValue placeholder="Select sector..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="forensic">Forensic</SelectItem>
                <SelectItem value="hospital">Hospital</SelectItem>
                <SelectItem value="border">Border Control</SelectItem>
                <SelectItem value="banking">Banking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="caseId" className="text-muted-foreground">Case ID / Record ID</Label>
            <Input
              id="caseId"
              placeholder="Enter case or record ID..."
              className="bg-muted/30 border-border"
              value={formData.caseId}
              onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timestamp" className="text-muted-foreground">Timestamp</Label>
            <Input
              id="timestamp"
              type="datetime-local"
              className="bg-muted/30 border-border"
              value={formData.timestamp}
              onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
        <Send className="w-5 h-5 mr-2" />
        Analyze Fingerprint Usage
      </Button>
    </form>
  );
}
