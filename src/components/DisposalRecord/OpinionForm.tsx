import { useState } from "react";
import { Send, AlertTriangle } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { departments } from "@/data/mockData";

interface OpinionFormProps {
  topicId?: string;
  topicTitle?: string;
  onSubmit?: () => void;
}

export function OpinionForm({ topicId, topicTitle, onSubmit }: OpinionFormProps) {
  const { addDutyRecord, selectedTopic } = useDashboardStore();
  const [opinion, setOpinion] = useState("");
  const [department, setDepartment] = useState("");
  const [needReport, setNeedReport] = useState(false);
  const [reporter, setReporter] = useState("");

  const currentTopicId = topicId || selectedTopic?.id || "";
  const currentTopicTitle = topicTitle || selectedTopic?.title || "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opinion.trim() || !department) return;

    addDutyRecord({
      topicId: currentTopicId,
      topicTitle: currentTopicTitle,
      opinion: opinion.trim(),
      department,
      needReport,
      reporter: reporter.trim() || "值班人员",
    });

    setOpinion("");
    setDepartment("");
    setNeedReport(false);
    setReporter("");
    onSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {currentTopicTitle && (
        <div className="card-base p-3 bg-deep-700/30">
          <p className="text-xs text-slate-500 mb-1">关联议题</p>
          <p className="text-sm text-white font-medium truncate">
            {currentTopicTitle}
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm text-slate-400 mb-1.5">研判意见</label>
        <textarea
          value={opinion}
          onChange={(e) => setOpinion(e.target.value)}
          placeholder="请输入研判意见和处置建议..."
          className="input-base min-h-[100px] resize-none"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1.5">责任处室</label>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
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
            id="needReport"
            checked={needReport}
            onChange={(e) => setNeedReport(e.target.checked)}
            className="w-4 h-4 rounded border-deep-600 bg-deep-900 text-gov-600 focus:ring-gov-500 focus:ring-offset-0"
          />
          <label htmlFor="needReport" className="text-sm text-slate-300 flex items-center gap-1.5 cursor-pointer">
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
        disabled={!opinion.trim() || !department}
        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4" />
        提交研判记录
      </button>
    </form>
  );
}
