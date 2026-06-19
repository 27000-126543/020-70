import { useState } from "react";
import { Clock, User, Building2, AlertTriangle, CheckCircle2, Loader2, ExternalLink, Download } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { formatDateTime, getStatusLabel } from "@/utils/format";
import { Badge } from "@/components/ui/Badge";

type StatusFilter = "all" | "pending" | "processing" | "completed";

export function RecordList() {
  const { dutyRecords, updateRecordStatus, setSelectedTopic, topics } = useDashboardStore();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [reportFilter, setReportFilter] = useState<"all" | "reported">("all");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-3.5 h-3.5" />;
      case "processing": return <Loader2 className="w-3.5 h-3.5 animate-spin" />;
      case "completed": return <CheckCircle2 className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending": return "warning";
      case "processing": return "primary";
      case "completed": return "success";
      default: return "default";
    }
  };

  const handleTopicClick = (topicId: string) => {
    const topic = topics.find((t) => t.id === topicId);
    if (topic) {
      setSelectedTopic(topic);
    }
  };

  const filteredRecords = dutyRecords.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (reportFilter === "reported" && !r.needReport) return false;
    return true;
  });

  const handleExport = () => {
    const BOM = "\uFEFF";
    const header = "议题标题,研判意见,责任处室,是否上报,处理状态,值班人员,创建时间";
    const rows = filteredRecords.map((r) =>
      [
        `"${r.topicTitle}"`,
        `"${r.opinion.replace(/"/g, '""')}"`,
        r.department,
        r.needReport ? "是" : "否",
        getStatusLabel(r.status),
        r.reporter,
        formatDateTime(r.createdAt),
      ].join(",")
    );
    const csv = BOM + header + "\n" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `值班记录报表_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusCounts = {
    all: dutyRecords.length,
    pending: dutyRecords.filter((r) => r.status === "pending").length,
    processing: dutyRecords.filter((r) => r.status === "processing").length,
    completed: dutyRecords.filter((r) => r.status === "completed").length,
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-deep-900/50 rounded-sm p-0.5">
          {(["all", "pending", "processing", "completed"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2 py-1 text-xs font-medium rounded-sm transition-colors ${
                statusFilter === s ? "bg-deep-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {s === "all" ? "全部" : getStatusLabel(s)}
              <span className="ml-1 opacity-60">{statusCounts[s]}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setReportFilter(reportFilter === "reported" ? "all" : "reported")}
            className={`px-2 py-1 text-xs rounded-sm transition-colors flex items-center gap-1 ${
              reportFilter === "reported"
                ? "bg-risk-medium/15 text-risk-medium border border-risk-medium/30"
                : "text-slate-400 hover:text-slate-200 border border-transparent"
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            已上报
          </button>
          <button
            onClick={handleExport}
            className="px-2 py-1 text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
            title="导出CSV报表"
          >
            <Download className="w-3 h-3" />
            导出
          </button>
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <div className="text-center py-10 text-slate-500">
          <Clock className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">暂无符合条件的值班记录</p>
        </div>
      ) : (
        filteredRecords.map((record, index) => (
          <div
            key={record.id}
            className="card-base p-4 animate-fade-in relative"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gov-500 rounded-l-md" />

            <div className="flex items-start justify-between gap-3 mb-2">
              <h4
                onClick={() => handleTopicClick(record.topicId)}
                className="text-sm font-medium text-white cursor-pointer hover:text-gov-400 transition-colors flex-1 flex items-center gap-1.5 group"
              >
                <span className="truncate">{record.topicTitle}</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-gov-400" />
              </h4>
              <Badge variant={getStatusVariant(record.status) as any} size="sm">
                <span className="flex items-center gap-1">
                  {getStatusIcon(record.status)}
                  {getStatusLabel(record.status)}
                </span>
              </Badge>
            </div>

            <p className="text-sm text-slate-400 mb-3 line-clamp-2">{record.opinion}</p>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {record.department}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {record.reporter}
                </span>
                {record.needReport && (
                  <span className="flex items-center gap-1 text-risk-medium">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    已上报
                  </span>
                )}
              </div>
              <span className="font-mono">{formatDateTime(record.createdAt)}</span>
            </div>

            <div className="flex gap-2 mt-3 pt-3 border-t border-deep-600/50">
              <button
                onClick={() => updateRecordStatus(record.id, "processing")}
                disabled={record.status === "processing"}
                className="text-xs px-2 py-1 text-gov-400 hover:bg-gov-500/10 rounded-sm transition-colors disabled:opacity-50"
              >
                标记处理中
              </button>
              <button
                onClick={() => updateRecordStatus(record.id, "completed")}
                disabled={record.status === "completed"}
                className="text-xs px-2 py-1 text-risk-low hover:bg-risk-low/10 rounded-sm transition-colors disabled:opacity-50"
              >
                标记已完成
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
