import { Clock, User, Building2, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { formatDateTime, getStatusLabel } from "@/utils/format";
import { Badge } from "@/components/ui/Badge";

export function RecordList() {
  const { dutyRecords, updateRecordStatus, setSelectedTopic, topics } = useDashboardStore();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-3.5 h-3.5" />;
      case "processing":
        return <Loader2 className="w-3.5 h-3.5 animate-spin" />;
      case "completed":
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "processing":
        return "primary";
      case "completed":
        return "success";
      default:
        return "default";
    }
  };

  const handleTopicClick = (topicId: string) => {
    const topic = topics.find((t) => t.id === topicId);
    if (topic) {
      setSelectedTopic(topic);
    }
  };

  return (
    <div className="space-y-3">
      {dutyRecords.length === 0 ? (
        <div className="text-center py-10 text-slate-500">
          <Clock className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">暂无值班记录</p>
        </div>
      ) : (
        dutyRecords.map((record, index) => (
          <div
            key={record.id}
            className="card-base p-4 animate-fade-in relative"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gov-500 rounded-l-md" />

            <div className="flex items-start justify-between gap-3 mb-2">
              <h4
                onClick={() => handleTopicClick(record.topicId)}
                className="text-sm font-medium text-white cursor-pointer hover:text-gov-400 transition-colors flex-1"
              >
                {record.topicTitle}
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
