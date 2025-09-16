// src/utils/memoryAlgorithm.ts
// 基于艾宾浩斯遗忘曲线的智能复习算法

export interface ReviewItem {
  id: number;
  entityType: 'vocabulary' | 'grammar';
  masteryLevel: number;
  lastReviewedAt: Date | null;
  nextReviewAt: Date | null;
  correctCount: number;
  incorrectCount: number;
  data?: Record<string, unknown>; // 保存原始数据
}

export interface ReviewResult {
  isCorrect: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  responseTime?: number; // 响应时间（毫秒）
}

/**
 * SuperMemo 2算法的简化版本
 * 根据用户的表现调整复习间隔
 */
export class MemoryAlgorithm {
  // 基础间隔（天）
  private static readonly BASE_INTERVALS = [1, 3, 7, 14, 30, 90, 180, 365];
  
  // 难度系数调整
  private static readonly DIFFICULTY_MULTIPLIERS = {
    easy: 1.3,
    medium: 1.0,
    hard: 0.6
  };

  /**
   * 计算下次复习时间
   */
  static calculateNextReview(item: ReviewItem, result: ReviewResult): Date {
    const now = new Date();
    let intervalDays: number;

    if (result.isCorrect) {
      // 答对了，增加间隔
      const baseInterval = this.BASE_INTERVALS[Math.min(item.masteryLevel, this.BASE_INTERVALS.length - 1)];
      const difficultyMultiplier = this.DIFFICULTY_MULTIPLIERS[result.difficulty];
      intervalDays = Math.round(baseInterval * difficultyMultiplier);
    } else {
      // 答错了，重置到较短间隔
      intervalDays = 1;
    }

    const nextReview = new Date(now);
    nextReview.setDate(nextReview.getDate() + intervalDays);
    return nextReview;
  }

  /**
   * 更新掌握程度
   */
  static updateMasteryLevel(item: ReviewItem, result: ReviewResult): number {
    if (result.isCorrect) {
      // 根据难度调整掌握程度增长
      const increment = result.difficulty === 'easy' ? 2 : result.difficulty === 'medium' ? 1 : 0.5;
      return Math.min(item.masteryLevel + increment, 10); // 最高10级
    } else {
      // 答错了，降低掌握程度
      return Math.max(item.masteryLevel - 1, 0);
    }
  }

  /**
   * 获取今日需要复习的项目
   */
  static getTodayReviewItems(items: ReviewItem[]): ReviewItem[] {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // 设置为今天结束时间

    return items.filter(item => {
      if (!item.nextReviewAt) return true; // 从未复习过的项目
      return new Date(item.nextReviewAt) <= today;
    });
  }

  /**
   * 按优先级排序复习项目
   * 优先级：过期时间越长、掌握程度越低的项目优先级越高
   */
  static sortByPriority(items: ReviewItem[]): ReviewItem[] {
    const now = new Date();
    
    return items.sort((a, b) => {
      // 计算过期天数
      const aOverdue = a.nextReviewAt ? Math.max(0, (now.getTime() - new Date(a.nextReviewAt).getTime()) / (1000 * 60 * 60 * 24)) : 999;
      const bOverdue = b.nextReviewAt ? Math.max(0, (now.getTime() - new Date(b.nextReviewAt).getTime()) / (1000 * 60 * 60 * 24)) : 999;
      
      // 计算优先级分数（过期天数 * 2 + (10 - 掌握程度)）
      const aPriority = aOverdue * 2 + (10 - a.masteryLevel);
      const bPriority = bOverdue * 2 + (10 - b.masteryLevel);
      
      return bPriority - aPriority; // 降序排列
    });
  }

  /**
   * 获取学习统计信息
   */
  static getStudyStats(items: ReviewItem[]): {
    totalItems: number;
    masteredItems: number; // 掌握程度 >= 7
    reviewingItems: number; // 掌握程度 3-6
    learningItems: number; // 掌握程度 < 3
    todayReviews: number;
    overdue: number;
  } {
    const today = new Date();
    const todayReviews = this.getTodayReviewItems(items);
    
    return {
      totalItems: items.length,
      masteredItems: items.filter(item => item.masteryLevel >= 7).length,
      reviewingItems: items.filter(item => item.masteryLevel >= 3 && item.masteryLevel < 7).length,
      learningItems: items.filter(item => item.masteryLevel < 3).length,
      todayReviews: todayReviews.length,
      overdue: items.filter(item => 
        item.nextReviewAt && new Date(item.nextReviewAt) < today
      ).length
    };
  }

  /**
   * 预测未来几天的复习量
   */
  static getFutureReviewLoad(items: ReviewItem[], days: number = 7): { date: string; count: number }[] {
    const result: { date: string; count: number }[] = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);
      targetDate.setHours(23, 59, 59, 999);
      
      const count = items.filter(item => {
        if (!item.nextReviewAt) return i === 0; // 新项目算在今天
        const reviewDate = new Date(item.nextReviewAt);
        return reviewDate.toDateString() === targetDate.toDateString();
      }).length;
      
      result.push({
        date: targetDate.toISOString().split('T')[0],
        count
      });
    }
    
    return result;
  }
}

/**
 * 复习会话管理器
 */
export class ReviewSession {
  private items: ReviewItem[];
  private currentIndex: number = 0;
  private results: Map<number, ReviewResult> = new Map();
  private startTime: Date;

  constructor(items: ReviewItem[]) {
    this.items = MemoryAlgorithm.sortByPriority([...items]);
    this.startTime = new Date();
  }

  getCurrentItem(): ReviewItem | null {
    return this.currentIndex < this.items.length ? this.items[this.currentIndex] : null;
  }

  submitResult(result: ReviewResult): void {
    const currentItem = this.getCurrentItem();
    if (currentItem) {
      this.results.set(currentItem.id, result);
      this.currentIndex++;
    }
  }

  getProgress(): { current: number; total: number; percentage: number } {
    return {
      current: this.currentIndex,
      total: this.items.length,
      percentage: this.items.length > 0 ? (this.currentIndex / this.items.length) * 100 : 0
    };
  }

  getSessionStats(): {
    totalTime: number; // 毫秒
    correctCount: number;
    incorrectCount: number;
    averageResponseTime: number;
  } {
    const endTime = new Date();
    const totalTime = endTime.getTime() - this.startTime.getTime();
    
    const results = Array.from(this.results.values());
    const correctCount = results.filter(r => r.isCorrect).length;
    const incorrectCount = results.filter(r => !r.isCorrect).length;
    
    const responseTimes = results.filter(r => r.responseTime).map(r => r.responseTime!);
    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
      : 0;

    return {
      totalTime,
      correctCount,
      incorrectCount,
      averageResponseTime
    };
  }

  getUpdatedItems(): Array<{ item: ReviewItem; updates: Partial<ReviewItem> }> {
    return this.items.map(item => {
      const result = this.results.get(item.id);
      if (!result) return { item, updates: {} };

      const now = new Date();
      const nextReviewAt = MemoryAlgorithm.calculateNextReview(item, result);
      const masteryLevel = MemoryAlgorithm.updateMasteryLevel(item, result);
      
      return {
        item,
        updates: {
          masteryLevel,
          lastReviewedAt: now,
          nextReviewAt,
          correctCount: item.correctCount + (result.isCorrect ? 1 : 0),
          incorrectCount: item.incorrectCount + (result.isCorrect ? 0 : 1)
        }
      };
    });
  }

  isComplete(): boolean {
    return this.currentIndex >= this.items.length;
  }
}
