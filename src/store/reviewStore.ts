// src/store/reviewStore.ts
// 复习系统的状态管理

import { create } from 'zustand';
import { MemoryAlgorithm, ReviewSession } from '../utils/memoryAlgorithm';
import type { ReviewItem, ReviewResult } from '../utils/memoryAlgorithm';
import type { VocabularyItem, GrammarItem } from '../types/models';

interface ReviewStore {
  // 状态
  reviewItems: ReviewItem[];
  currentSession: ReviewSession | null;
  loading: boolean;
  error: string | null;
  
  // 统计数据
  studyStats: {
    totalItems: number;
    masteredItems: number;
    reviewingItems: number;
    learningItems: number;
    todayReviews: number;
    overdue: number;
  } | null;
  
  futureReviewLoad: { date: string; count: number }[];
  
  // Actions
  loadReviewItems: () => Promise<void>;
  startReviewSession: (items?: ReviewItem[]) => void;
  submitReviewResult: (result: ReviewResult) => Promise<void>;
  completeSession: () => Promise<void>;
  updateStudyStats: () => void;
  getFutureLoad: (days?: number) => void;
  
  // 重置状态
  reset: () => void;
}

export const useReviewStore = create<ReviewStore>((set, get) => ({
  // 初始状态
  reviewItems: [],
  currentSession: null,
  loading: false,
  error: null,
  studyStats: null,
  futureReviewLoad: [],

  // 加载复习项目
  loadReviewItems: async () => {
    set({ loading: true, error: null });
    
    try {
      // 使用现有的方法获取需要复习的词汇和语法
      const vocabularyData = await window.db.getDueVocabulary();
      const vocabularyItems: ReviewItem[] = vocabularyData.map((vocab: VocabularyItem) => ({
        id: vocab.id,
        entityType: 'vocabulary' as const,
        masteryLevel: vocab.mastery_level || 0,
        lastReviewedAt: vocab.last_reviewed_at ? new Date(vocab.last_reviewed_at) : null,
        nextReviewAt: vocab.next_review_at ? new Date(vocab.next_review_at) : null,
        correctCount: 0, // 需要从数据库获取或新增字段
        incorrectCount: 0,
        data: vocab as unknown as Record<string, unknown>
      }));

      const grammarData = await window.db.getDueGrammar();
      const grammarItems: ReviewItem[] = grammarData.map((grammar: GrammarItem) => ({
        id: grammar.id,
        entityType: 'grammar' as const,
        masteryLevel: grammar.mastery_level || 0,
        lastReviewedAt: grammar.last_reviewed_at ? new Date(grammar.last_reviewed_at) : null,
        nextReviewAt: grammar.next_review_at ? new Date(grammar.next_review_at) : null,
        correctCount: 0,
        incorrectCount: 0,
        data: grammar as unknown as Record<string, unknown>
      }));

      const allItems = [...vocabularyItems, ...grammarItems];
      
      set({ 
        reviewItems: allItems,
        loading: false 
      });
      
      // 更新统计数据
      get().updateStudyStats();
      get().getFutureLoad();
      
    } catch (error) {
      console.error('Failed to load review items:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load review items',
        loading: false 
      });
    }
  },

  // 开始复习会话
  startReviewSession: (items) => {
    const { reviewItems } = get();
    const sessionItems = items || MemoryAlgorithm.getTodayReviewItems(reviewItems);
    
    if (sessionItems.length > 0) {
      const newSession = new ReviewSession(sessionItems);
      set({ currentSession: newSession, error: null });
    } else {
      set({ error: '没有需要复习的项目' });
    }
  },

  // 提交复习结果
  submitReviewResult: async (result: ReviewResult) => {
    const { currentSession } = get();
    if (!currentSession) return;

    currentSession.submitResult(result);
    
    // 触发重新渲染
    set({ currentSession: currentSession });
  },

  // 完成复习会话
  completeSession: async () => {
    const { currentSession } = get();
    if (!currentSession) return;

    set({ loading: true });

    try {
      const updatedItems = currentSession.getUpdatedItems();
      
      // 1. 准备一个用于批量更新的数组
      const itemsToUpdate = updatedItems
        .filter(({ updates }) => Object.keys(updates).length > 0)
        .map(({ item, updates }) => ({
          id: item.id,
          entityType: item.entityType,
          masteryLevel: updates.masteryLevel,
        }));

      // 2. 如果有需要更新的项目，则一次性调用IPC接口
      if (itemsToUpdate.length > 0) {
        await window.db.batchUpdateReviewItems(itemsToUpdate);
      }

      // 3. 重新加载数据以同步UI
      await get().loadReviewItems();
      
      set({ 
        currentSession: null,
        loading: false 
      });
      
    } catch (error) {
      console.error('Failed to complete session:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to save review results',
        loading: false 
      });
    }
  },

  // 更新学习统计
  updateStudyStats: () => {
    const { reviewItems } = get();
    const stats = MemoryAlgorithm.getStudyStats(reviewItems);
    set({ studyStats: stats });
  },

  // 获取未来复习负载
  getFutureLoad: (days = 7) => {
    const { reviewItems } = get();
    const futureLoad = MemoryAlgorithm.getFutureReviewLoad(reviewItems, days);
    set({ futureReviewLoad: futureLoad });
  },

  // 重置状态
  reset: () => {
    set({
      reviewItems: [],
      currentSession: null,
      loading: false,
      error: null,
      studyStats: null,
      futureReviewLoad: []
    });
  }
}));
