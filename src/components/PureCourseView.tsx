// src/components/PureCourseView.tsx

import React, { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Theme Context
import { useThemeMode } from '../hooks/useThemeMode';

// Material Kit Components
import MKBox from '@mk_components/MKBox';
import MKTypography from '@mk_components/MKTypography';
import MKButton from '@mk_components/MKButton';

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
  const { isDarkMode } = useThemeMode();
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
      <MKBox 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center"
        p={8}
        borderRadius="lg"
        sx={{
          minHeight: '100vh',
          background: isDarkMode 
            ? 'linear-gradient(135deg, #121218 0%, #1a1a20 50%, #1e1e24 100%)'
            : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        }}
      >
        <MKTypography variant="h5" color="text.primary" fontWeight="bold" mb={2}>
          正在加载课程内容...
        </MKTypography>
      </MKBox>
    );
  }

  if (!currentLesson) {
    return (
      <MKBox 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center"
        p={8}
        borderRadius="lg"
        sx={{
          minHeight: '100vh',
          background: isDarkMode 
            ? 'linear-gradient(135deg, #121218 0%, #1a1a20 50%, #1e1e24 100%)'
            : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        }}
      >
        <MKTypography variant="h5" fontWeight="bold" mb={2}>
          课程未找到
        </MKTypography>
      </MKBox>
    );
  }

  return (
    <MKBox 
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
        <MKBox mb={3}>
          <MKButton
            variant="outlined"
            color={isDarkMode ? "white" : "dark"}
            size="medium"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToLibrary}
            sx={{
              border: isDarkMode ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(0,0,0,0.3)',
              color: isDarkMode ? 'white' : 'dark',
              '&:hover': {
                background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                border: isDarkMode ? '1px solid rgba(255,255,255,0.5)' : '1px solid rgba(0,0,0,0.5)',
              },
            }}
          >
            返回课程列表
          </MKButton>
        </MKBox>
      )}

      {/* Course Title */}
      <MKBox mb={4} textAlign="center">
        <MKTypography 
          variant="h3" 
          fontWeight="bold" 
          color={isDarkMode ? 'white' : 'dark'}
          mb={1}
        >
          {currentLesson.title}
        </MKTypography>
        <MKTypography 
          variant="h6" 
          color={isDarkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary'}
        >
          第 {currentLesson.lesson_number} 课
        </MKTypography>
      </MKBox>

      {/* Course Sections */}
      <MKBox display="flex" flexDirection="column" gap={4}>
        {/* Dialogue Section */}
        <MKBox
          borderRadius="xl"
          shadow="md"
          p={4}
          sx={{
            background: 'linear-gradient(135deg, #4a5568 0%, #553c7b 100%)',
            color: 'white',
          }}
        >
          <MKBox display="flex" alignItems="center" gap={2} mb={3}>
            <RecordVoiceOverIcon sx={{ fontSize: 32 }} />
            <MKTypography variant="h4" fontWeight="bold">
              课文对话 💬
            </MKTypography>
          </MKBox>
          {basicTexts.length > 0 ? (
            <TextReader texts={basicTexts} />
          ) : (
            <MKTypography color="rgba(255,255,255,0.8)">
              暂无内容
            </MKTypography>
          )}
        </MKBox>

        {/* Vocabulary Section */}
        <MKBox
          borderRadius="xl"
          shadow="md"
          p={4}
          sx={{
            background: 'linear-gradient(135deg, #3182ce 0%, #2c5282 100%)',
            color: 'white',
          }}
        >
          <MKBox display="flex" alignItems="center" gap={2} mb={3}>
            <AutoStoriesIcon sx={{ fontSize: 32 }} />
            <MKTypography variant="h4" fontWeight="bold">
              新单词 📖
            </MKTypography>
          </MKBox>
          {vocabulary && vocabulary.length > 0 ? (
            <MKBox 
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
            </MKBox>
          ) : (
            <MKTypography color="rgba(255,255,255,0.8)">
              暂无内容
            </MKTypography>
          )}
        </MKBox>
        
        {/* Grammar Section */}
        <MKBox
          borderRadius="xl"
          shadow="md"
          p={4}
          sx={{
            background: 'linear-gradient(135deg, #805ad5 0%, #9f7aea 100%)',
            color: 'white',
          }}
        >
          <MKBox display="flex" alignItems="center" gap={2} mb={3}>
            <PsychologyIcon sx={{ fontSize: 32 }} />
            <MKTypography variant="h4" fontWeight="bold">
              语法知识点 ✍️
            </MKTypography>
          </MKBox>
          {grammar && grammar.length > 0 ? (
            <MKBox display="flex" flexDirection="column" gap={3}>
              {grammar.map((item) => (
                <div key={item.id}>
                  <GrammarReviewCard 
                    {...item} 
                    onMasteryChange={(id, level) => handleMasteryChange(id, level, 'grammar')} 
                  />
                </div>
              ))}
            </MKBox>
          ) : (
            <MKTypography color="rgba(255,255,255,0.8)">
              暂无内容
            </MKTypography>
          )}
        </MKBox>

        {/* Applied Texts Section */}
        {appliedTexts.length > 0 && (
          <MKBox
            borderRadius="xl"
            shadow="md"
            p={4}
            sx={{
              background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)',
              color: 'white',
            }}
          >
            <MKBox display="flex" alignItems="center" gap={2} mb={3}>
              <MenuBookIcon sx={{ fontSize: 32 }} />
              <MKTypography variant="h4" fontWeight="bold">
                应用文本 📝
              </MKTypography>
            </MKBox>
            <TextReader texts={appliedTexts} />
          </MKBox>
        )}

        {/* Articles Section */}
        {articles && articles.length > 0 && (
          <MKBox
            borderRadius="xl"
            shadow="md"
            p={4}
            sx={{
              background: 'linear-gradient(135deg, #d69e2e 0%, #b7791f 100%)',
              color: 'white',
            }}
          >
            <MKBox display="flex" alignItems="center" gap={2} mb={3}>
              <ArticleIcon sx={{ fontSize: 32 }} />
              <MKTypography variant="h4" fontWeight="bold">
                相关文章 📰
              </MKTypography>
            </MKBox>
            <ArticleList articles={articles} />
          </MKBox>
        )}
      </MKBox>
    </MKBox>
  );
};

export default React.memo(PureCourseView);
