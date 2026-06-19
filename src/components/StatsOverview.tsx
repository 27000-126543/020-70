import { useEffect } from "react";
import { TrendingUp, AlertTriangle, Globe, BarChart3, X } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";

type DrillType = "" | "rising" | "highRisk";

export function StatsOverview() {
  const { stats, computeStats, filterParams, setFilterParams } = useDashboardStore();

  useEffect(() => {
    computeStats();
  }, [computeStats, filterParams.region, filterParams.language, filterParams.timeRange]);

  const activeDrill = filterParams.drillDown;

  const handleDrill = (drill: DrillType) => {
    if (activeDrill === drill) {
      setFilterParams({ drillDown: "" });
    } else {
      setFilterParams({ drillDown: drill });
    }
  };

  const clearDrill = () => {
    setFilterParams({ drillDown: "" });
  };

  const statItems: {
    label: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    drill: DrillType;
    active: boolean;
  }[] = [
    {
      label: "总议题数",
      value: stats.totalTopics,
      icon: <BarChart3 className="w-5 h-5" />,
      color: "text-gov-400",
      bgColor: "bg-gov-500/10",
      drill: "",
      active: activeDrill === "",
    },
    {
      label: "升温议题",
      value: stats.risingTopics,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-trend-rising",
      bgColor: "bg-trend-rising/10",
      drill: "rising",
      active: activeDrill === "rising",
    },
    {
      label: "高风险议题",
      value: stats.highRiskTopics,
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "text-risk-high",
      bgColor: "bg-risk-high/10",
      drill: "highRisk",
      active: activeDrill === "highRisk",
    },
    {
      label: "媒体来源",
      value: stats.sourceCount,
      icon: <Globe className="w-5 h-5" />,
      color: "text-risk-low",
      bgColor: "bg-risk-low/10",
      drill: "",
      active: false,
    },
  ];

  return (
    <div className="relative">
      <div className="grid grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <div
            key={item.label}
            onClick={item.drill ? () => handleDrill(item.drill) : undefined}
            className={`card-base p-4 animate-fade-in transition-all duration-200 ${
              item.drill ? "cursor-pointer hover:ring-1 hover:ring-gov-500/30 hover:bg-deep-700/80" : ""
            } ${item.active ? "ring-1 ring-gov-500/50 bg-deep-700/80" : ""}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1 flex items-center gap-1.5">
                  {item.label}
                  {item.drill && item.active && (
                    <X
                      className="w-3.5 h-3.5 text-gov-400 hover:text-white"
                      onClick={(e) => { e.stopPropagation(); clearDrill(); }}
                    />
                  )}
                </p>
                <p className="text-2xl font-bold font-mono text-white animate-count-up">
                  {item.value}
                </p>
              </div>
              <div className={`p-3 rounded-md ${item.bgColor} ${item.color}`}>
                {item.icon}
              </div>
            </div>
            {item.drill && (
              <p className="text-xs text-slate-500 mt-2">
                {item.active ? "点击清除筛选" : "点击筛选"}
              </p>
            )}
          </div>
        ))}
      </div>

      {activeDrill && (
        <div className="absolute -bottom-8 left-0 flex items-center gap-2">
          <span className="text-xs text-slate-400">
            当前下钻：{activeDrill === "rising" ? "升温议题" : "高风险议题"}
          </span>
          <button
            onClick={clearDrill}
            className="text-xs text-gov-400 hover:text-gov-300 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            清除筛选
          </button>
        </div>
      )}
    </div>
  );
}
