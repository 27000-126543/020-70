import { Shield, Clock, Bell, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { FilterBar } from "@/components/FilterBar";
import { StatsOverview } from "@/components/StatsOverview";
import { TopicGrid } from "@/components/TopicGrid";
import { TopicDetailModal } from "@/components/TopicDetailModal";
import { DisposalRecord } from "@/components/DisposalRecord";

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const formatDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="h-full flex flex-col bg-deep-900">
      <header className="flex items-center justify-between px-6 py-4 border-b border-deep-700 bg-deep-800/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gov-600/20 rounded-md">
            <Shield className="w-6 h-6 text-gov-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white glow-text">
              舆情态势总览
            </h1>
            <p className="text-xs text-slate-500">境外媒体舆情监测值班系统</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-4 h-4" />
            <span className="font-mono text-sm">{formatDateTime(currentTime)}</span>
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-deep-700 rounded-sm transition-colors"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            刷新数据
          </button>

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-400 hover:text-white hover:bg-deep-700 rounded-sm transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-risk-high rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-deep-600">
              <div className="w-8 h-8 rounded-full bg-gov-600 flex items-center justify-center text-white text-sm font-medium">
                值
              </div>
              <div>
                <p className="text-sm text-white">值班人员</p>
                <p className="text-xs text-slate-500">早班</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
        <div className="flex items-center justify-between">
          <FilterBar />
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 bg-risk-low rounded-full animate-pulse" />
            <span>系统运行正常</span>
          </div>
        </div>

        <StatsOverview />

        <div className="flex-1 flex gap-6 min-h-0">
          <div className="flex-1 min-w-0">
            <TopicGrid />
          </div>
          <div className="w-96 flex-shrink-0">
            <DisposalRecord />
          </div>
        </div>
      </div>

      <TopicDetailModal />
    </div>
  );
}
