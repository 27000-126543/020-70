import { useEffect } from "react";
import { TrendingUp, AlertTriangle, Globe, BarChart3 } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";

export function StatsOverview() {
  const { stats, computeStats, filterParams } = useDashboardStore();

  useEffect(() => {
    computeStats();
  }, [computeStats, filterParams]);

  const statItems = [
    {
      label: "总议题数",
      value: stats.totalTopics,
      icon: <BarChart3 className="w-5 h-5" />,
      color: "text-gov-400",
      bgColor: "bg-gov-500/10",
    },
    {
      label: "升温议题",
      value: stats.risingTopics,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-trend-rising",
      bgColor: "bg-trend-rising/10",
    },
    {
      label: "高风险议题",
      value: stats.highRiskTopics,
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "text-risk-high",
      bgColor: "bg-risk-high/10",
    },
    {
      label: "媒体来源",
      value: stats.sourceCount,
      icon: <Globe className="w-5 h-5" />,
      color: "text-risk-low",
      bgColor: "bg-risk-low/10",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <div
          key={item.label}
          className="card-base p-4 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">{item.label}</p>
              <p className="text-2xl font-bold font-mono text-white animate-count-up">
                {item.value}
              </p>
            </div>
            <div className={`p-3 rounded-md ${item.bgColor} ${item.color}`}>
              {item.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
