import { useState } from "react";
import { Send, AlertTriangle, AlertCircle } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { departments } from "@/data/mockData";

interface OpinionFormProps {
  topicId?: string;
  topicTitle?: string;
  onSubmit?: () => void;
  compact?: boolean;
}

export function OpinionForm({ topicId, topicTitle, onSubmit, compact = false }: OpinionFormProps) {
  const { addDutyRecord, selectedTopic } = useDashboardStore();
  const [opinion, setOpinion] = useState("");
  const [department, setDepartment] = useState("");
  const [needReport, setNeedReport] = useState(false);
  const [reporter, setReporter] = useState("");
  const [error, setError] = useState("");

  const currentTopicId = topicId || selectedTopic?.id || "";
  const currentTopicTitle = topicTitle || selectedTopic?.title || "";
  const hasLinkedTopic = !!currentTopicId && !!currentTopicTitle;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!hasLinkedTopic) {
      setError("请先关联一个议题，或从议题详情页提交研判记录");
      return;
    }
    if (!opinion.trim()) {
      setError("请填写研判意见");
      return;
    }
    if (!department) {
      setError("请选择责任处室");
      return;
    }

    const success = addDutyRecord({
      topicId: currentTopicId,
      topicTitle: currentTopicTitle,
      opinion: opinion.trim(),
      department,
      needReport,
      reporter: reporter.trim() || "值班人员",
    });

    if (success) {
      setOpinion("");
      setDepartment("");
      setNeedReport(false);
      setReporter("");
      onSubmit?.();
    } else {
      setError("提交失败，请确保所有必填项已填写并关联议题");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${compact ? "text-sm" : ""}`}>
      {hasLinkedTopic ? (
        <div className="card-base p-3 bg-deep-700/30">
          <p className="text-xs text-slate-500 mb-1">关联议题</p>
          <p className="text-sm text-white font-medium truncate">
            {currentTopicTitle}
          </p>
        </div>
      ) : (
        <div className="flex items-start gap-2 p-3 rounded-sm border border-risk-medium/30 bg-risk-medium/5">
          <AlertCircle className="w-4 h-4 text-risk-medium flex-shrink-0 mt-0.5" />
          <div className="text-xs text-risk-medium">
            <p className="font-medium">未关联议题</p>
            <p className="text-risk-medium/80 mt-0.5">请先点击左侧议题卡片，在详情页中提交研判记录</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-2.5 rounded-sm border border-risk-high/30 bg-risk-high/5 text-xs text-risk-high">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm text-slate-400 mb-1.5">研判意见 <span className="text-risk-high">*</span></label>
        <textarea
          value={opinion}
          onChange={(e) => { setOpinion(e.target.value); setError(""); }}
          placeholder="请输入研判意见和处置建议..."
          className={`input-base min-h-[${compact ? "80px" : "100px"}] resize-none`}
          rows={compact ? 3 : 4}
        />
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1.5">责任处室 <span className="text-risk-high">*</span></label>
        <select
          value={department}
          onChange={(e) => { setDepartment(e.target.value); setError(""); }}
          className="input-base"
        >
          <option value="">请选择责任处室</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`needReport-${compact ? "c" : "f"}`}
            checked={needReport}
            onChange={(e) => setNeedReport(e.target.checked)}
            className="w-4 h-4 rounded border-deep-600 bg-deep-900 text-gov-600 focus:ring-gov-500 focus:ring-offset-0"
          />
          <label htmlFor={`needReport-${compact ? "c" : "f"}`} className="text-sm text-slate-300 flex items-center gap-1.5 cursor-pointer">
            <AlertTriangle className="w-4 h-4 text-risk-medium" />
            需要上报
          </label>
        </div>

        <div className="w-28">
          <input
            type="text"
            value={reporter}
            onChange={(e) => setReporter(e.target.value)}
            placeholder="值班人员"
            className="input-base text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!hasLinkedTopic}
        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4" />
        提交研判记录
      </button>
    </form>
  );
}
