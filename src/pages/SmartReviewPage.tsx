// src/pages/SmartReviewPage.tsx
// 智能复习页面

import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useThemeMode } from '../hooks/useThemeMode';
import { MemoryAlgorithm } from '../utils/memoryAlgorithm';
import type { VocabularyItem, GrammarItem } from '../types/models';
import type { ReviewItem, ReviewResult } from '../utils/memoryAlgorithm';

import MKBox from '@mk_components/MKBox';
import MKTypography from '@mk_components/MKTypography';
import MKButton from '@mk_components/MKButton';

interface ReviewSession {
  items: ReviewItem[];
  currentIndex: number;
  results: Map<number, ReviewResult>;
  startTime: Date;
}

const SmartReviewPage: React.FC = () => {
  const { isDarkMode } = useThemeMode();
  const [session, setSession] = useState<ReviewSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewStats, setReviewStats] = useState({
    totalItems: 0,
    todayReviews: 0,
    correctCount: 0,
    incorrectCount: 0
  });

  // 加载复习数据
  const loadReviewData = async () => {
    setLoading(true);
    try {
      const vocabularyData = await window.db.getTodaysReviewCards();
      // 暂时使用空数组，因为getTodaysReviewGrammar方法不存在
      const grammarData: GrammarItem[] = [];

      const vocabularyItems: ReviewItem[] = vocabularyData.map(vocab => ({
        id: vocab.id,
        entityType: 'vocabulary' as const,
        masteryLevel: vocab.mastery_level || 0,
        lastReviewedAt: null,
        nextReviewAt: null,
        correctCount: 0,
        incorrectCount: 0,
        data: vocab as unknown as Record<string, unknown>
      }));

      const grammarItems: ReviewItem[] = grammarData.map((grammar: GrammarItem) => ({
        id: grammar.id,
        entityType: 'grammar' as const,
        masteryLevel: grammar.mastery_level || 0,
        lastReviewedAt: null,
        nextReviewAt: null,
        correctCount: 0,
        incorrectCount: 0,
        data: grammar as unknown as Record<string, unknown>
      }));

      const allItems = [...vocabularyItems, ...grammarItems];
      const sortedItems = MemoryAlgorithm.sortByPriority(allItems);

      setReviewStats({
        totalItems: allItems.length,
        todayReviews: allItems.length,
        correctCount: 0,
        incorrectCount: 0
      });

      if (sortedItems.length > 0) {
        setSession({
          items: sortedItems,
          currentIndex: 0,
          results: new Map(),
          startTime: new Date()
        });
      }
    } catch (error) {
      console.error('Failed to load review data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 提交答案
  const submitAnswer = async (isCorrect: boolean, difficulty: 'easy' | 'medium' | 'hard' = 'medium') => {
    if (!session) return;

    const currentItem = session.items[session.currentIndex];
    const result: ReviewResult = { isCorrect, difficulty };
    
    // 更新结果
    const newResults = new Map(session.results);
    newResults.set(currentItem.id, result);

    // 更新数据库
    try {
      const newMasteryLevel = MemoryAlgorithm.updateMasteryLevel(currentItem, result);
      
      if (currentItem.entityType === 'vocabulary') {
        await window.db.updateMasteryLevel(currentItem.id, newMasteryLevel);
      }
      // 暂时跳过语法更新，因为updateGrammarMasteryLevel方法不存在
    } catch (error) {
      console.error('Failed to update mastery level:', error);
    }

    // 更新统计
    setReviewStats(prev => ({
      ...prev,
      correctCount: prev.correctCount + (isCorrect ? 1 : 0),
      incorrectCount: prev.incorrectCount + (isCorrect ? 0 : 1)
    }));

    // 移动到下一项
    const nextIndex = session.currentIndex + 1;
    if (nextIndex < session.items.length) {
      setSession({
        ...session,
        currentIndex: nextIndex,
        results: newResults
      });
      setShowAnswer(false);
    } else {
      // 复习完成
      setSession(null);
    }
  };

  // 获取当前项目
  const getCurrentItem = (): ReviewItem | null => {
    return session && session.currentIndex < session.items.length 
      ? session.items[session.currentIndex] 
      : null;
  };

  // 渲染词汇卡片
  const renderVocabularyCard = (vocab: Record<string, unknown>) => (
    <Card sx={{ 
      minHeight: 300, 
      display: 'flex', 
      flexDirection: 'column',
      background: isDarkMode 
        ? 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
        : 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
      border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'
    }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
        <Typography variant="h3" component="div" sx={{ 
          mb: 2, 
          color: isDarkMode ? '#ffffff' : '#1a202c',
          fontWeight: 'bold'
        }}>
          {String(vocab.word || '')}
        </Typography>
        <Typography variant="h5" sx={{ 
          mb: 2, 
          color: isDarkMode ? '#a0aec0' : '#4a5568'
        }}>
          {String(vocab.kana || '')}
        </Typography>
        
        <AnimatePresence>
          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Typography variant="h6" sx={{ 
                color: isDarkMode ? '#68d391' : '#38a169',
                fontWeight: 'medium'
              }}>
                {String(vocab.meaning || '')}
              </Typography>
              {vocab.part_of_speech && (
                <Chip 
                  label={String(vocab.part_of_speech || '')} 
                  size="small" 
                  sx={{ mt: 1 }}
                  color="primary"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );

  // 渲染语法卡片
  const renderGrammarCard = (grammar: Record<string, unknown>) => (
    <Card sx={{ 
      minHeight: 300, 
      display: 'flex', 
      flexDirection: 'column',
      background: isDarkMode 
        ? 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
        : 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
      border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'
    }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant="h4" component="div" sx={{ 
          mb: 3, 
          color: isDarkMode ? '#ffffff' : '#1a202c',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          {String(grammar.title || '')}
        </Typography>
        
        <AnimatePresence>
          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Typography variant="body1" sx={{ 
                color: isDarkMode ? '#e2e8f0' : '#2d3748',
                lineHeight: 1.6
              }}>
                {String(grammar.explanation || '')}
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );

  useEffect(() => {
    loadReviewData();
  }, []);

  if (loading) {
    return (
      <MKBox 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
        sx={{
          background: isDarkMode 
            ? 'linear-gradient(135deg, #121218 0%, #1a1a20 50%, #1e1e24 100%)'
            : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        }}
      >
        <MKTypography variant="h5">加载复习内容中...</MKTypography>
      </MKBox>
    );
  }

  if (!session || session.items.length === 0) {
    return (
      <MKBox 
        p={4}
        sx={{
          minHeight: '100vh',
          background: isDarkMode 
            ? 'linear-gradient(135deg, #121218 0%, #1a1a20 50%, #1e1e24 100%)'
            : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        }}
      >
        <Box textAlign="center" mt={8}>
          <TrendingUpIcon sx={{ fontSize: 80, color: isDarkMode ? '#68d391' : '#38a169', mb: 2 }} />
          <MKTypography variant="h4" mb={2}>
            今天没有需要复习的内容
          </MKTypography>
          <MKTypography variant="body1" color="text.secondary" mb={4}>
            你已经完成了今天的复习任务，继续保持！
          </MKTypography>
          <MKButton variant="contained" color="primary" onClick={loadReviewData}>
            重新检查
          </MKButton>
        </Box>
      </MKBox>
    );
  }

  const currentItem = getCurrentItem();
  const progress = ((session.currentIndex + 1) / session.items.length) * 100;

  return (
    <MKBox 
      p={4}
      sx={{
        minHeight: '100vh',
        background: isDarkMode 
          ? 'linear-gradient(135deg, #121218 0%, #1a1a20 50%, #1e1e24 100%)'
          : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      }}
    >
      {/* 进度条 */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <MKTypography variant="h6">
            复习进度: {session.currentIndex + 1} / {session.items.length}
          </MKTypography>
          <MKTypography variant="body2" color="text.secondary">
            正确率: {reviewStats.correctCount + reviewStats.incorrectCount > 0 
              ? Math.round((reviewStats.correctCount / (reviewStats.correctCount + reviewStats.incorrectCount)) * 100)
              : 0}%
          </MKTypography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      {/* 复习卡片 */}
      <Box maxWidth={600} mx="auto">
        {currentItem && (
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            {currentItem.entityType === 'vocabulary' 
              ? renderVocabularyCard(currentItem.data as Record<string, unknown>)
              : renderGrammarCard(currentItem.data as Record<string, unknown>)
            }
          </motion.div>
        )}

        {/* 控制按钮 */}
        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          {!showAnswer ? (
            <MKButton 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => setShowAnswer(true)}
            >
              显示答案
            </MKButton>
          ) : (
            <>
              <MKButton 
                variant="contained" 
                color="error" 
                size="large"
                startIcon={<CancelIcon />}
                onClick={() => submitAnswer(false)}
              >
                不认识
              </MKButton>
              <MKButton 
                variant="contained" 
                color="warning" 
                size="large"
                onClick={() => submitAnswer(true, 'hard')}
              >
                有点难
              </MKButton>
              <MKButton 
                variant="contained" 
                color="success" 
                size="large"
                startIcon={<CheckCircleIcon />}
                onClick={() => submitAnswer(true, 'easy')}
              >
                很简单
              </MKButton>
            </>
          )}
        </Box>
      </Box>
    </MKBox>
  );
};

export default SmartReviewPage;
