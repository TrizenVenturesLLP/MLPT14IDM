import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Normal", value: 847, color: "hsl(152, 60%, 40%)" },
  { name: "Suspicious", value: 156, color: "hsl(38, 92%, 50%)" },
  { name: "High Risk", value: 43, color: "hsl(0, 72%, 51%)" },
];

export function RiskDistributionChart() {
  return (
    <div className="glass-panel p-6 fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-4">Risk Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 47%, 8%)",
                border: "1px solid hsl(215, 25%, 18%)",
                borderRadius: "8px",
                color: "hsl(210, 20%, 92%)",
              }}
            />
            <Legend
              wrapperStyle={{ color: "hsl(210, 20%, 92%)" }}
              formatter={(value) => <span className="text-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {data.map((item) => (
          <div key={item.name} className="text-center">
            <p className="text-2xl font-bold" style={{ color: item.color }}>
              {item.value}
            </p>
            <p className="text-xs text-muted-foreground">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
