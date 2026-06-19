import { useEffect, useState } from "react";
import { X, Flame, Globe2, ClipboardEdit, CheckCircle2 } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { TrendBadge } from "@/components/ui/TrendBadge";
import { Badge } from "@/components/ui/Badge";
import { ArticleList } from "@/components/TopicDetailModal/ArticleList";
import { AccountList } from "@/components/TopicDetailModal/AccountList";
import { NarrativeSection } from "@/components/TopicDetailModal/NarrativeSection";
import { TimelineSection } from "@/components/TopicDetailModal/TimelineSection";
import { OpinionForm } from "@/components/DisposalRecord/OpinionForm";
import { formatNumber, formatDateTime } from "@/utils/format";

type TabType = "articles" | "accounts" | "narratives" | "timeline" | "disposal";

export function TopicDetailModal() {
  const { selectedTopic, isDetailModalOpen, setDetailModalOpen } = useDashboardStore();
  const [activeTab, setActiveTab] = useState<TabType>("articles");
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDetailModalOpen) {
        setDetailModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDetailModalOpen, setDetailModalOpen]);

  useEffect(() => {
    if (isDetailModalOpen) {
      setActiveTab("articles");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDetailModalOpen]);

  if (!selectedTopic || !isDetailModalOpen) return null;

  const tabs: { key: TabType; label: string; count?: number; icon?: React.ReactNode }[] = [
    { key: "articles", label: "原文摘要", count: selectedTopic.articleSummaries.length },
    { key: "accounts", label: "传播账号", count: selectedTopic.spreadAccounts.length },
    { key: "narratives", label: "叙事角度", count: selectedTopic.narrativeAngles.length },
    { key: "timeline", label: "事件时间线", count: selectedTopic.eventTimeline.length },
    { key: "disposal", label: "研判处置", icon: <ClipboardEdit className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-deep-950/80 backdrop-blur-sm animate-fade-in"
        onClick={() => setDetailModalOpen(false)}
      />

      <div className="relative w-full max-w-2xl h-full bg-deep-900 border-l border-deep-600 flex flex-col animate-slide-in-right">
        <div className="flex items-start justify-between p-5 border-b border-deep-700">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <RiskBadge level={selectedTopic.riskLevel} size="md" />
              <TrendBadge trend={selectedTopic.trend} size="md" />
            </div>
            <h2 className="text-xl font-bold text-white leading-snug mb-3">
              {selectedTopic.title}
            </h2>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-slate-400">热度</span>
                <span className="font-mono font-semibold text-white">
                  {formatNumber(selectedTopic.heat)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-gov-400" />
                <span className="text-slate-400">来源</span>
                <span className="text-white">{selectedTopic.sources.length}家</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setDetailModalOpen(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-deep-700 rounded-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-3 border-b border-deep-700 bg-deep-800/50">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-2 text-sm font-medium transition-colors relative inline-flex items-center gap-1.5 ${
                  activeTab === tab.key
                    ? "text-gov-400"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.count !== undefined && (
                  <span className="text-xs opacity-70">({tab.count})</span>
                )}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gov-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 relative">
          {showSuccessToast && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 animate-fade-in">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-risk-low/15 border border-risk-low/40 rounded-sm text-sm text-risk-low shadow-lg">
                <CheckCircle2 className="w-4 h-4" />
                研判记录提交成功，已同步到值班记录列表
              </div>
            </div>
          )}

          {activeTab === "articles" && (
            <ArticleList articles={selectedTopic.articleSummaries} />
          )}
          {activeTab === "accounts" && (
            <AccountList accounts={selectedTopic.spreadAccounts} />
          )}
          {activeTab === "narratives" && (
            <NarrativeSection angles={selectedTopic.narrativeAngles} />
          )}
          {activeTab === "timeline" && (
            <TimelineSection events={selectedTopic.eventTimeline} />
          )}
          {activeTab === "disposal" && (
            <div className="max-w-md mx-auto pt-2">
              <div className="mb-4 text-center">
                <h3 className="text-base font-semibold text-white mb-1">提交研判处置</h3>
                <p className="text-xs text-slate-500">确认需要跟进时，请填写以下信息形成值班记录</p>
              </div>
              <OpinionForm
                topicId={selectedTopic.id}
                topicTitle={selectedTopic.title}
                compact
                onSubmit={() => {
                  setShowSuccessToast(true);
                  setTimeout(() => setShowSuccessToast(false), 2500);
                }}
              />
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-deep-700 bg-deep-800/50">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <span>语种：{selectedTopic.language}</span>
              <span>地区：{selectedTopic.region}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>更新于</span>
              <span className="font-mono">{formatDateTime(selectedTopic.updatedAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {selectedTopic.sources.map((source) => (
              <Badge key={source} variant="default" size="sm">
                {source}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
