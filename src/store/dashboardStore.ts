// src/store/dashboardStore.ts
// 职责：只负责从数据库获取和存储仪表盘的统计数据。
// 所有修改数据的操作都应该在数据库层面完成，然后通过调用 fetchStats 刷新UI。

import { create } from 'zustand';
import type { DashboardStats } from '../types/models';

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  fetchStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  loading: true,
  fetchStats: async () => {
    set({ loading: true });
    try {
      if (!window.db) {
        console.error("window.db is not defined. Preload script might not have loaded correctly or in time.");
        set({ loading: false });
        return;
      }
      const fetchedStats = await window.db.getDashboardStats();
      set({ stats: fetchedStats, loading: false });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      set({ loading: false });
    }
  },
}));