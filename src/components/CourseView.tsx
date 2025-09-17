import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppTheme } from '../hooks/useAppTheme';

// Material UI Components
import { Box, Typography } from '@mui/material';

// Custom Hooks & Components
import { useDashboardStore } from '../store/dashboardStore';
import { useDatabase } from '../hooks/useDatabase';
import TextReader from './TextReader';
import WordCard from './WordCard';
import GrammarReviewCard from './GrammarReviewCard';
import ArticleList from './ArticleList';
import LessonHeader from './LessonHeader';
import LessonNavigation from './LessonNavigation';
import LessonCompletionButton from './LessonCompletionButton';

// Global Types
import type { Lesson, Book, VocabularyItem, GrammarItem, TextItem, ArticleItem } from '../types/models';

// Icons
import BookIcon from '@mui/icons-material/Book';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ArticleIcon from '@mui/icons-material/Article';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import MenuBookIcon from '@mui/icons-material/MenuBook';

interface CourseViewProps {
  lessonId: number;
}

const CourseView: React.FC<CourseViewProps> = ({ lessonId }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useAppTheme();

  const { fetchStats } = useDashboardStore();

  const { data: bookInfo, loading: bookInfoLoading, error: bookInfoError } = useDatabase<{ book: Book; lesson: Lesson } | null>('getLessonAndBookInfo', [lessonId]);
  const { data: neighborLessons, loading: neighborLessonsLoading, error: neighborLessonsError } = useDatabase<Lesson[]>('getNeighborLessons', [lessonId]);
  const { data: texts, loading: textsLoading, error: textsError } = useDatabase<TextItem[]>('getTextsByLessonId', [lessonId]);
  const { data: vocabulary, loading: vocabularyLoading, error: vocabularyError, setData: setVocabulary } = useDatabase<VocabularyItem[]>('getVocabularyByLessonId', [lessonId]);
  const { data: grammar, loading: grammarLoading, error: grammarError, setData: setGrammar } = useDatabase<GrammarItem[]>('getGrammarByLessonId', [lessonId]);
  const { data: articles, loading: articlesLoading, error: articlesError } = useDatabase<ArticleItem[]>('getArticlesByLessonId', [lessonId]);
  const { data: completedLessons, loading: completedLessonsLoading, error: completedLessonsError, setData: refetchCompletedLessons } = useDatabase<number[]>('getCompletedLessons');

  const isLoading = bookInfoLoading || neighborLessonsLoading || textsLoading || vocabularyLoading || grammarLoading || articlesLoading || completedLessonsLoading;
  const error = bookInfoError || neighborLessonsError || textsError || vocabularyError || grammarError || articlesError || completedLessonsError;

  const currentLesson = bookInfo?.lesson;
  const currentBook = bookInfo?.book;
  const isCompleted = useMemo(() => completedLessons?.includes(lessonId) || false, [completedLessons, lessonId]);
  const basicTexts = useMemo(() => texts?.filter((t) => t.type === 'basic') || [], [texts]);
  const appliedTexts = useMemo(() => texts?.filter((t) => t.type === 'applied') || [], [texts]);


  const handleMasteryChange = useCallback(async (id: number, newLevel: number, type: 'word' | 'grammar') => {
    try {
      if (type === 'word') {
        await window.db.updateMasteryLevel(id, newLevel);
        setVocabulary(prevData => prevData ? prevData.map(item => item.id === id ? { ...item, mastery_level: newLevel } : item) : null);
      } else {
        await window.db.updateGrammarMasteryLevel(id, newLevel);
        setGrammar(prevData => prevData ? prevData.map(item => item.id === id ? { ...item, mastery_level: newLevel } : item) : null);
      }
      await fetchStats();
    } catch (err) {
      console.error(`Failed to update mastery for ${type} ID ${id}:`, err);
    }
  }, [fetchStats, setVocabulary, setGrammar]);

  const handleLessonCompletion = useCallback(async () => {
    if (!currentLesson) return;
    
    try {
      if (isCompleted) {
        await window.db.unmarkLessonAsComplete(currentLesson.id);
      } else {
        await window.db.markLessonAsComplete(currentLesson.id);
        await window.db.unlockNextLesson(currentLesson.id);
      }
      
      await refetchCompletedLessons();
      await fetchStats();
      
      if (!isCompleted) {
        const nextLesson = neighborLessons?.find(lesson => lesson.lesson_number === currentLesson.lesson_number + 1);
        if (nextLesson) {
          navigate(`/course/${nextLesson.id}`);
        } else {
          alert('恭喜您完成了本书的所有课程！');
        }
      }
    } catch (err) {
      console.error("Failed to toggle lesson completion status:", err);
    }
  }, [currentLesson, isCompleted, fetchStats, navigate, refetchCompletedLessons, neighborLessons]);
  
  if (isLoading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center"
        p={8}
        sx={{
          borderRadius: 2,
          background: isDarkMode 
            ? 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
            : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <BookIcon sx={{ fontSize: 60, color: 'primary.main', mb: 3 }} />
        <Typography variant="h5" color="text.primary" fontWeight="bold" mb={2}>
          正在加载课程内容...
        </Typography>
        <Typography variant="body1" color="text.secondary">
          请稍候，我们正在为您准备学习材料
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        p={6}
        sx={{
          borderRadius: 2,
          background: isDarkMode
            ? 'linear-gradient(135deg, #fc8181 0%, #e53e3e 100%)'
            : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={2}>
          加载课程失败：{error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header Section */}
      <LessonHeader lesson={currentLesson!} book={currentBook || null} />

      {/* Navigation */}
      <LessonNavigation neighborLessons={neighborLessons || []} currentLessonId={lessonId} />

      {/* Course Sections */}
      <Box display="flex" flexDirection="column" gap={4} mt={4}>
        {/* Dialogue Section */}
        <Box
          sx={{
            borderRadius: 4,
            boxShadow: 3,
            p: 4,
            background: isDarkMode
              ? 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
              : 'linear-gradient(135deg, #4a5568 0%, #553c7b 100%)',
            color: 'white',
            border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
          }}
        >
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <RecordVoiceOverIcon sx={{ fontSize: 32 }} />
            <Typography variant="h4" fontWeight="bold">
              课文对话 💬
            </Typography>
          </Box>
          {basicTexts.length > 0 ? (
            <TextReader texts={basicTexts} />
          ) : (
            <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
              暂无内容
            </Typography>
          )}
        </Box>

        {/* Vocabulary Section */}
        <Box
          sx={{
            borderRadius: 4,
            boxShadow: 3,
            p: 4,
            background: isDarkMode
              ? 'linear-gradient(135deg, #2b6cb0 0%, #1e40af 100%)'
              : 'linear-gradient(135deg, #3182ce 0%, #2c5282 100%)',
            color: 'white',
            border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
          }}
        >
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <AutoStoriesIcon sx={{ fontSize: 32 }} />
            <Typography variant="h4" fontWeight="bold">
              新单词 📖
            </Typography>
          </Box>
          {vocabulary && vocabulary.length > 0 ? (
            <Box 
              display="grid" 
              gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} 
              gap={3}
            >
              {vocabulary.map((word) => (
                <div key={word.id}>
                  <WordCard 
                    {...word} 
                    onMasteryChange={(id, level) => handleMasteryChange(id, level, 'word')} 
                  />
                </div>
              ))}
            </Box>
          ) : (
            <Typography sx={{ color: "rgba(255,255,255,0.8)" }}>
              暂无内容
            </Typography>
          )}
        </Box>
        
        {/* Grammar Section */}
        <Box
          sx={{
            borderRadius: 4,
            boxShadow: 3,
            p: 4,
            background: isDarkMode
              ? 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)'
              : 'linear-gradient(135deg, #805ad5 0%, #9f7aea 100%)',
            color: 'white',
            border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
          }}
        >
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <PsychologyIcon sx={{ fontSize: 32 }} />
            <Typography variant="h4" fontWeight="bold">
              语法知识点 ✍️
            </Typography>
          </Box>
          {grammar && grammar.length > 0 ? (
            <Box display="flex" flexDirection="column" gap={3}>
              {grammar.map((item) => (
                <div key={item.id}>
                  <GrammarReviewCard 
                    {...item} 
                    onMasteryChange={(id, level) => handleMasteryChange(id, level, 'grammar')} 
                  />
                </div>
              ))}
            </Box>
          ) : (
            <Typography sx={{ color: "rgba(255,255,255,0.8)" }}>
              暂无内容
            </Typography>
          )}
        </Box>

        {/* Applied Texts Section */}
        {appliedTexts.length > 0 && (
          <Box
            sx={{
              borderRadius: 4,
              boxShadow: 3,
              p: 4,
              background: isDarkMode
                ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                : 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)',
              color: 'white',
              border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
            }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <MenuBookIcon sx={{ fontSize: 32 }} />
              <Typography variant="h4" fontWeight="bold">
                应用文本 📝
              </Typography>
            </Box>
            <TextReader texts={appliedTexts} />
          </Box>
        )}

        {/* Articles Section */}
        {articles && articles.length > 0 && (
          <Box
            sx={{
              borderRadius: 4,
              boxShadow: 3,
              p: 4,
              background: isDarkMode
                ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
                : 'linear-gradient(135deg, #d69e2e 0%, #b7791f 100%)',
              color: 'white',
              border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
            }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <ArticleIcon sx={{ fontSize: 32 }} />
              <Typography variant="h4" fontWeight="bold">
                相关文章 📰
              </Typography>
            </Box>
            <ArticleList articles={articles} />
          </Box>
        )}

        {/* Completion Button */}
        <Box display="flex" justifyContent="center" mt={4}>
          <LessonCompletionButton 
            isCompleted={isCompleted} 
            onToggleComplete={handleLessonCompletion} 
            disabled={false}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(CourseView);
