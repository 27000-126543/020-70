import { Globe2, Languages, Clock, RotateCcw } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { regions, languages, timeRanges } from "@/data/mockData";

export function FilterBar() {
  const { filterParams, setFilterParams, resetFilters } = useDashboardStore();

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <Globe2 className="w-4 h-4 text-gov-400" />
        <span className="text-sm text-slate-400">国家地区</span>
        <select
          value={filterParams.region}
          onChange={(e) => setFilterParams({ region: e.target.value })}
          className="input-base w-36 !py-1.5"
        >
          {regions.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <Languages className="w-4 h-4 text-gov-400" />
        <span className="text-sm text-slate-400">语种</span>
        <select
          value={filterParams.language}
          onChange={(e) => setFilterParams({ language: e.target.value })}
          className="input-base w-32 !py-1.5"
        >
          {languages.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-gov-400" />
        <span className="text-sm text-slate-400">时间范围</span>
        <select
          value={filterParams.timeRange}
          onChange={(e) => setFilterParams({ timeRange: e.target.value })}
          className="input-base w-32 !py-1.5"
        >
          {timeRanges.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={resetFilters}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        重置
      </button>
    </div>
  );
}
