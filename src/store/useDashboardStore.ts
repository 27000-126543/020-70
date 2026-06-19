import { create } from "zustand";
import type { Topic, DutyRecord, FilterParams, DashboardStats } from "@/types";
import { mockTopics, mockDutyRecords } from "@/data/mockData";

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
  addDutyRecord: (record: Omit<DutyRecord, "id" | "createdAt" | "status">) => void;
  updateRecordStatus: (id: string, status: DutyRecord["status"]) => void;
  computeStats: () => void;
  getFilteredTopics: () => Topic[];
}

const initialFilterParams: FilterParams = {
  region: "all",
  language: "all",
  timeRange: "24h",
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
  },

  resetFilters: () => {
    set({ filterParams: initialFilterParams });
  },

  addDutyRecord: (record) => {
    const newRecord: DutyRecord = {
      ...record,
      id: `r${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    set((state) => ({
      dutyRecords: [newRecord, ...state.dutyRecords],
    }));
  },

  updateRecordStatus: (id, status) => {
    set((state) => ({
      dutyRecords: state.dutyRecords.map((r) =>
        r.id === id ? { ...r, status } : r
      ),
    }));
  },

  computeStats: () => {
    const { getFilteredTopics } = get();
    const filteredTopics = getFilteredTopics();
    const risingTopics = filteredTopics.filter(
      (t) => t.trend === "rising"
    ).length;
    const highRiskTopics = filteredTopics.filter(
      (t) => t.riskLevel === "high"
    ).length;
    const allSources = new Set<string>();
    filteredTopics.forEach((t) => t.sources.forEach((s) => allSources.add(s)));

    set({
      stats: {
        totalTopics: filteredTopics.length,
        risingTopics,
        highRiskTopics,
        sourceCount: allSources.size,
      },
    });
  },

  getFilteredTopics: () => {
    const { topics, filterParams } = get();
    return topics.filter((topic) => {
      if (
        filterParams.region !== "all" &&
        !topic.region.toLowerCase().includes(filterParams.region.replace("-", ""))
      ) {
        return false;
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
      return true;
    });
  },
}));
