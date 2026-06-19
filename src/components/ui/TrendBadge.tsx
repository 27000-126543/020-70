import { TrendingUp, Minus, TrendingDown } from "lucide-react";
import type { TrendType } from "@/types";
import { getTrendLabel } from "@/utils/format";

interface TrendBadgeProps {
  trend: TrendType;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export function TrendBadge({ trend, showLabel = true, size = "sm" }: TrendBadgeProps) {
  const sizeClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const textClass = size === "sm" ? "text-xs" : "text-sm";

  const colorMap = {
    rising: "text-trend-rising",
    stable: "text-trend-stable",
    falling: "text-trend-falling",
  };

  const iconMap = {
    rising: <TrendingUp className={sizeClass} />,
    stable: <Minus className={sizeClass} />,
    falling: <TrendingDown className={sizeClass} />,
  };

  return (
    <span className={`inline-flex items-center gap-1 ${colorMap[trend]} font-medium`}>
      {iconMap[trend]}
      {showLabel && <span className={textClass}>{getTrendLabel(trend)}</span>}
    </span>
  );
}
