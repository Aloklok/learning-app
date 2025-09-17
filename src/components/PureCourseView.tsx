// src/components/PureCourseView.tsx

import React, { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Theme Context
import { useAppTheme } from '../hooks/useAppTheme';

// MUI Components
import { Box, Typography, Button } from '@mui/material';

// Custom Components
import TextReader from './TextReader';
import WordCard from './WordCard';
import GrammarReviewCard from './GrammarReviewCard';
import ArticleList from './ArticleList';

// Database Hook
import { useDatabase } from '../hooks/useDatabase';

// Global Types
import type { Lesson, VocabularyItem, GrammarItem, TextItem, ArticleItem } from '../types/models';

// Icons
import PsychologyIcon from '@mui/icons-material/Psychology';
import ArticleIcon from '@mui/icons-material/Article';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface PureCourseViewProps {
  lessonId: number;
}

const PureCourseView: React.FC<PureCourseViewProps> = ({ lessonId }) => {
  const { isDarkMode } = useAppTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we came from library (check if there's a bookId in the state or referrer)
  const showBackButton = location.state?.fromLibrary || document.referrer.includes('/book/');

  // Database queries
  const { data: currentLesson, loading: lessonLoading } = useDatabase<Lesson>('getLessonById', [lessonId]);
  const { data: vocabulary, setData: setVocabulary } = useDatabase<VocabularyItem[]>('getVocabularyByLessonId', [lessonId]);
  const { data: grammar, setData: setGrammar } = useDatabase<GrammarItem[]>('getGrammarByLessonId', [lessonId]);
  const { data: texts } = useDatabase<TextItem[]>('getTextsByLessonId', [lessonId]);
  const { data: articles } = useDatabase<ArticleItem[]>('getArticlesByLessonId', [lessonId]);

  // Filter texts by type
  const basicTexts = texts?.filter(text => text.type === 'basic') || [];
  const appliedTexts = texts?.filter(text => text.type === 'applied') || [];

  const handleMasteryChange = useCallback(async (id: number, newLevel: number, type: 'word' | 'grammar') => {
    try {
      if (type === 'word') {
        await window.db.updateMasteryLevel(id, newLevel);
        setVocabulary(prevData => prevData ? prevData.map(item => item.id === id ? { ...item, mastery_level: newLevel } : item) : null);
      } else {
        await window.db.updateGrammarMasteryLevel(id, newLevel);
        setGrammar(prevData => prevData ? prevData.map(item => item.id === id ? { ...item, mastery_level: newLevel } : item) : null);
      }
    } catch (err) {
      console.error(`Failed to update mastery for ${type} ID ${id}:`, err);
    }
  }, [setVocabulary, setGrammar]);

  const handleBackToLibrary = () => {
    navigate(-1); // Go back to previous page
  };

  if (lessonLoading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center"
        p={8}
        sx={{
          minHeight: '100vh',
          borderRadius: 'lg',
          background: isDarkMode 
            ? 'linear-gradient(135deg, #121218 0%, #1a1a20 50%, #1e1e24 100%)'
            : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        }}
      >
        <Typography variant="h5" color="text.primary" fontWeight="bold" sx={{ mb: 2 }}>
          正在加载课程内容...
        </Typography>
      </Box>
    );
  }

  if (!currentLesson) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center"
        p={8}
        sx={{
          minHeight: '100vh',
          borderRadius: 'lg',
          background: isDarkMode 
            ? 'linear-gradient(135deg, #121218 0%, #1a1a20 50%, #1e1e24 100%)'
            : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        }}
      >
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          课程未找到
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        background: isDarkMode 
          ? 'linear-gradient(135deg, #121218 0%, #1a1a20 50%, #1e1e24 100%)'
          : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        p: { xs: 2, md: 4 },
      }}
    >
      {/* Back Button */}
      {showBackButton && (
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            color={isDarkMode ? "inherit" : "primary"}
            size="medium"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToLibrary}
            sx={{
              border: isDarkMode ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(0,0,0,0.3)',
              color: isDarkMode ? 'white' : 'text.primary',
              '&:hover': {
                background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                border: isDarkMode ? '1px solid rgba(255,255,255,0.5)' : '1px solid rgba(0,0,0,0.5)',
              },
            }}
          >
            返回课程列表
          </Button>
        </Box>
      )}

      {/* Course Title */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography 
          variant="h3" 
          fontWeight="bold" 
          color={isDarkMode ? 'white' : 'text.primary'}
          sx={{ mb: 1 }}
        >
          {currentLesson.title}
        </Typography>
        <Typography 
          variant="h6" 
          color={isDarkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary'}
        >
          第 {currentLesson.lesson_number} 课
        </Typography>
      </Box>

      {/* Course Sections */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {/* Dialogue Section */}
        <Box
          sx={{
            borderRadius: 'xl',
            boxShadow: 3,
            p: 4,
            background: 'linear-gradient(135deg, #4a5568 0%, #553c7b 100%)',
            color: 'white',
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <RecordVoiceOverIcon sx={{ fontSize: 32 }} />
            <Typography variant="h4" fontWeight="bold">
              课文对话 💬
            </Typography>
          </Box>
          {basicTexts.length > 0 ? (
            <TextReader texts={basicTexts} />
          ) : (
            <Typography color="rgba(255,255,255,0.8)">
              暂无内容
            </Typography>
          )}
        </Box>

        {/* Vocabulary Section */}
        <Box
          sx={{
            borderRadius: 'xl',
            boxShadow: 3,
            p: 4,
            background: 'linear-gradient(135deg, #3182ce 0%, #2c5282 100%)',
            color: 'white',
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <AutoStoriesIcon sx={{ fontSize: 32 }} />
            <Typography variant="h4" fontWeight="bold">
              新单词 📖
            </Typography>
          </Box>
          {vocabulary && vocabulary.length > 0 ? (
            <Box 
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
                gap: 3
              }}
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
            <Typography color="rgba(255,255,255,0.8)">
              暂无内容
            </Typography>
          )}
        </Box>
        
        {/* Grammar Section */}
        <Box
          sx={{
            borderRadius: 'xl',
            boxShadow: 3,
            p: 4,
            background: 'linear-gradient(135deg, #805ad5 0%, #9f7aea 100%)',
            color: 'white',
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <PsychologyIcon sx={{ fontSize: 32 }} />
            <Typography variant="h4" fontWeight="bold">
              语法知识点 ✍️
            </Typography>
          </Box>
          {grammar && grammar.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
            <Typography color="rgba(255,255,255,0.8)">
              暂无内容
            </Typography>
          )}
        </Box>

        {/* Applied Texts Section */}
        {appliedTexts.length > 0 && (
          <Box
            sx={{
              borderRadius: 'xl',
              boxShadow: 3,
              p: 4,
              background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)',
              color: 'white',
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
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
              borderRadius: 'xl',
              boxShadow: 3,
              p: 4,
              background: 'linear-gradient(135deg, #d69e2e 0%, #b7791f 100%)',
              color: 'white',
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <ArticleIcon sx={{ fontSize: 32 }} />
              <Typography variant="h4" fontWeight="bold">
                相关文章 📰
              </Typography>
            </Box>
            <ArticleList articles={articles} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default React.memo(PureCourseView);
