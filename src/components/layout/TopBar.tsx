import { Bell, User, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function TopBar() {
  return (
    <header className="h-16 bg-card/50 backdrop-blur-xl border-b border-border sticky top-0 z-50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* System Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-semibold text-foreground">
              Fingerprint Usage Integrity System
            </h1>
          </div>
          <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
            v2.4.1
          </Badge>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-risk-high rounded-full pulse-alert" />
          </button>

          {/* User Info */}
          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">Dr. Sarah Mitchell</p>
              <p className="text-xs text-muted-foreground">Senior Investigator</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
              Admin
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
}
