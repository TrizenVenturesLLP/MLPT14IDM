import { Settings as SettingsIcon, User, Shield, Bell, Database, Key, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Configure system preferences and security options
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted/30 p-1">
          <TabsTrigger value="profile" className="data-[state=active]:bg-primary/20 gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary/20 gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary/20 gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-primary/20 gap-2">
            <SettingsIcon className="w-4 h-4" />
            System
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="glass-panel p-6 space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Full Name</Label>
                <Input defaultValue="Dr. Sarah Mitchell" className="bg-muted/30 border-border" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Employee ID</Label>
                <Input defaultValue="INV-2024-0012" className="bg-muted/30 border-border" disabled />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Email</Label>
                <Input defaultValue="s.mitchell@fuis.gov" className="bg-muted/30 border-border" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Department</Label>
                <Input defaultValue="Forensic Analysis Division" className="bg-muted/30 border-border" />
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="glass-panel p-6 space-y-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              Authentication
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-foreground">Biometric Login</p>
                  <p className="text-sm text-muted-foreground">Use fingerprint or face recognition</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-foreground">Session Timeout</p>
                  <p className="text-sm text-muted-foreground">Auto-logout after 30 minutes of inactivity</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Access Permissions</h3>
            <div className="space-y-2">
              {[
                { role: "View Dashboard", granted: true },
                { role: "Analyze Fingerprints", granted: true },
                { role: "Manage Cases", granted: true },
                { role: "View Blockchain Logs", granted: true },
                { role: "Admin Settings", granted: true },
                { role: "Delete Records", granted: false },
              ].map((permission) => (
                <div key={permission.role} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <span className="text-sm text-foreground">{permission.role}</span>
                  <span className={`text-xs px-2 py-1 rounded ${permission.granted ? 'risk-badge-normal' : 'risk-badge-high'}`}>
                    {permission.granted ? 'Granted' : 'Denied'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="glass-panel p-6 space-y-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Alert Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-foreground">Critical Risk Alerts</p>
                  <p className="text-sm text-muted-foreground">Immediate notification for high-risk detections</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-foreground">Suspicious Activity Alerts</p>
                  <p className="text-sm text-muted-foreground">Notify on suspicious pattern detection</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-foreground">Daily Summary Reports</p>
                  <p className="text-sm text-muted-foreground">Receive end-of-day analysis summary</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium text-foreground">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Send alerts via email</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="glass-panel p-6 space-y-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              System Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground">System Version</p>
                <p className="text-lg font-semibold text-foreground">FUIS v2.4.1</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground">Database Status</p>
                <p className="text-lg font-semibold text-success">Connected</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground">Blockchain Network</p>
                <p className="text-lg font-semibold text-success">Synced</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground">AI Engine Status</p>
                <p className="text-lg font-semibold text-success">Operational</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Regional Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Timezone</Label>
                <Input defaultValue="America/New_York (EST)" className="bg-muted/30 border-border" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Date Format</Label>
                <Input defaultValue="YYYY-MM-DD HH:mm:ss" className="bg-muted/30 border-border" />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
