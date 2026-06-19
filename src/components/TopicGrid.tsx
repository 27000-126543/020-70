import { useDashboardStore } from "@/store/useDashboardStore";
import { TopicCard } from "@/components/TopicCard";
import { AlertTriangle, Minus, CheckCircle } from "lucide-react";

export function TopicGrid() {
  const { getFilteredTopics, setSelectedTopic } = useDashboardStore();
  const topics = getFilteredTopics();

  const sortedTopics = [...topics].sort((a, b) => b.heat - a.heat);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <span className="w-1 h-4 bg-gov-500 rounded-sm" />
          议题看板
        </h2>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-risk-high" />
            <span className="text-slate-400">高风险</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Minus className="w-3.5 h-3.5 text-risk-medium" />
            <span className="text-slate-400">中风险</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-risk-low" />
            <span className="text-slate-400">低风险</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {sortedTopics.map((topic, index) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              index={index}
              onClick={() => setSelectedTopic(topic)}
            />
          ))}
        </div>

        {sortedTopics.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <AlertTriangle className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm">暂无符合条件的议题</p>
          </div>
        )}
      </div>
    </div>
  );
}
