import { Flame, MessageSquare } from "lucide-react";
import type { Topic } from "@/types";
import { TrendBadge } from "@/components/ui/TrendBadge";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { Badge } from "@/components/ui/Badge";
import { formatNumber } from "@/utils/format";

interface TopicCardProps {
  topic: Topic;
  onClick: () => void;
  index: number;
}

export function TopicCard({ topic, onClick, index }: TopicCardProps) {
  const riskBarColor = {
    high: "bg-risk-high",
    medium: "bg-risk-medium",
    low: "bg-risk-low",
  };

  return (
    <div
      onClick={onClick}
      className="card-base card-hover cursor-pointer relative overflow-hidden animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 ${riskBarColor[topic.riskLevel]}`} />

      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-base font-semibold text-white leading-snug line-clamp-2 flex-1">
            {topic.title}
          </h3>
          <RiskBadge level={topic.riskLevel} size="sm" />
        </div>

        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="font-mono text-sm font-semibold text-white">
              {formatNumber(topic.heat)}
            </span>
            <span className="text-xs text-slate-500">热度</span>
          </div>
          <TrendBadge trend={topic.trend} size="sm" />
        </div>

        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">负面占比</span>
              <span className="text-slate-400 font-mono">{topic.negativeRatio}%</span>
            </div>
            <div className="h-1.5 bg-deep-900 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  topic.negativeRatio > 60
                    ? "bg-risk-high"
                    : topic.negativeRatio > 30
                    ? "bg-risk-medium"
                    : "bg-risk-low"
                }`}
                style={{ width: `${topic.negativeRatio}%` }}
              />
            </div>
          </div>
          <div className="text-right">
            <span
              className={`text-sm font-mono font-semibold ${
                topic.growthRate > 0 ? "text-trend-rising" : "text-trend-falling"
              }`}
            >
              {topic.growthRate > 0 ? "+" : ""}
              {topic.growthRate}%
            </span>
            <p className="text-xs text-slate-500">增速</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            {topic.sources.slice(0, 2).map((source) => (
              <Badge key={source} variant="default" size="sm">
                {source}
              </Badge>
            ))}
            {topic.sources.length > 2 && (
              <Badge variant="default" size="sm">
                +{topic.sources.length - 2}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="text-xs">{topic.articleSummaries.length}篇</span>
          </div>
        </div>
      </div>
    </div>
  );
}
