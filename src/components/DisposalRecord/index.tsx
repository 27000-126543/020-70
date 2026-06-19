import { useState } from "react";
import { ClipboardList, Plus, List } from "lucide-react";
import { OpinionForm } from "@/components/DisposalRecord/OpinionForm";
import { RecordList } from "@/components/DisposalRecord/RecordList";

export function DisposalRecord() {
  const [activeTab, setActiveTab] = useState<"form" | "list">("list");

  return (
    <div className="card-base h-full flex flex-col">
      <div className="px-4 py-3 border-b border-deep-600/50 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <span className="w-1 h-4 bg-gov-500 rounded-sm" />
          处置记录
        </h2>
        <div className="flex items-center gap-1 bg-deep-900/50 rounded-sm p-0.5">
          <button
            onClick={() => setActiveTab("list")}
            className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors flex items-center gap-1.5 ${
              activeTab === "list"
                ? "bg-deep-600 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <List className="w-3.5 h-3.5" />
            记录列表
          </button>
          <button
            onClick={() => setActiveTab("form")}
            className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors flex items-center gap-1.5 ${
              activeTab === "form"
                ? "bg-deep-600 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            新建记录
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "form" ? (
          <OpinionForm onSubmit={() => setActiveTab("list")} />
        ) : (
          <RecordList />
        )}
      </div>
    </div>
  );
}
