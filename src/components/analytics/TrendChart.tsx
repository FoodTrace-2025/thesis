import { Box, useToken } from "@chakra-ui/react";

export type TrendRange = "7d" | "30d" | "1y";
export type TrendPoint = { label: string; value: number; raw: string };

interface TrendChartProps {
  data: TrendPoint[];
  range: TrendRange;
}

export function TrendChart({ data, range }: TrendChartProps) {
  const width = 700;
  const height = 240;
  const [brandPrimary, brandBorder, brandMuted] = useToken("colors", [
    "brand.primary",
    "brand.border",
    "brand.muted",
  ]);

  const padding = { left: 36, right: 16, top: 12, bottom: 28 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const ySpan = plotHeight - 12;
  const xAxisY = padding.top + plotHeight;

  const yRules = {
    "7d": { max: 20, step: 2 },
    "30d": { max: 50, step: 5 },
    "1y": { max: 100, step: 10 },
  } as const;
  const { max, step } = yRules[range];
  const yTicks = Array.from({ length: Math.floor(max / step) + 1 }, (_, i) => i * step);

  const pickXLabels = () => {
    if (range === "30d") {
      const count = data.length;
      if (count <= 6) return data.map((item, idx) => ({ idx, label: item.raw ?? item.label }));
      const slots = 5; // ~4-6 labels
      const indices = Array.from({ length: slots }, (_, i) =>
        Math.min(count - 1, Math.round((i / (slots - 1)) * (count - 1)))
      );
      const uniqueIdx = Array.from(new Set(indices));
      return uniqueIdx.map((idx) => ({
        idx,
        label: data[idx].raw ?? data[idx].label,
      }));
    }
    return data.map((item, idx) => ({ idx, label: item.raw ?? item.label }));
  };

  const xLabels = pickXLabels();

  const formatLabel = (raw: string) => {
    if (!raw || typeof raw !== "string") return "";
    const [year, month, day] = raw.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (isNaN(date.getTime())) return raw;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getUTCMonth()]} ${date.getUTCDate()}`;
  };

  const points = data.map((item, idx) => {
    const x = padding.left + (idx / Math.max(data.length - 1, 1)) * plotWidth;
    const capped = Math.min(item.value, max);
    const yPos = xAxisY - (capped / max) * ySpan;
    return { x, y: yPos };
  });

  const pathD =
    points.length > 1
      ? [
          `M ${padding.left} ${xAxisY}`,
          `L ${points[0].x} ${points[0].y}`,
          ...points.slice(1).map((p) => `L ${p.x} ${p.y}`),
          `L ${points[points.length - 1].x} ${xAxisY}`,
          "Z",
        ].join(" ")
      : `M ${padding.left} ${xAxisY} L ${padding.left + plotWidth} ${xAxisY} L ${
          padding.left + plotWidth
        } ${xAxisY - 1} Z`;

  const strokePath =
    points.length > 1
      ? [`M ${points[0].x} ${points[0].y}`, ...points.slice(1).map((p) => `L ${p.x} ${p.y}`)].join(" ")
      : "";

  return (
    <Box overflow="hidden">
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img">
        <defs>
          <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={brandPrimary} stopOpacity="0.9" />
            <stop offset="100%" stopColor={brandPrimary} stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {/* Axes */}
        <line x1={padding.left} x2={padding.left} y1={padding.top} y2={xAxisY} stroke={brandBorder} strokeWidth="1" />
        <line
          x1={padding.left}
          x2={padding.left + plotWidth}
          y1={xAxisY}
          y2={xAxisY}
          stroke={brandBorder}
          strokeWidth="1"
        />
        {/* Y ticks */}
        {yTicks.map((tick) => {
          const yPos = xAxisY - (tick / max) * ySpan;
          return (
            <g key={tick}>
              <line
                x1={padding.left}
                x2={padding.left + plotWidth}
                y1={yPos}
                y2={yPos}
                stroke={brandBorder}
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text x={padding.left - 8} y={yPos + 3} fill={brandMuted} fontSize="10" textAnchor="end">
                {tick}
              </text>
            </g>
          );
        })}

        {/* area */}
        <path d={pathD} fill="url(#trendFill)" />
        {/* stroke */}
        {strokePath && <path d={strokePath} fill="none" stroke={brandPrimary} strokeWidth="2" strokeLinecap="round" />}

        {/* X labels */}
        {xLabels.map(({ idx, label }) => {
          const x = padding.left + (idx / Math.max(data.length - 1, 1)) * plotWidth;
          return (
            <text key={idx} x={x} y={xAxisY + 16} fill={brandMuted} fontSize="10" textAnchor="middle">
              {formatLabel(label)}
            </text>
          );
        })}
      </svg>
    </Box>
  );
}
