import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Mon", analyses: 124, alerts: 8 },
  { name: "Tue", analyses: 156, alerts: 12 },
  { name: "Wed", analyses: 189, alerts: 15 },
  { name: "Thu", analyses: 145, alerts: 9 },
  { name: "Fri", analyses: 178, alerts: 11 },
  { name: "Sat", analyses: 89, alerts: 5 },
  { name: "Sun", analyses: 67, alerts: 3 },
];

export function ActivityTimeline() {
  return (
    <div className="glass-panel p-6 fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Activity</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="analysesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(210, 100%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(210, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="alertsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 25%, 18%)" />
            <XAxis dataKey="name" stroke="hsl(215, 15%, 55%)" fontSize={12} />
            <YAxis stroke="hsl(215, 15%, 55%)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 47%, 8%)",
                border: "1px solid hsl(215, 25%, 18%)",
                borderRadius: "8px",
                color: "hsl(210, 20%, 92%)",
              }}
            />
            <Area
              type="monotone"
              dataKey="analyses"
              stroke="hsl(210, 100%, 50%)"
              fillOpacity={1}
              fill="url(#analysesGradient)"
            />
            <Area
              type="monotone"
              dataKey="alerts"
              stroke="hsl(0, 72%, 51%)"
              fillOpacity={1}
              fill="url(#alertsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">Analyses</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-risk-high" />
          <span className="text-sm text-muted-foreground">Alerts</span>
        </div>
      </div>
    </div>
  );
}
