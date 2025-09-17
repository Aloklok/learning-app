import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppTheme } from '../hooks/useAppTheme';

// Material UI Components
import { Box, Typography, useTheme } from '@mui/material';

// Custom Hooks & Components
import { useDatabase } from '../hooks/useDatabase';
import WordCard from '../components/WordCard';
import GrammarReviewCard from '../components/GrammarReviewCard';
import SmartReminder from '../components/SmartReminder';

// Global Types
import type { VocabularyItem, GrammarItem } from '../types/models';

// Icons
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const ReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isDarkMode } = useAppTheme();
  const { data: vocab, loading: vocabLoading, error: vocabError, fetch: fetchVocab } = useDatabase<VocabularyItem[]>('getDueVocabulary');
  const { data: grammar, loading: grammarLoading, error: grammarError, fetch: fetchGrammar } = useDatabase<GrammarItem[]>('getDueGrammar');

  const loading = vocabLoading || grammarLoading;
  const error = vocabError || grammarError;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  useEffect(() => {
    fetchVocab();
    fetchGrammar();
  }, [fetchVocab, fetchGrammar]);

  const handleMasteryChange = async (id: number, newLevel: number, type: 'word' | 'grammar') => {
    try {
      if (type === 'word') {
        await window.db.updateMasteryLevel(id, newLevel);
        fetchVocab();
      } else {
        await window.db.updateGrammarMasteryLevel(id, newLevel);
        fetchGrammar();
      }
    } catch (err) {
      console.error(`Failed to update mastery for ${type} ID ${id}:`, err);
    }
  };

  const renderContent = () => {

    if (loading) {
      return (
        <motion.div variants={itemVariants}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 8,
              borderRadius: '12px',
              background: isDarkMode 
                ? 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
                : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <SchoolIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                正在加载复习内容...
              </Typography>
            </Box>
          </Box>
        </motion.div>
      );
    }

    if (error) {
      return (
        <motion.div variants={itemVariants}>
          <Box
            sx={{
              p: 4,
              borderRadius: '12px',
              background: isDarkMode
                ? 'linear-gradient(135deg, #fc8181 0%, #e53e3e 100%)'
                : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
            }}
          >
            <Typography variant="h6" color="white" sx={{ textAlign: 'center' }}>
              {error.message}
            </Typography>
          </Box>
        </motion.div>
      );
    }

    if ((!vocab || vocab.length === 0) && (!grammar || grammar.length === 0)) {
      return (
        <motion.div variants={itemVariants}>
          <Box
            sx={{
              textAlign: 'center',
              p: 8,
              borderRadius: '12px',
              background: isDarkMode
                ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 80, mb: 3 }} />
            <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
              太棒了！🎉
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              今天没有需要复习的项目，继续保持！
            </Typography>
          </Box>
        </motion.div>
      );
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Vocabulary Section */}
        {vocab && vocab.length > 0 && (
          <motion.div variants={itemVariants}>
            <Box>
              <Box
                sx={{
                  borderRadius: '12px',
                  boxShadow: theme.shadows[3],
                  p: 3,
                  mb: 4,
                  background: isDarkMode
                    ? 'linear-gradient(135deg, #2b6cb0 0%, #1e40af 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AutoStoriesIcon sx={{ fontSize: 32, color: 'white' }} />
                  <Box>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                      单词复习
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      共 {vocab.length} 个单词需要复习
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Box 
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)"
                  },
                  gap: 3
                }}
              >
                {vocab.map((item) => (
                  <motion.div
                    key={`vocab-${item.id}`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <WordCard 
                      {...item} 
                      onMasteryChange={(id, level) => handleMasteryChange(id, level, 'word')} 
                    />
                  </motion.div>
                ))}
              </Box>
            </Box>
          </motion.div>
        )}

        {/* Grammar Section */}
        {grammar && grammar.length > 0 && (
          <motion.div variants={itemVariants}>
            <Box>
              <Box
                sx={{
                  borderRadius: '12px',
                  boxShadow: theme.shadows[3],
                  p: 3,
                  mb: 4,
                  background: isDarkMode
                    ? 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)'
                    : 'linear-gradient(135deg, #805ad5 0%, #9f7aea 100%)',
                  border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <MenuBookIcon sx={{ fontSize: 32, color: 'white' }} />
                  <Box>
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                      语法复习
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      共 {grammar.length} 个语法点需要复习
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {grammar.map((item) => (
                  <motion.div
                    key={`grammar-${item.id}`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <GrammarReviewCard 
                      {...item} 
                      onMasteryChange={(id, level) => handleMasteryChange(id, level, 'grammar')} 
                    />
                  </motion.div>
                ))}
              </Box>
            </Box>
          </motion.div>
        )}
      </Box>
    );
  };

  const handleStartReview = () => {
    // 滚动到复习内容区域
    const reviewContent = document.getElementById('review-content');
    if (reviewContent) {
      reviewContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartStudy = () => {
    navigate('/learn');
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Header Section */}
        <motion.div variants={itemVariants}>
          <Box
            sx={{
              borderRadius: '12px',
              boxShadow: theme.shadows[4],
              p: 4,
              mb: 6,
              background: isDarkMode
                ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <SchoolIcon sx={{ fontSize: 40, color: 'white', mb: 1 }} />
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                今日复习 📚
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                温故而知新，巩固已学知识点
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Smart Reminder Section */}
        <motion.div variants={itemVariants}>
          <Box sx={{ mb: 6 }}>
            <SmartReminder 
              onStartReview={handleStartReview}
              onStartStudy={handleStartStudy}
            />
          </Box>
        </motion.div>
        
        {/* Content */}
        <div id="review-content">
          {renderContent()}
        </div>
      </motion.div>
    </Box>
  );
};

export default ReviewPage;