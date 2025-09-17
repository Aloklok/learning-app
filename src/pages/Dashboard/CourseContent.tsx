import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// MUI Components
import { Box, Typography } from '@mui/material';

// Custom Hooks & Components
import { useDatabase } from '../../hooks/useDatabase';
import CourseView from '../../components/CourseView';

// Global Types
import type { Lesson, Book } from '../../types/models';

// Icons
import SchoolIcon from '@mui/icons-material/School';

const CourseContent: React.FC = () => {
  const { lessonId } = useParams<{ lessonId?: string }>();
  const navigate = useNavigate();

  const { data: currentLearningState, loading: learningStateLoading } = useDatabase<{ currentLesson: Lesson; book: Book } | null>(
    'getCurrentLearningState',
    [],
    !!lessonId
  );

  const [displayLessonId, setDisplayLessonId] = useState<number | null>(null);

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
    const numericLessonId = lessonId ? Number(lessonId) : null;
    if (numericLessonId) {
      setDisplayLessonId(numericLessonId);
      return;
    }
    
    if (!learningStateLoading) {
      if (currentLearningState?.currentLesson) {
        navigate(`/learn/${currentLearningState.currentLesson.id}`, { replace: true });
      } else {
        navigate('/library');
      }
    }
  }, [lessonId, navigate, learningStateLoading, currentLearningState]);

  // Enhanced loading state with better design
  if (!lessonId && learningStateLoading) {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            p: 6,
            borderRadius: "xl",
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            border: '1px solid rgba(0,0,0,0.05)',
          }}
        >
          <motion.div
            variants={itemVariants}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <SchoolIcon sx={{ fontSize: 60, color: 'primary.main', mb: 3 }} />
          </motion.div>
          <Typography variant="h5" color="text.primary" fontWeight="bold" sx={{ mb: 2 }}>
            正在加载课程...
          </Typography>
          <Typography variant="body1" color="text.secondary">
            请稍候，我们正在为您准备学习内容
          </Typography>
        </Box>
      </motion.div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Box
        sx={{
          borderRadius: "xl",
          boxShadow: 4,
          p: { xs: 2, sm: 3 },
          mt: 4,
          background: 'white',
          border: '1px solid rgba(0,0,0,0.05)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        <AnimatePresence mode="wait">
          {displayLessonId && (
            <motion.div
              key={displayLessonId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <CourseView lessonId={displayLessonId} />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </motion.div>
  );
};

export default CourseContent;