import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_SERIES, COLORS } from "@fal-slides/brand";
import type { ChartObject } from "../types";

type Props = {
  object: ChartObject;
};

export function ChartView({ object }: Props) {
  const data = object.categories.map((name, i) => {
    const row: Record<string, string | number> = { name };
    object.series.forEach((s) => {
      row[s.name] = s.values[i] ?? 0;
    });
    return row;
  });

  const commonAxis = {
    stroke: COLORS.olive,
    tick: { fill: COLORS.olive, fontFamily: '"HAL Timezone Mono", monospace', fontSize: 18 },
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: 8, padding: 16, boxSizing: "border-box" }}>
      {object.title ? (
        <div
          style={{
            fontFamily: '"Focal Upright", sans-serif',
            fontSize: 28,
            fontWeight: 500,
            color: COLORS.black,
          }}
        >
          {object.title}
        </div>
      ) : null}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          {object.chartType === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis dataKey="name" {...commonAxis} />
              <YAxis {...commonAxis} />
              <Tooltip />
              {object.series.map((s, i) => (
                <Bar key={s.name} dataKey={s.name} fill={CHART_SERIES[i % CHART_SERIES.length]} />
              ))}
            </BarChart>
          ) : object.chartType === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis dataKey="name" {...commonAxis} />
              <YAxis {...commonAxis} />
              <Tooltip />
              {object.series.map((s, i) => (
                <Line
                  key={s.name}
                  type="monotone"
                  dataKey={s.name}
                  stroke={CHART_SERIES[i % CHART_SERIES.length]}
                  strokeWidth={3}
                  dot={false}
                />
              ))}
            </LineChart>
          ) : object.chartType === "area" ? (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis dataKey="name" {...commonAxis} />
              <YAxis {...commonAxis} />
              <Tooltip />
              {object.series.map((s, i) => (
                <Area
                  key={s.name}
                  type="monotone"
                  dataKey={s.name}
                  stroke={CHART_SERIES[i % CHART_SERIES.length]}
                  fill={CHART_SERIES[i % CHART_SERIES.length]}
                  fillOpacity={0.35}
                />
              ))}
            </AreaChart>
          ) : (
            <PieChart>
              <Pie data={data} dataKey={object.series[0]?.name || "value"} nameKey="name" outerRadius="70%" label>
                {data.map((_, i) => (
                  <Cell key={i} fill={CHART_SERIES[i % CHART_SERIES.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
