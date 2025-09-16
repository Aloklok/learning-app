import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Theme Context
import { useThemeMode } from '../hooks/useThemeMode';

// Material Kit Components
import MKBox from '@mk_components/MKBox';
import MKTypography from '@mk_components/MKTypography';
import MKButton from '@mk_components/MKButton';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import BookIcon from '@mui/icons-material/Book';

interface Lesson {
  id: number;
  book_id: number;
  lesson_number: number;
  title: string;
}

const LessonListPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [bookTitle, setBookTitle] = useState('加载中...');
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<number>>(new Set());
  const { isDarkMode } = useThemeMode();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  useEffect(() => {
    if (!bookId) {
      navigate('/library');
      return;
    }

    const fetchPageData = async () => {
      if (window.db) {
        try {
          const [fetchedLessons, fetchedCompletedIds] = await Promise.all([
            window.db.getLessonsByBookId(Number(bookId)),
            // 检查 window.db 接口中是否存在 getCompletedLessons 方法
            window.db.getCompletedLessons ? window.db.getCompletedLessons() : Promise.resolve([])
          ]);
          
          setLessons(fetchedLessons);
          setCompletedLessonIds(new Set(fetchedCompletedIds));

          if (window.db.getAllBooks) {
            const allBooks = await window.db.getAllBooks();
            const currentBook = allBooks.find(book => book.id === Number(bookId));
            if (currentBook) {
              setBookTitle(currentBook.title);
            }
          }
        } catch (error) {
          console.error(`Failed to fetch page data for book ID ${bookId}:`, error);
        }
      }
    };

    fetchPageData();
  }, [bookId, navigate]);

  const handleBackToLibrary = () => {
    navigate('/library');
  };

  const handleViewLesson = (lessonId: number) => {
    navigate(`/pure-course/${lessonId}`, { state: { fromLibrary: true } });
  };

  return (
    <MKBox 
      p={{ xs: 2, md: 4 }}
      sx={{
        minHeight: '100vh',
        background: isDarkMode 
          ? 'linear-gradient(135deg, #121218 0%, #1a1a20 50%, #1e1e24 100%)'
          : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      }}
    >
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Header Section */}
        <motion.div variants={itemVariants}>
          <MKBox 
            variant="gradient" 
            bgColor="success" 
            borderRadius="lg" 
            shadow="lg" 
            p={4} 
            mb={6}
            sx={{
              background: isDarkMode
                ? 'linear-gradient(135deg, #3182ce 0%, #2c5282 100%)'
                : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            }}
          >
            <MKBox display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <MKBox>
                <MKTypography variant="h2" color="white" fontWeight="bold" mb={1}>
                  {bookTitle} 📖
                </MKTypography>
                <MKTypography variant="h6" color="rgba(255,255,255,0.8)">
                  选择课程开始学习
                </MKTypography>
              </MKBox>
              <MKButton
                variant="contained"
                color="white"
                size="large"
                startIcon={<ArrowBackIcon />}
                onClick={handleBackToLibrary}
                sx={{
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.3)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                返回教材库
              </MKButton>
            </MKBox>
          </MKBox>
        </motion.div>

        {/* Lessons List */}
        <motion.div variants={itemVariants}>
          {lessons.length === 0 ? (
            <MKBox
              textAlign="center"
              p={6}
              borderRadius="lg"
              sx={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, #242429 0%, #2a2a30 100%)'
                  : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                border: isDarkMode
                  ? '2px dashed rgba(255,255,255,0.1)'
                  : '2px dashed rgba(0,0,0,0.1)',
              }}
            >
              <BookIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <MKTypography variant="h5" color="text.secondary" mb={2}>
                还没有课程
              </MKTypography>
              <MKTypography variant="body1" color="text.secondary">
                这本书还没有添加任何课程内容。
              </MKTypography>
            </MKBox>
          ) : (
            <MKBox display="flex" flexDirection="column" gap={3}>
              {lessons.map((lesson) => (
                <motion.div
                  key={lesson.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <MKBox
                    variant="gradient"
                    bgColor="white"
                    borderRadius="xl"
                    shadow="md"
                    p={4}
                    sx={{
                      background: isDarkMode
                        ? 'linear-gradient(135deg, #242429 0%, #2a2a30 100%)'
                        : 'white',
                      border: isDarkMode
                        ? '1px solid rgba(255,255,255,0.08)'
                        : '1px solid rgba(0,0,0,0.05)',
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                    onClick={() => handleViewLesson(lesson.id)}
                  >
                    <MKBox display="flex" alignItems="center" justifyContent="space-between">
                      <MKBox display="flex" alignItems="center" gap={3}>
                        {/* Lesson Number Badge */}
                        <MKBox
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            background: completedLessonIds.has(lesson.id)
                              ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                          }}
                        >
                          {lesson.lesson_number}
                        </MKBox>

                        {/* Lesson Info */}
                        <MKBox>
                          <MKTypography variant="h5" fontWeight="bold" color="text.primary" mb={1}>
                            第 {lesson.lesson_number} 课: {lesson.title}
                          </MKTypography>
                          <MKTypography variant="body2" color="text.secondary">
                            {completedLessonIds.has(lesson.id) ? '已完成' : '待学习'}
                          </MKTypography>
                        </MKBox>
                      </MKBox>

                      <MKBox display="flex" alignItems="center" gap={2}>
                        {/* Completion Status */}
                        {completedLessonIds.has(lesson.id) && (
                          <MKBox
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              px: 2,
                              py: 1,
                              borderRadius: '20px',
                              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                              color: 'white',
                            }}
                          >
                            <CheckCircleIcon sx={{ fontSize: 20 }} />
                            <MKTypography variant="caption" fontWeight="bold">
                              已完成
                            </MKTypography>
                          </MKBox>
                        )}

                        {/* Play Button */}
                        <MKBox
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <PlayCircleOutlineIcon sx={{ fontSize: 24 }} />
                        </MKBox>
                      </MKBox>
                    </MKBox>
                  </MKBox>
                </motion.div>
              ))}
            </MKBox>
          )}
        </motion.div>
      </motion.div>
    </MKBox>
  );
};

export default LessonListPage;