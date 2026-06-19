import type { HeatTrendPoint } from "@/types";
import { formatTime } from "@/utils/format";

interface HeatTrendChartProps {
  data: HeatTrendPoint[];
}

export function HeatTrendChart({ data }: HeatTrendChartProps) {
  const maxHeat = Math.max(...data.map((d) => d.heat));
  const chartH = 120;
  const chartW = 460;
  const padX = 40;
  const padY = 20;
  const plotW = chartW - padX * 2;
  const plotH = chartH - padY * 2;

  const points = data.map((d, i) => ({
    x: padX + (i / (data.length - 1)) * plotW,
    y: padY + plotH - (d.heat / maxHeat) * plotH,
    ...d,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},${padY + plotH} L${points[0].x},${padY + plotH} Z`;

  const negPoints = data.map((d, i) => ({
    x: padX + (i / (data.length - 1)) * plotW,
    y: padY + plotH - (d.negativeRatio / 100) * plotH,
  }));
  const negLinePath = negPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  const maxGrowth = Math.max(...data.map((d) => Math.abs(d.growthRate)), 1);
  const growthPoints = data.map((d, i) => ({
    x: padX + (i / (data.length - 1)) * plotW,
    y: padY + plotH / 2 - (d.growthRate / maxGrowth) * (plotH / 2),
  }));
  const growthLinePath = growthPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  return (
    <div className="card-base p-4">
      <h4 className="text-sm font-semibold text-white mb-3">热度变化趋势</h4>

      <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" style={{ maxHeight: chartH }}>
        <line x1={padX} y1={padY + plotH} x2={chartW - padX} y2={padY + plotH} stroke="rgba(59,130,246,0.15)" strokeWidth="1" />

        {[0, 0.5, 1].map((f) => {
          const y = padY + plotH * (1 - f);
          return <line key={f} x1={padX} y1={y} x2={chartW - padX} y2={y} stroke="rgba(59,130,246,0.08)" strokeWidth="1" />;
        })}

        <path d={areaPath} fill="rgba(59,130,246,0.08)" />
        <path d={linePath} fill="none" stroke="#3B82F6" strokeWidth="2" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#3B82F6" stroke="#0A1628" strokeWidth="1.5" />
        ))}

        <path d={negLinePath} fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="4,3" />
        {negPoints.map((p, i) => (
          <circle key={`n${i}`} cx={p.x} cy={p.y} r="2.5" fill="#F59E0B" stroke="#0A1628" strokeWidth="1" />
        ))}

        <line x1={padX} y1={padY + plotH / 2} x2={chartW - padX} y2={padY + plotH / 2} stroke="rgba(16,185,129,0.15)" strokeWidth="1" strokeDasharray="2,4" />
        <path d={growthLinePath} fill="none" stroke="#10B981" strokeWidth="1.5" strokeDasharray="6,3" />
        {growthPoints.map((p, i) => (
          <circle key={`g${i}`} cx={p.x} cy={p.y} r="2.5" fill="#10B981" stroke="#0A1628" strokeWidth="1" />
        ))}

        {points.map((p, i) => (
          <text key={`t${i}`} x={p.x} y={padY + plotH + 14} textAnchor="middle" fill="rgba(148,163,184,0.6)" fontSize="9" fontFamily="JetBrains Mono, monospace">
            {formatTime(p.time)}
          </text>
        ))}
      </svg>

      <div className="flex items-center gap-5 mt-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-gov-500 rounded" />
          <span className="text-slate-400">热度</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-risk-medium rounded" style={{ borderTop: "1px dashed #F59E0B" }} />
          <span className="text-slate-400">负面占比</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-risk-low rounded" style={{ borderTop: "1px dashed #10B981" }} />
          <span className="text-slate-400">增速</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        {data.length > 1 && (() => {
          const latest = data[data.length - 1];
          const prev = data[data.length - 2];
          const heatDelta = latest.heat - prev.heat;
          const negDelta = latest.negativeRatio - prev.negativeRatio;
          const growthDelta = latest.growthRate - prev.growthRate;

          return (
            <>
              <div className="text-center p-2 bg-deep-900/50 rounded-sm">
                <p className="text-xs text-slate-500 mb-1">热度变化</p>
                <p className={`text-sm font-mono font-semibold ${heatDelta >= 0 ? "text-trend-rising" : "text-trend-falling"}`}>
                  {heatDelta >= 0 ? "+" : ""}{heatDelta}
                </p>
              </div>
              <div className="text-center p-2 bg-deep-900/50 rounded-sm">
                <p className="text-xs text-slate-500 mb-1">负面占比变化</p>
                <p className={`text-sm font-mono font-semibold ${negDelta > 0 ? "text-trend-rising" : "text-trend-falling"}`}>
                  {negDelta >= 0 ? "+" : ""}{negDelta}%
                </p>
              </div>
              <div className="text-center p-2 bg-deep-900/50 rounded-sm">
                <p className="text-xs text-slate-500 mb-1">增速变化</p>
                <p className={`text-sm font-mono font-semibold ${growthDelta >= 0 ? "text-trend-rising" : "text-trend-falling"}`}>
                  {growthDelta >= 0 ? "+" : ""}{growthDelta.toFixed(1)}
                </p>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}
