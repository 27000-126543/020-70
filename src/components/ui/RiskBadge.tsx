import type { RiskLevel } from "@/types";
import { getRiskLabel } from "@/utils/format";

interface RiskBadgeProps {
  level: RiskLevel;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export function RiskBadge({ level, showLabel = true, size = "sm" }: RiskBadgeProps) {
  const dotSize = size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  const colorMap = {
    high: "bg-risk-high text-risk-high",
    medium: "bg-risk-medium text-risk-medium",
    low: "bg-risk-low text-risk-low",
  };

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`${dotSize} rounded-full ${colorMap[level].split(" ")[0]} ${
          level === "high" ? "animate-pulse-slow" : ""
        }`}
      />
      {showLabel && (
        <span className={`${textSize} font-medium ${colorMap[level].split(" ")[1]}`}>
          {getRiskLabel(level)}
        </span>
      )}
    </span>
  );
}
