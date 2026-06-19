import { create } from "zustand";
import type { Topic, DutyRecord, FilterParams, DashboardStats } from "@/types";
import { mockTopics, mockDutyRecords } from "@/data/mockData";

const regionMap: Record<string, string[]> = {
  global: ["全球"],
  "asia-pacific": ["亚太"],
  europe: ["欧洲"],
  "north-america": ["北美"],
  "europe-america": ["欧美"],
};

interface DashboardState {
  topics: Topic[];
  selectedTopic: Topic | null;
  isDetailModalOpen: boolean;
  filterParams: FilterParams;
  dutyRecords: DutyRecord[];
  stats: DashboardStats;

  setSelectedTopic: (topic: Topic | null) => void;
  setDetailModalOpen: (open: boolean) => void;
  setFilterParams: (params: Partial<FilterParams>) => void;
  resetFilters: () => void;
  addDutyRecord: (record: Omit<DutyRecord, "id" | "createdAt" | "status">) => boolean;
  updateRecordStatus: (id: string, status: DutyRecord["status"]) => void;
  computeStats: () => void;
  getFilteredTopics: () => Topic[];
}

const initialFilterParams: FilterParams = {
  region: "all",
  language: "all",
  timeRange: "all",
  drillDown: "",
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  topics: mockTopics,
  selectedTopic: null,
  isDetailModalOpen: false,
  filterParams: initialFilterParams,
  dutyRecords: mockDutyRecords,
  stats: {
    totalTopics: 0,
    risingTopics: 0,
    highRiskTopics: 0,
    sourceCount: 0,
  },

  setSelectedTopic: (topic) => {
    set({ selectedTopic: topic, isDetailModalOpen: topic !== null });
  },

  setDetailModalOpen: (open) => {
    set({ isDetailModalOpen: open });
    if (!open) {
      set({ selectedTopic: null });
    }
  },

  setFilterParams: (params) => {
    set((state) => ({
      filterParams: { ...state.filterParams, ...params },
    }));
    setTimeout(() => get().computeStats(), 0);
  },

  resetFilters: () => {
    set({ filterParams: initialFilterParams });
    setTimeout(() => get().computeStats(), 0);
  },

  addDutyRecord: (record) => {
    if (!record.topicId || !record.topicTitle || !record.opinion.trim() || !record.department) {
      return false;
    }
    const newRecord: DutyRecord = {
      ...record,
      id: `r${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    set((state) => ({
      dutyRecords: [newRecord, ...state.dutyRecords],
    }));
    return true;
  },

  updateRecordStatus: (id, status) => {
    set((state) => ({
      dutyRecords: state.dutyRecords.map((r) =>
        r.id === id ? { ...r, status } : r
      ),
    }));
  },

  computeStats: () => {
    const { getFilteredTopics, filterParams } = get();
    const baseTopics = getFilteredTopics();
    const risingTopics = baseTopics.filter((t) => t.trend === "rising").length;
    const highRiskTopics = baseTopics.filter((t) => t.riskLevel === "high").length;
    const allSources = new Set<string>();
    baseTopics.forEach((t) => t.sources.forEach((s) => allSources.add(s)));

    set({
      stats: {
        totalTopics: baseTopics.length,
        risingTopics,
        highRiskTopics,
        sourceCount: allSources.size,
      },
    });
  },

  getFilteredTopics: () => {
    const { topics, filterParams } = get();
    const now = new Date();

    const timeRangeMs: Record<string, number> = {
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
    };

    const cutoffTime = filterParams.timeRange !== "all"
      ? now.getTime() - (timeRangeMs[filterParams.timeRange] || 0)
      : 0;

    return topics.filter((topic) => {
      if (filterParams.region !== "all") {
        const allowedRegions = regionMap[filterParams.region] || [];
        if (!allowedRegions.includes(topic.region)) {
          return false;
        }
      }

      if (filterParams.language !== "all") {
        const langMap: Record<string, string[]> = {
          english: ["英语"],
          multi: ["多语种"],
          japanese: ["日语"],
          korean: ["韩语"],
          french: ["法语"],
          spanish: ["西班牙语"],
        };
        const langs = langMap[filterParams.language] || [];
        if (!langs.some((l) => topic.language.includes(l))) {
          return false;
        }
      }

      if (filterParams.timeRange !== "all") {
        const topicTime = new Date(topic.updatedAt).getTime();
        if (topicTime < cutoffTime) {
          return false;
        }
      }

      if (filterParams.drillDown === "rising" && topic.trend !== "rising") {
        return false;
      }
      if (filterParams.drillDown === "highRisk" && topic.riskLevel !== "high") {
        return false;
      }

      return true;
    });
  },
}));
